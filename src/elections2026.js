// 2026 Nebraska general election: statewide constitutional offices and all
// 25 Nebraska Legislature races (24 regular even-numbered districts plus a
// special election in District 41).
//
// Hand-maintained, not scraped -- there's no single official source for
// this in one place. Sourced from:
//   - Statewide races: politics1.com's Nebraska directory (updated Aug 14,
//     2026) and each race's Wikipedia/Ballotpedia page.
//   - Legislature races: Nebraska Examiner's "full slate" report published
//     May 13, 2026, the day after the May 12 primary
//     (nebraskaexaminer.com/2026/05/13/nebraska-legislative-race-voters-narrow-candidates-in-11-crowded-primaries/),
//     which lists the top-two finishers advancing to the general election
//     in every district.
//
// IMPORTANT: Nebraska's Legislature uses a nonpartisan blanket primary --
// the top two vote-getters advance regardless of party, which is why some
// districts below show two candidates from the same party (or neither
// candidate a Republican or Democrat). Statewide constitutional offices,
// by contrast, use separate partisan primaries. All results below are from
// the May 12, 2026 primary; the general election is November 3, 2026.

const { candidateDonors } = require("./donors2026");

const GENERAL_ELECTION_DATE = "November 3, 2026";
const PRIMARY_ELECTION_DATE = "May 12, 2026";

// Attach top-donor data (see donors2026.js) to a Governor candidate by name,
// so it's a no-op for candidates who don't have a matching NADC committee.
function withDonors(candidate) {
  const donors = candidateDonors[candidate.name];
  return donors ? { ...candidate, topDonors: donors } : candidate;
}

const statewideRaces = [
  {
    office: "Governor & Lieutenant Governor",
    candidates: [
      { name: "Jim Pillen", party: "R", incumbent: true },
      { name: "Lynne Walz", party: "D" },
      { name: "Rick Beard", party: "I", partyLabel: "Legal Marijuana Now" },
    ].map(withDonors),
  },
  {
    office: "Secretary of State",
    candidates: [
      { name: "Scott Petersen", party: "R" },
      { name: "Sarah Slattery", party: "D" },
    ].map(withDonors),
  },
  {
    office: "Attorney General",
    candidates: [
      { name: "Mike Hilgers", party: "R", incumbent: true },
      { name: "Jocelyn Brasher", party: "D" },
    ].map(withDonors),
  },
  {
    office: "State Treasurer",
    candidates: [
      { name: "Joey Spellerberg", party: "R", incumbent: true },
      { name: "Dan Ebers", party: "D" },
    ].map(withDonors),
  },
  {
    office: "Auditor of Public Accounts",
    candidates: [{ name: "Mike Foley", party: "R", incumbent: true }].map(withDonors),
  },
];

const legislatureRaces = [
  { district: 2, candidates: [{ name: "Dean Helmick", party: "R" }, { name: "Caitlin Knutson", party: "D" }] },
  { district: 4, candidates: [{ name: "Brad von Gillern", party: "R", incumbent: true }, { name: "Cindy Maxwell-Ostdiek", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 6, candidates: [{ name: "Patrick Leahy", party: "D" }, { name: "Nate Ostdiek", party: "D" }] },
  { district: 8, candidates: [{ name: "Erin Feichtinger", party: "D" }, { name: "Josh Livingston", party: "D" }] },
  { district: 10, candidates: [{ name: "Cindy Johnson", party: "D" }, { name: "Rebecca Rens", party: "R" }] },
  { district: 12, candidates: [{ name: "Merv Riepe", party: "R", incumbent: true }, { name: "Christy Knorr", party: "D" }] },
  { district: 14, candidates: [{ name: "SuAnn Witt", party: "D" }, { name: "Bill Bowes", party: "R" }] },
  { district: 16, candidates: [{ name: "Ted Japp", party: "R" }, { name: "Cindy Chatt", party: "D" }] },
  { district: 18, candidates: [{ name: "Jess Goldoni", party: "D" }, { name: "Taylor Royal", party: "R" }] },
  { district: 20, candidates: [{ name: "John Fredrickson", party: "D", incumbent: true }, { name: "Chris Anderson", party: "R" }] },
  { district: 22, candidates: [{ name: "Dawson Brunswick", party: "R" }] },
  { district: 24, candidates: [{ name: "Jana Hughes", party: "R", incumbent: true }, { name: "Dan Winter", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 26, candidates: [{ name: "George Dungan", party: "D", incumbent: true }, { name: "Tobias Howard", party: "R" }] },
  { district: 28, candidates: [{ name: "Patty Pansing Brooks", party: "D", partyLabel: "Democratic, former state senator" }, { name: "Colby L. Woodson", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 30, candidates: [{ name: "Cally Ideus", party: "R" }, { name: "Janet M. Bock", party: "D" }] },
  { district: 32, candidates: [{ name: "Mark Schoenrock", party: "R" }, { name: "Shay Smith", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 34, candidates: [{ name: "Loren Lippincott", party: "R", incumbent: true }, { name: "Ben Blodgett", party: "D" }] },
  { district: 36, candidates: [{ name: "Rick Holdcroft", party: "R", incumbent: true }, { name: "Darin Tompkins", party: "D" }] },
  { district: 38, candidates: [{ name: "Tim Anderson", party: "R" }, { name: "Janell Anderson Ehrke", party: "R" }] },
  { district: 40, candidates: [{ name: "Barry DeKay", party: "R", incumbent: true }] },
  { district: 41, candidates: [{ name: "Joe Johnson", party: "R" }, { name: "Jeremy Heneger", party: "D" }], special: true },
  { district: 42, candidates: [{ name: "Mike Jacobson", party: "R", incumbent: true }, { name: "Shaylee S. Scranton", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 44, candidates: [{ name: "Teresa Ibach", party: "R", incumbent: true }] },
  { district: 46, candidates: [{ name: "Danielle Conrad", party: "D", incumbent: true }] },
  { district: 48, candidates: [{ name: "Brian Hardin", party: "R", incumbent: true }, { name: "Jessica M. Landers", party: "R" }] },
];

module.exports = { GENERAL_ELECTION_DATE, PRIMARY_ELECTION_DATE, statewideRaces, legislatureRaces };
