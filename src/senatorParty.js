// Party affiliation by district, for the current (2025-2026) Nebraska
// Legislature session.
//
// The Unicameral is officially nonpartisan -- no party appears on the
// ballot, and it isn't listed on the official senator pages src/senators.js
// scrapes -- so this is hand-maintained rather than scraped. Compiled from
// the Nebraska Democratic Party's own all-49-member directory (which lists
// every senator's party, not just Democrats) and cross-checked against the
// partisan breakdown in Wikipedia's Nebraska Legislature infobox
// (33 Republican, 15 Democratic, 1 Independent) as of August 2026.
//
// IMPORTANT: 24 of the 49 seats are on the ballot November 3, 2026.
// Whoever wins takes office in January 2027 -- update the affected
// district entries below once results are certified. Same seasonal-update
// pattern as src/constitutionalOffices.js.

const PARTY_BY_DISTRICT = {
  1: "R", 2: "R", 3: "D", 4: "R", 5: "D", 6: "D", 7: "D", 8: "I",
  9: "D", 10: "D", 11: "D", 12: "R", 13: "D", 14: "R", 15: "R",
  16: "R", 17: "R", 18: "R", 19: "R", 20: "D", 21: "R", 22: "R",
  23: "R", 24: "R", 25: "R", 26: "D", 27: "D", 28: "D", 29: "D",
  30: "R", 31: "R", 32: "R", 33: "R", 34: "R", 35: "D", 36: "R",
  37: "R", 38: "R", 39: "R", 40: "R", 41: "R", 42: "R", 43: "R",
  44: "R", 45: "R", 46: "D", 47: "R", 48: "R", 49: "R",
};

const PARTY_LABELS = { R: "Republican", D: "Democratic", I: "Independent" };

function partyForDistrict(district) {
  return PARTY_BY_DISTRICT[Number(district)] || null;
}

function partyLabel(code) {
  return PARTY_LABELS[code] || null;
}

module.exports = { PARTY_BY_DISTRICT, PARTY_LABELS, partyForDistrict, partyLabel };
