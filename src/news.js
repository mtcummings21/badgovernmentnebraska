// Aggregates Nebraska government/politics news from RSS feeds published by
// two nonprofit newsrooms that explicitly make their work available for
// exactly this kind of use:
//   - Nebraska Examiner (part of States Newsroom) publishes a dedicated
//     "republishable stories" feed excluding DC/national content.
//   - Flatwater Free Press states all its work is "available for
//     publication at no cost."
// Uses cheerio's XML mode to parse RSS <item> elements (already a
// dependency for the senator scraper, so no new package needed).

const cheerio = require("cheerio");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; KStreetChroniclesNE/0.1; +https://github.com/mtcummings21/badgovernmentnebraska)",
};

const FEEDS = [
  { url: "https://nebraskaexaminer.com/feed/localFeed", source: "Nebraska Examiner" },
  { url: "https://flatwaterfreepress.org/feed/", source: "Flatwater Free Press" },
];

const SNIPPET_MAX_LENGTH = 220;

function stripHtml(str) {
  return (str || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trim() + "\u2026";
}

async function fetchFeed(url, source) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const items = [];
  $("item").each((_, el) => {
    const $el = $(el);
    const title = stripHtml($el.find("title").first().text());
    const link = $el.find("link").first().text().trim();
    const pubDateRaw = $el.find("pubDate").first().text().trim();
    const snippet = truncate(stripHtml($el.find("description").first().text()), SNIPPET_MAX_LENGTH);
    if (!title || !link) return;

    const pubDate = pubDateRaw ? new Date(pubDateRaw) : null;
    items.push({
      id: Buffer.from(link).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 16),
      title,
      link,
      source,
      pubDate: pubDate && !isNaN(pubDate) ? pubDate.toISOString() : null,
      snippet,
    });
  });

  return items;
}

/** Fetch all configured feeds, merge, and sort newest-first. Throws only if every feed fails. */
async function fetchAllNews() {
  const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f.url, f.source)));

  const articles = [];
  const errors = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") articles.push(...r.value);
    else errors.push(`${FEEDS[i].source}: ${r.reason.message}`);
  });

  if (articles.length === 0) {
    throw new Error(errors.join("; ") || "No articles returned from any feed.");
  }

  articles.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
  return { articles, errors };
}

module.exports = { fetchAllNews, FEEDS };
