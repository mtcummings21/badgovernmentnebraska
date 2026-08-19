require("dotenv").config();
const express = require("express");
const path = require("path");
const { fetchBillList, fetchBillDetail } = require("./src/legiscan");
const { mockBills } = require("./src/mockData");
const { fetchSenatorRoster, fetchSenatorDetail } = require("./src/senators");
const { mockSenators } = require("./src/mockSenators");
const { constitutionalOffices } = require("./src/constitutionalOffices");
const { fetchAllNews } = require("./src/news");
const { mockNews } = require("./src/mockNews");
const { enrichSponsors } = require("./src/nameMatch");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.LEGISCAN_API_KEY || "";

// Static facts about Nebraska Unicameral service terms -- these don't change
// often enough to need a live source, and there isn't a clean API/scrape
// target for them anyway. See nebraskalegislature.gov/senators/senators.php
// and /feature/faq_senators.php.
const TERM_INFO = {
  termLength: "4-year term",
  termLimit: "Term-limited after two consecutive terms, then must wait four years before running again.",
  districts: 49,
  salary: "$12,000 per year ($1,000/month), per the Nebraska Constitution",
};

// Bill data refreshes often during session (LegiScan's own snapshots update
// weekly), so a short cache. Senator roster/bio data changes rarely -- mostly
// at the start of a biennium -- so it gets a much longer one.
const BILL_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const SENATOR_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const NEWS_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

let listCache = { data: null, fetchedAt: 0 };
const detailCache = new Map(); // billId -> { data, fetchedAt }

let rosterCache = { data: null, fetchedAt: 0, source: null };
const senatorDetailCache = new Map(); // senatorId -> { data, fetchedAt, source }

let newsCache = { data: null, fetchedAt: 0, source: null };

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
  res.json({
    liveDataConfigured: Boolean(API_KEY),
    source: API_KEY ? "legiscan" : "mock",
  });
});

// ---------- Roster helper (shared by bill sponsor enrichment + senator routes) ----------

// The roster page itself (senator_list.php) only has name + district; elected
// year lives on each senator's individual detail page. Rather than make the
// list view wait on 49 sequential detail fetches, pull them with a small
// concurrency cap and cache each detail result along the way, so a later
// click into a senator's profile is already warm.
const ROSTER_ENRICH_CONCURRENCY = 6;

async function enrichRosterWithElectedYears(roster) {
  const queue = [...roster];
  const worker = async () => {
    while (queue.length > 0) {
      const senator = queue.shift();
      try {
        const detail = await fetchSenatorDetail(senator.district);
        senator.electedYear = detail.electedYear;
        senatorDetailCache.set(senator.id, { data: detail, source: "official", fetchedAt: Date.now() });
      } catch (err) {
        console.error(`Could not fetch elected year for district ${senator.district}:`, err.message);
        senator.electedYear = null;
      }
    }
  };
  await Promise.all(Array.from({ length: ROSTER_ENRICH_CONCURRENCY }, worker));
  return roster;
}

async function getRoster() {
  const fresh = rosterCache.data && Date.now() - rosterCache.fetchedAt < SENATOR_CACHE_TTL_MS;
  if (fresh) return rosterCache;

  try {
    const data = await fetchSenatorRoster();
    await enrichRosterWithElectedYears(data);
    rosterCache = { data, fetchedAt: Date.now(), source: "official" };
  } catch (err) {
    console.error("Failed to scrape senator roster, falling back to sample data:", err.message);
    rosterCache = { data: mockSenators, fetchedAt: Date.now(), source: "mock" };
  }
  return rosterCache;
}

function withSponsorLinks(bill, roster) {
  return { ...bill, sponsors: enrichSponsors(bill.sponsors, roster) };
}

// ---------- Bills ----------

app.get("/api/bills", async (req, res) => {
  const roster = (await getRoster()).data;

  if (!API_KEY) {
    const bills = mockBills.map((b) => withSponsorLinks(b, roster));
    return res.json({ source: "mock", bills });
  }

  const fresh = listCache.data && Date.now() - listCache.fetchedAt < BILL_CACHE_TTL_MS;
  if (fresh) {
    return res.json({ source: "legiscan", bills: listCache.data.map((b) => withSponsorLinks(b, roster)) });
  }

  try {
    const bills = await fetchBillList(API_KEY);
    listCache = { data: bills, fetchedAt: Date.now() };
    res.json({ source: "legiscan", bills: bills.map((b) => withSponsorLinks(b, roster)) });
  } catch (err) {
    console.error("Failed to fetch from LegiScan, falling back to sample data:", err.message);
    const bills = mockBills.map((b) => withSponsorLinks(b, roster));
    res.json({ source: "mock", bills, warning: "LegiScan request failed; showing sample data." });
  }
});

