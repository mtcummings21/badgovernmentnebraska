// Scrapes nebraskalegislature.gov for senator roster and detail data.
// There's no API for this (unlike bills, which come from LegiScan), so this
// is HTML scraping against the official site's public pages:
//   - Roster:  /senators/senator_list.php
//   - Detail:  /senators/landing-pages/index.php?District=N
//
// IMPORTANT CAVEAT: this was written against a snapshot of the live markup
// fetched during development, not tested end-to-end against the running
// site (this dev environment can't reach nebraskalegislature.gov directly).
// It parses by structural HTML tags (h1-h6, links, list items) rather than
// guessing CSS class names, and falls back to src/mockSenators.js on any
// failure — same pattern as the LegiScan bill fetch in server.js — so a
// scraping break degrades gracefully instead of taking the site down. If
// fields come back null/empty after deploying, inspect the actual page HTML
// and adjust the line-matching regexes below.

const cheerio = require("cheerio");

const BASE_URL = "https://nebraskalegislature.gov";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; LedgerNE/0.1; +https://github.com/mtcummings21/badgovernmentnebraska)",
};

async function getHtml(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

function photoUrlForDistrict(district) {
  const padded = String(district).padStart(2, "0");
  return `https://www.nebraskalegislature.gov/media/images/senators/dist${padded}/highres/dist${padded}.jpg`;
}

/**
 * Flattens HTML into an ordered array of trimmed, non-empty text lines,
 * inserting line breaks at block-level and list boundaries first. This lets
 * detail-parsing rely on text order (robust to unknown CSS classes) rather
 * than exact DOM nesting.
 */
function htmlToLines(html) {
  const $ = cheerio.load(html);
  $("script, style, nav, header, footer").remove();
  $("br").replaceWith("\n");
  $("h1, h2, h3, h4, h5, h6, p, li, div, tr").each((_, el) => {
    $(el).append("\n");
  });
  return $("body")
    .text()
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** Fetch and parse the full 49-member senator roster. */
async function fetchSenatorRoster() {
  const html = await getHtml(`${BASE_URL}/senators/senator_list.php`);
  const $ = cheerio.load(html);
  const roster = new Map(); // district -> record, dedupes the site's two sort-order listings

  $('a[href*="District="]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const match = href.match(/District=(\d+)/);
    if (!match) return;
    const district = Number(match[1]);

    let text = $(el).text().trim();
    // The site concatenates the district number directly onto the link text
    // in some layouts (e.g. "Andersen, Bob49") — strip it if present.
    text = text.replace(new RegExp(`${district}$`), "").trim();

    const commaIdx = text.indexOf(",");
    if (commaIdx === -1) return;
    const lastName = text.slice(0, commaIdx).trim();
    const firstName = text.slice(commaIdx + 1).trim();
    if (!lastName || !firstName) return;

    roster.set(district, {
      id: String(district),
      district,
      lastName,
      firstName,
      fullName: `Sen. ${firstName} ${lastName}`,
      photoUrl: photoUrlForDistrict(district),
    });
  });

  if (roster.size === 0) throw new Error("Senator roster parse returned zero entries.");
  return Array.from(roster.values()).sort((a, b) => a.district - b.district);
}

/** Fetch and parse a single senator's detail page by district number. */
async function fetchSenatorDetail(district) {
  const url = `${BASE_URL}/senators/landing-pages/index.php?District=${district}`;
  const html = await getHtml(url);
  const $ = cheerio.load(html);
  const lines = htmlToLines(html);

  const fullName = lines.find((l) => /^Sen\.\s+\S/.test(l)) || null;
  const lastName = fullName ? fullName.replace(/^Sen\.\s+/, "").trim().split(/\s+/).pop() : null;

  const distIdx = lines.findIndex((l) => /^District\s+\d+/i.test(l));
  const caIdx = lines.findIndex((l) => /^Committee Assignments$/i.test(l));
  const resIdx = lines.findIndex((l) => /^Resources$/i.test(l));
  const bioIdx = lines.findIndex((l) => /^Biography$/i.test(l));

  const contactLines = distIdx !== -1 && caIdx !== -1 ? lines.slice(distIdx + 1, caIdx) : [];
  const phoneLine = contactLines.find((l) => /\(\d{3}\)\s*\d{3}-\d{4}/.test(l));
  const phone = phoneLine ? (phoneLine.match(/\(\d{3}\)\s*\d{3}-\d{4}/) || [])[0] : null;
  const emailLine = contactLines.find((l) => /email:/i.test(l));
  const email = emailLine ? (emailLine.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [])[0] : null;

  const committeeLines = caIdx !== -1 && resIdx !== -1 ? lines.slice(caIdx + 1, resIdx) : [];
  const committees = committeeLines
    .map((l) => l.replace(/^-+\s*/, "").trim())
    .filter((l) => l && !/^\(LB\d+\)$/i.test(l))
    .map((name) => ({
      name: name.replace(/\s*\(LB\d+\)\s*$/i, ""), // strip trailing "(LB605)" style special-committee tags
      // The landing page doesn't reliably mark chairs; leave role as Member
      // and let it be corrected manually or by a future committees-page scrape.
      role: "Member",
    }));

  const bioEndMarkers = ["Search Current Bills", "Prefix Selection"];
  let bio = null;
  if (bioIdx !== -1) {
    const bioLines = [];
    for (let i = bioIdx + 1; i < lines.length; i++) {
      if (bioEndMarkers.some((m) => lines[i].startsWith(m))) break;
      bioLines.push(lines[i]);
    }
    bio = bioLines.join(" ").trim() || null;
  }

  const electedMatch = bio && bio.match(/Elected to Nebraska Legislature:\s*(\d{4})/i);
  const electedYear = electedMatch ? Number(electedMatch[1]) : null;

  const introducerHref = $('a[href*="search_by_introducer.php"]').first().attr("href") || "";
  const introducerMatch = introducerHref.match(/Introducer=(\d+)/);
  const introducerId = introducerMatch ? introducerMatch[1] : null;

  return {
    id: String(district),
    district: Number(district),
    fullName,
    lastName,
    phone,
    email,
    committees,
    bio,
    electedYear,
    photoUrl: photoUrlForDistrict(district),
    officialUrl: url,
    billsIntroducedUrl: introducerId
      ? `${BASE_URL}/bills/search_by_introducer.php?Introducer=${introducerId}&legislature=ALL`
      : null,
  };
}

module.exports = { fetchSenatorRoster, fetchSenatorDetail, photoUrlForDistrict };
