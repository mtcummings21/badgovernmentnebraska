// LegiScan's getMasterList and our mock bill data both represent sponsors as
// plain strings like "Sen. K. Bostelman" rather than a structured id. The
// senator roster (live-scraped or mock) is the source of truth for who's
// actually in office, keyed by district. This module bridges the two by
// matching on last name, which is reliable in a 49-member unicameral body
// where duplicate surnames are rare to nonexistent in a given session.
//
// This is a heuristic, not a guarantee: if two current senators ever share a
// last name, or a sponsor string doesn't include a recognizable surname,
// the match will silently fail (return null) rather than guess wrong.

/** Pull the last "word" out of a sponsor string like "Sen. K. Bostelman". */
function extractLastName(sponsorName) {
  if (!sponsorName) return null;
  const cleaned = sponsorName.replace(/^Sen\.?\s*/i, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  return parts[parts.length - 1].toLowerCase();
}

/**
 * @param {string} sponsorName - raw sponsor string from a bill record
 * @param {Array} roster - array of senator records with a `lastName` field
 * @returns {string|null} matching senator id, or null if no confident match
 */
function matchSenatorId(sponsorName, roster) {
  const lastName = extractLastName(sponsorName);
  if (!lastName || !roster || roster.length === 0) return null;

  const matches = roster.filter((s) => (s.lastName || "").toLowerCase() === lastName);
  if (matches.length === 1) return matches[0].id;
  return null; // 0 matches (unknown) or 2+ matches (ambiguous) both bail out
}

/** Enrich an array of sponsor name strings into { name, senatorId } objects. */
function enrichSponsors(sponsorNames, roster) {
  return (sponsorNames || []).map((name) => ({
    name,
    senatorId: matchSenatorId(name, roster),
  }));
}

module.exports = { extractLastName, matchSenatorId, enrichSponsors };
