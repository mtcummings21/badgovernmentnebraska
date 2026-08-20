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

const GENERAL_ELECTION_DATE = "November 3, 2026";
const PRIMARY_ELECTION_DATE = "May 12, 2026";

const statewideRaces = [
  {
    office: "Governor & Lieutenant Governor",
    seatNote: "Gov. Jim Pillen and Lt. Gov. Joe Kelly (R) are seeking reelection.",
    candidates: [
      { name: "Jim Pillen", runningMate: "Joe Kelly", party: "R", incumbent: true },
      { name: "Lynne Walz", runningMate: "Ben Steffen", party: "D" },
      { name: "Rick Beard", runningMate: "running mate not yet named", party: "I", partyLabel: "Legal Marijuana Now" },
    ],
  },
  {
    office: "Secretary of State",
    seatNote: "Incumbent Bob Evnen (R) lost renomination to Scott Petersen in the Republican primary.",
    candidates: [
      { name: "Scott Petersen", party: "R" },
      { name: "Sarah Slattery", party: "D" },
    ],
  },
  {
    office: "Attorney General",
    seatNote: "Attorney General Mike Hilgers (R) is seeking reelection.",
    candidates: [
      { name: "Mike Hilgers", party: "R", incumbent: true },
      { name: "Jocelyn Brasher", party: "D" },
    ],
  },
  {
    office: "State Treasurer",
    seatNote: "Treasurer Joey Spellerberg (R), appointed in November 2025, is running to keep the seat.",
    candidates: [
      { name: "Joey Spellerberg", party: "R", incumbent: true },
      { name: "Dan Ebers", party: "D" },
    ],
  },
  {
    office: "Auditor of Public Accounts",
    seatNote: "Auditor Mike Foley (R) is seeking reelection.",
    candidates: [{ name: "Mike Foley", party: "R", incumbent: true }],
    note: "Running unopposed on the general election ballot.",
  },
];