app.get("/api/bills/:id", async (req, res) => {
  const { id } = req.params;
  const roster = (await getRoster()).data;

  if (!API_KEY) {
    const bill = mockBills.find((b) => b.id === id);
    if (!bill) return res.status(404).json({ error: "Bill not found in sample data." });
    return res.json({ source: "mock", bill: withSponsorLinks(bill, roster) });
  }

  const cached = detailCache.get(id);
  if (cached && Date.now() - cached.fetchedAt < BILL_CACHE_TTL_MS) {
    return res.json({ source: "legiscan", bill: withSponsorLinks(cached.data, roster) });
  }

  try {
    const bill = await fetchBillDetail(API_KEY, id);
    detailCache.set(id, { data: bill, fetchedAt: Date.now() });
    res.json({ source: "legiscan", bill: withSponsorLinks(bill, roster) });
  } catch (err) {
    console.error("Failed to fetch bill detail from LegiScan:", err.message);
    res.status(502).json({ error: "Could not reach LegiScan for this bill." });
  }
});

// ---------- Senators ----------

app.get("/api/senators", async (req, res) => {
  const roster = await getRoster();
  res.json({ source: roster.source, termInfo: TERM_INFO, senators: roster.data });
});

app.get("/api/senators/:id", async (req, res) => {
  const { id } = req.params;
  const roster = await getRoster();

  const cached = senatorDetailCache.get(id);
  const fresh = cached && Date.now() - cached.fetchedAt < SENATOR_CACHE_TTL_MS;

  let detail, source;
  if (fresh) {
    ({ data: detail, source } = cached);
  } else if (roster.source === "mock") {
    detail = mockSenators.find((s) => s.id === id) || null;
    source = "mock";
    if (detail) senatorDetailCache.set(id, { data: detail, source, fetchedAt: Date.now() });
  } else {
    try {
      detail = await fetchSenatorDetail(id);
      source = "official";
      senatorDetailCache.set(id, { data: detail, source, fetchedAt: Date.now() });
    } catch (err) {
      console.error(`Failed to scrape senator detail for district ${id}, falling back to sample data:`, err.message);
      detail = mockSenators.find((s) => s.id === id) || null;
      source = "mock";
    }
  }

  if (!detail) return res.status(404).json({ error: "Senator not found." });

  res.json({
    source,
    termInfo: TERM_INFO,
    senator: detail,
  });
});

// ---------- News ----------

// Merges RSS feeds from Nebraska Examiner and Flatwater Free Press (see
// src/news.js for why these two). Falls back to sample headlines if every
// feed fails, same pattern as bills/senators.
app.get("/api/news", async (req, res) => {
  const fresh = newsCache.data && Date.now() - newsCache.fetchedAt < NEWS_CACHE_TTL_MS;
  if (fresh) {
    return res.json({ source: newsCache.source, articles: newsCache.data });
  }

  try {
    const { articles, errors } = await fetchAllNews();
    newsCache = { data: articles, fetchedAt: Date.now(), source: "rss" };
    const payload = { source: "rss", articles };
    if (errors.length > 0) payload.warning = `Some feeds failed: ${errors.join("; ")}`;
    res.json(payload);
  } catch (err) {
    console.error("Failed to fetch any news feed, falling back to sample data:", err.message);
    newsCache = { data: mockNews, fetchedAt: Date.now(), source: "mock" };
    res.json({ source: "mock", articles: mockNews, warning: "RSS feeds unreachable; showing sample data." });
  }
});

// ---------- Constitutional offices ----------

// Hand-maintained, not scraped -- see src/constitutionalOffices.js for why.
// Note: all six offices are up for election November 3, 2026.
app.get("/api/offices", (req, res) => {
  res.json({
    offices: constitutionalOffices,
    note: "All six offices are on the ballot November 3, 2026; officeholders take office in January 2027.",
  });
});

app.listen(PORT, () => {
  console.log(`Nebraska Bill Tracker running at http://localhost:${PORT}`);
  console.log(API_KEY ? "Using live LegiScan data." : "No LEGISCAN_API_KEY set -- serving sample data.");
});
