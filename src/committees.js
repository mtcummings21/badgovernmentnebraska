// Nebraska Legislature's 14 standing committees for the 2025-2026 session:
// chair and full membership, keyed by district number (cross-referenced
// against the live or sample senator roster at request time so names,
// photos, and links stay in sync automatically).
//
// Hand-maintained, not scraped -- committee assignments aren't reliably
// present on the official per-senator pages src/senators.js reads (see the
// caveat in that file), so this is sourced from the Nebraska Democratic
// Party's own committee directory, which lists chair and full membership
// for all 14 committees regardless of party
// (nebraskademocrats.org/25-26-nebraska-legislature/, current as of
// February 2026).
//
// IMPORTANT: committee assignments are typically reorganized at the start
// of each legislative session (next: January 2027, after the November 2026
// election) -- revisit this file then.

const standingCommittees = [
  { name: "Agriculture", chairDistrict: 40, memberDistricts: [16, 36, 44, 31, 41, 28, 23] },
  { name: "Appropriations", chairDistrict: 2, memberDistricts: [18, 6, 30, 19, 34, 27, 13, 47] },
  { name: "Banking, Commerce and Insurance", chairDistrict: 42, memberDistricts: [29, 26, 1, 48, 12, 4, 15] },
  { name: "Business and Labor", chairDistrict: 31, memberDistricts: [16, 44, 41, 11, 28, 39] },
  { name: "Education", chairDistrict: 38, memberDistricts: [46, 24, 8, 5, 33, 17, 45] },
  { name: "General Affairs", chairDistrict: 36, memberDistricts: [49, 9, 37, 40, 35, 3, 23] },
  { name: "Government, Military and Veterans Affairs", chairDistrict: 45, memberDistricts: [49, 9, 7, 8, 33, 41, 15] },
  { name: "Health and Human Services", chairDistrict: 48, memberDistricts: [21, 20, 16, 17, 35, 12] },
  { name: "Judiciary", chairDistrict: 25, memberDistricts: [10, 1, 36, 11, 3, 43, 23] },
  { name: "Natural Resources", chairDistrict: 32, memberDistricts: [37, 46, 40, 24, 5, 22, 28] },
  { name: "Nebraska Retirement Systems", chairDistrict: 21, memberDistricts: [2, 46, 48, 5, 39] },
  { name: "Revenue", chairDistrict: 4, memberDistricts: [29, 26, 44, 42, 31, 38, 39] },
  { name: "Transportation and Telecommunications", chairDistrict: 22, memberDistricts: [21, 25, 32, 10, 20, 7, 43] },
  { name: "Urban Affairs", chairDistrict: 11, memberDistricts: [49, 9, 37, 35, 3, 39] },
];

module.exports = { standingCommittees };