const legislatureRaces = [
  { district: 2, seatNote: "Open seat \u2014 Sen. Robert Clements (R) is term-limited.", candidates: [{ name: "Dean Helmick", party: "R" }, { name: "Caitlin Knutson", party: "D" }] },
  { district: 4, seatNote: "Sen. Brad von Gillern (R) is seeking reelection.", candidates: [{ name: "Brad von Gillern", party: "R", incumbent: true }, { name: "Cindy Maxwell-Ostdiek", party: "I", partyLabel: "Nonpartisan" }], note: "Maxwell-Ostdiek led the primary count 52%\u201348%." },
  { district: 6, seatNote: "Open seat \u2014 Sen. Machaela Cavanaugh (D) is term-limited.", candidates: [{ name: "Patrick Leahy", party: "D" }, { name: "Nate Ostdiek", party: "D" }] },
  { district: 8, seatNote: "Open seat \u2014 Sen. Megan Hunt (I) is term-limited.", candidates: [{ name: "Erin Feichtinger", party: "D" }, { name: "Josh Livingston", party: "D" }] },
  { district: 10, seatNote: "Open seat \u2014 Sen. Wendy DeBoer (D) is term-limited.", candidates: [{ name: "Cindy Johnson", party: "D" }, { name: "Rebecca Rens", party: "R" }] },
  { district: 12, seatNote: "Sen. Merv Riepe (R) is seeking reelection.", candidates: [{ name: "Merv Riepe", party: "R", incumbent: true }, { name: "Christy Knorr", party: "D" }], note: "A crowded field \u2014 Riepe led the primary with just 38% of the vote." },
  { district: 14, seatNote: "Open seat \u2014 Speaker John Arch (R) is term-limited.", candidates: [{ name: "SuAnn Witt", party: "D" }, { name: "Bill Bowes", party: "R" }] },
  { district: 16, seatNote: "Open seat \u2014 Sen. Ben Hansen (R) is term-limited.", candidates: [{ name: "Ted Japp", party: "R" }, { name: "Cindy Chatt", party: "D" }] },
  { district: 18, seatNote: "Open seat \u2014 Sen. Christy Armendariz (R) is retiring.", candidates: [{ name: "Jess Goldoni", party: "D" }, { name: "Taylor Royal", party: "R" }] },
  { district: 20, seatNote: "Sen. John Fredrickson (D) is seeking reelection.", candidates: [{ name: "John Fredrickson", party: "D", incumbent: true }, { name: "Chris Anderson", party: "R" }] },
  { district: 22, seatNote: "Open seat \u2014 Sen. Mike Moser (R) is term-limited.", candidates: [{ name: "Dawson Brunswick", party: "R" }], note: "Unopposed as of the certified primary results." },
  { district: 24, seatNote: "Sen. Jana Hughes (R) is seeking reelection.", candidates: [{ name: "Jana Hughes", party: "R", incumbent: true }, { name: "Dan Winter", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 26, seatNote: "Sen. George Dungan (D) is seeking reelection.", candidates: [{ name: "George Dungan", party: "D", incumbent: true }, { name: "Tobias Howard", party: "R" }] },
  { district: 28, seatNote: "Open seat \u2014 Sen. Jane Raybould (D) is retiring.", candidates: [{ name: "Patty Pansing Brooks", party: "D", partyLabel: "Democratic, former state senator" }, { name: "Colby L. Woodson", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 30, seatNote: "Open seat \u2014 Sen. Myron Dorn (R) is term-limited.", candidates: [{ name: "Cally Ideus", party: "R" }, { name: "Janet M. Bock", party: "D" }] },
  { district: 32, seatNote: "Open seat \u2014 Sen. Tom Brandt (R) is term-limited.", candidates: [{ name: "Mark Schoenrock", party: "R" }, { name: "Shay Smith", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 34, seatNote: "Sen. Loren Lippincott (R) is seeking reelection.", candidates: [{ name: "Loren Lippincott", party: "R", incumbent: true }, { name: "Ben Blodgett", party: "D" }] },
  { district: 36, seatNote: "Sen. Rick Holdcroft (R) is seeking reelection.", candidates: [{ name: "Rick Holdcroft", party: "R", incumbent: true }, { name: "Darin Tompkins", party: "D" }], note: "Tompkins led the primary count 53%\u201347%." },
  { district: 38, seatNote: "Open seat \u2014 Sen. Dave Murman (R) is term-limited.", candidates: [{ name: "Tim Anderson", party: "R" }, { name: "Janell Anderson Ehrke", party: "R" }] },
  { district: 40, seatNote: "Sen. Barry DeKay (R) is seeking reelection.", candidates: [{ name: "Barry DeKay", party: "R", incumbent: true }], note: "Unopposed as of the certified primary results." },
  { district: 41, seatNote: "Special election for the remainder of the term after Sen. Dan McKeon (R) resigned in January 2026; appointed successor Fred Meyer (R) did not advance.", candidates: [{ name: "Joe Johnson", party: "R" }, { name: "Jeremy Heneger", party: "D" }], special: true },
  { district: 42, seatNote: "Sen. Mike Jacobson (R) is seeking reelection.", candidates: [{ name: "Mike Jacobson", party: "R", incumbent: true }, { name: "Shaylee S. Scranton", party: "I", partyLabel: "Nonpartisan" }] },
  { district: 44, seatNote: "Sen. Teresa Ibach (R) is seeking reelection.", candidates: [{ name: "Teresa Ibach", party: "R", incumbent: true }], note: "Unopposed as of the certified primary results." },
  { district: 46, seatNote: "Sen. Danielle Conrad (D) is seeking reelection.", candidates: [{ name: "Danielle Conrad", party: "D", incumbent: true }], note: "Unopposed as of the certified primary results." },
  { district: 48, seatNote: "Sen. Brian Hardin (R) is seeking reelection.", candidates: [{ name: "Brian Hardin", party: "R", incumbent: true }, { name: "Jessica M. Landers", party: "R" }] },
];

module.exports = { GENERAL_ELECTION_DATE, PRIMARY_ELECTION_DATE, statewideRaces, legislatureRaces };
