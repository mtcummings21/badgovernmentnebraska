// Top individual and corporate donors for 2026 Nebraska statewide races
// (Governor, Secretary of State, Attorney General, State Treasurer, Auditor
// of Public Accounts).
//
// Hand-maintained, not scraped -- sourced directly from the Nebraska
// Accountability and Disclosure Commission's (NADC) bulk contribution/loan
// data exports (nadc-e.nebraska.gov/PublicSite/DataDownload.aspx), covering
// the 2023-2026 filing years as extracted 8/14/2026 (Governor race), 8/21/2026
// (Secretary of State and Attorney General races), and 8/22/2026 (Treasurer
// and Auditor races). Figures are cycle-to-date totals for each candidate's
// registered committee, aggregated by donor name across all four years and
// ranked by total dollars given. Excludes the state's own "$250-or-less, not
// itemized" small-dollar aggregate line and PAC/party-committee money
// (tracked separately, not shown here). Lists are top 10 by dollar amount,
// or fewer where a candidate simply doesn't have 10 distinct donors on file
// in that category (noted per-candidate below where that applies).
//
// individualDonorCount / individualAverage are computed across ALL itemized
// individual contributions (not just the top 10 shown), excluding NADC's
// lump-sum "$250-or-less" bucket -- there's no way to recover a donor count
// from that bucket since NADC reports it as a single unitemized total.
//
// COMMITTEES MATCHED:
// - Governor: "Jim Pillen for Governor," "Lynne Walz for Nebraska." Rick
//   Beard (Legal Marijuana Now) has no registered committee -- hasn't
//   crossed the $5,000 reporting threshold. Brett Lindstrom (independent)
//   filed a committee ("Friends of Lindstrom") but didn't gather enough
//   valid petition signatures to make the general-election ballot, so he's
//   intentionally excluded.
// - Secretary of State: "Petersen for Nebraska" (Scott Petersen) and
//   "Slattery for Nebraska" (Sarah Slattery). Petersen also has an older,
//   much smaller committee ("Friends of Scott Petersen," ~$2,000 raised in
//   2025 only) that appears to predate this campaign -- excluded here in
//   favor of his current, active committee.
// - Attorney General: "Friends of Mike Hilgers" (Mike Hilgers) and
//   "Brasher for NE AG" (Jocelyn Brasher).
// - State Treasurer: "Spellerberg for Nebraska" (Joey Spellerberg). He also
//   has an unrelated committee, "Joey Spellerberg for Mayor," from an
//   earlier Fremont mayoral run ($758K+ raised there) -- excluded here since
//   it isn't this race. Dan Ebers has no registered committee on file, so no
//   donor data exists for him.
// - Auditor of Public Accounts: Mike Foley (unopposed) -- his contributions
//   are combined from two committees, "Foley for the People- Auditor (2022)"
//   and "Foley for the People- Auditor (2026)." The "(2022)" committee is
//   his real ongoing committee (active every year 2023-2026, ~$71,750
//   total); "(2026)" is a newer, much smaller filing (~$1,500). Both appear
//   to fund the same current officeholder/candidate, so they're combined.
//
// REVISIT: these are cycle-to-date snapshots, not final. Update after later
// NADC filing deadlines as the general election nears.

const governorDonors = {
  "Jim Pillen": {
    committeeName: "Jim Pillen for Governor",
    totalRaised: 12927971,
    asOf: "2023\u20132026 NADC filings (cycle to date)",
    individualDonorCount: 694,
    individualAverage: 8403,
    corporate: [
      { name: "POET, LLC", location: "Sioux Falls, SD", amount: 300000 },
      { name: "Union Pacific Railroad Company", location: "Omaha, NE", amount: 285000 },
      { name: "Alliance Omaha Soccer LLC (dba Union Omaha)", location: "Papillion, NE", amount: 150000 },
      { name: "KAAPA Ethanol Holdings, LLC", location: "Kearney, NE", amount: 145000 },
      { name: "American Family Life Assurance Co. of Columbus (AFLAC)", location: "Columbus, GA", amount: 140000 },
      { name: "Chief Industries, Inc.", location: "Grand Island, NE", amount: 130000 },
      { name: "Siouxland Ethanol LLC", location: "Jackson, NE", amount: 125000 },
      { name: "Blackshirt Feeders LP", location: "Benkelman, NE", amount: 125000 },
      { name: "Wholestone Farm II, LLC", location: "Fremont, NE", amount: 100000 },
      { name: "Foote Cattle Company LLC", location: "Bucyrus, KS", amount: 100000 },
    ],
    individual: [
      { name: "Shawn Peed", location: "Lincoln, NE", amount: 285000 },
      { name: "Thomas (Tom) Peed", location: "Lincoln, NE", amount: 285000 },
      { name: "Guy Ellsworth", location: "Pierce, NE", amount: 250000 },
      { name: "Rachel Werner", location: "Valley, NE", amount: 250000 },
      { name: "C.G. Holthus", location: "York, NE", amount: 131000 },
      { name: "Joseph Hausmann", location: "Roca, NE", amount: 117500 },
      { name: "Scott Cassels", location: "Omaha, NE", amount: 100500 },
      { name: "Matthew Sheehy", location: "Englewood, CO", amount: 100000 },
      { name: "Cara Whitney", location: "Walton, NE", amount: 100000 },
      { name: "Judd Norman", location: "Lincoln, NE", amount: 80000 },
    ],
  },
  "Lynne Walz": {
    committeeName: "Lynne Walz for Nebraska",
    totalRaised: 1476123,
    asOf: "2023\u20132026 NADC filings (cycle to date)",
    individualDonorCount: 504,
    individualAverage: 1795,
    corporate: [
      { name: "Mountain to Climb LLC", location: "Omaha, NE", amount: 45000 },
      { name: "Nebraska Groundswell", location: "Lincoln, NE", amount: 13551 },
      { name: "Nebraska & Southwest Iowa Building & Construction Trades Council", location: "Omaha, NE", amount: 10000 },
      { name: "Groundswell", location: "Lincoln, NE", amount: 1776 },
      { name: "Nebraska State AFL-CIO", location: "Lincoln, NE", amount: 1500 },
      { name: "Warhorse Gaming LLC", location: "Winnebago, NE", amount: 1000 },
      { name: "American Communications Group, Inc.", location: "Lincoln, NE", amount: 250 },
    ],
    individual: [
      { name: "Dianne Lozier", location: "Omaha, NE", amount: 265000 },
      { name: "Barbara Weitz", location: "Omaha, NE", amount: 150000 },
      { name: "Annette Smith", location: "Omaha, NE", amount: 100000 },
      { name: "Beth Eliason", location: "Yutan, NE", amount: 35000 },
      { name: "Katie Weitz", location: "Omaha, NE", amount: 25000 },
      { name: "John Kotouc", location: "Omaha, NE", amount: 5250 },
      { name: "Steven Lathrop", location: "Omaha, NE", amount: 5000 },
      { name: "Coleen Stice", location: "Omaha, NE", amount: 5000 },
      { name: "Allen Fredrickson", location: "Omaha, NE", amount: 5000 },
      { name: "Matthew Johnson", location: "Omaha, NE", amount: 5000 },
    ],
  },
};

const secretaryOfStateDonors = {
  "Scott Petersen": {
    committeeName: "Petersen for Nebraska",
    totalRaised: 140304,
    asOf: "2023\u20132026 NADC filings (cycle to date)",
    individualDonorCount: 46,
    individualAverage: 1469,
    corporate: [
      { name: "Penner Patient Care Inc", location: "Aurora, NE", amount: 1000 },
      { name: "Printco Graphics", location: "Omaha, NE", amount: 1000 },
      { name: "Pinnacle Bank", location: "Lincoln, NE", amount: 250 },
    ],
    individual: [
      { name: "Mike Moran", location: "Omaha, NE", amount: 20000 },
      { name: "Sam Sampson", location: "Lincoln, NE", amount: 16750 },
      { name: "Perry Petersen", location: "Omaha, NE", amount: 5000 },
      { name: "Mike Faust", location: "Omaha, NE", amount: 2000 },
      { name: "Berniece Grewcock", location: "Omaha, NE", amount: 2000 },
      { name: "Leo Eledge", location: "Omaha, NE", amount: 1000 },
      { name: "Richard Smith", location: "Omaha, NE", amount: 1000 },
      { name: "Matt Murphy", location: "Omaha, NE", amount: 1000 },
      { name: "Ann Francis", location: "Omaha, NE", amount: 1000 },
      { name: "Carole Julian", location: "Omaha, NE", amount: 1000 },
    ],
  },
  "Sarah Slattery": {
    committeeName: "Slattery for Nebraska",
    totalRaised: 38567,
    asOf: "2023\u20132026 NADC filings (cycle to date)",
    individualDonorCount: 127,
    individualAverage: 187,
    corporate: [
      { name: "Planned Parenthood Advocates of Nebraska", location: "Lincoln, NE", amount: 3352 },
      { name: "Warhorse Gaming", location: "Winnebago, NE", amount: 2500 },
    ],
    individual: [
      { name: "Elizabeth Constance", location: "Omaha, NE", amount: 5000 },
      { name: "Rick Vest", location: "Lincoln, NE", amount: 2500 },
      { name: "Katie Weitz", location: "Omaha, NE", amount: 2500 },
      { name: "Mary Fischer", location: "Lincoln, NE", amount: 1500 },
      { name: "Jane Kleeb", location: "Hastings, NE", amount: 1000 },
      { name: "Megan Hull", location: "Oakland, CA", amount: 1000 },
      { name: "Ann Trullinger", location: "Gothenburg, NE", amount: 632 },
      { name: "Teresa Lorensen", location: "Avoca, NE", amount: 500 },
      { name: "Kathleen Thuman", location: "Lincoln, NE", amount: 500 },
      { name: "Sharlette Schwenninger", location: "Elwood, NE", amount: 450 },
    ],
  },
};

const attorneyGeneralDonors = {
  "Mike Hilgers": {
    committeeName: "Friends of Mike Hilgers",
    totalRaised: 1966935,
    asOf: "2023\u20132026 NADC filings (cycle to date)",
    individualDonorCount: 124,
    individualAverage: 3560,
    corporate: [
      { name: "Reynolds American Inc. / RAI Services", location: "Winston-Salem, NC", amount: 95000 },
      { name: "The Hurst Group LLC", location: "Jackson, MS", amount: 60000 },
      { name: "KAAPA Ethanol Holdings, LLC", location: "Kearney, NE", amount: 47500 },
      { name: "Stonebrook Exterior", location: "Lincoln, NE", amount: 40000 },
      { name: "Altria Client Services, Inc.", location: "Richmond, VA", amount: 36000 },
      { name: "Anheuser-Busch Companies", location: "St. Louis, MO", amount: 32500 },
      { name: "SidePrize LLC and Affiliates (d/b/a PrizePicks)", location: "Atlanta, GA", amount: 30000 },
      { name: "FanDuel Inc", location: "New York, NY", amount: 27500 },
      { name: "Hawkins Construction Company", location: "Omaha, NE", amount: 25000 },
      { name: "Nomi Health, Inc", location: "Orem, UT", amount: 25000 },
    ],
    individual: [
      { name: "Miriam Adelson", location: "Las Vegas, NV", amount: 75000 },
      { name: "Jeremy Lieberman", location: "New York, NY", amount: 22138 },
      { name: "Stacie Stern", location: "Brooklyn, NY", amount: 20000 },
      { name: "Tonn Ostergard", location: "Lincoln, NE", amount: 20000 },
      { name: "Thomas (Tom) Peed", location: "Lincoln, NE", amount: 20000 },
      { name: "Shawn Peed", location: "Lincoln, NE", amount: 20000 },
      { name: "Michael Cassling", location: "Omaha, NE", amount: 15000 },
      { name: "Adam Piper", location: "Raleigh, NC", amount: 10000 },
      { name: "William Austin", location: "Brownsville, TX", amount: 10000 },
      { name: "Tani Dru Austin", location: "Brownsville, TX", amount: 10000 },
    ],
  },
  "Jocelyn Brasher": {
    committeeName: "Brasher for NE AG",
    totalRaised: 177182,
    asOf: "2023\u20132026 NADC filings (cycle to date)",
    individualDonorCount: 48,
    individualAverage: 2407,
    corporate: [
      { name: "Groundswell", location: "Lincoln, NE", amount: 13317 },
      { name: "Nebraska Groundswell", location: "Lincoln, NE", amount: 1000 },
    ],
    individual: [
      { name: "Barbara Weitz", location: "Omaha, NE", amount: 50000 },
      { name: "Dianne Lozier", location: "Omaha, NE", amount: 10000 },
      { name: "Dolores Brady", location: "Omaha, NE", amount: 5000 },
      { name: "Harley Schrager", location: "Omaha, NE", amount: 5000 },
      { name: "Beth Eliason", location: "Yutan, NE", amount: 5000 },
      { name: "Ronald Streck", location: "Vero Beach, FL", amount: 5000 },
      { name: "Elizabeth Constance", location: "Omaha, NE", amount: 5000 },
      { name: "Katie Weitz", location: "Omaha, NE", amount: 3628 },
      { name: "Daniel Wintz", location: "Papillion, NE", amount: 1500 },
      { name: "Edith Peebles", location: "Omaha, NE", amount: 1500 },
    ],
  },
};

const treasurerDonors = {
  "Joey Spellerberg": {
    committeeName: "Spellerberg for Nebraska",
    totalRaised: 379136,
    asOf: "2023\u20132026 NADC filings (cycle to date)",
    individualDonorCount: 81,
    individualAverage: 1722,
    corporate: [
      { name: "All Metals Market, Inc", location: "Fremont, NE", amount: 10000 },
      { name: "Wholestone Farm II, LLC", location: "Fremont, NE", amount: 10000 },
      { name: "Fremont Beef Company", location: "Fremont, NE", amount: 10000 },
      { name: "Hawkins Construction Company", location: "Omaha, NE", amount: 5000 },
      { name: "S2 Rolloffs, LLC", location: "Fremont, NE", amount: 5000 },
      { name: "Nebraska Bank", location: "Dodge, NE", amount: 2500 },
      { name: "Mueller Robak, LLC", location: "Lincoln, NE", amount: 2500 },
      { name: "Charter Communications", location: "St Louis, MO", amount: 2500 },
      { name: "Adams and Sullivan Attorneys", location: "Papillion, NE", amount: 2500 },
      { name: "Great Plains Communications, Inc.", location: "Blair, NE", amount: 1500 },
    ],
    individual: [
      { name: "Sid Dillon", location: "Fremont, NE", amount: 10000 },
      { name: "Thomas Weitzenkamp", location: "Hooper, NE", amount: 10000 },
      { name: "Jeff Wilmes", location: "Valley, NE", amount: 10000 },
      { name: "Robert Murray", location: "Fremont, NE", amount: 10000 },
      { name: "J Peter (Pete) Ricketts", location: "Omaha, NE", amount: 10000 },
      { name: "Steve Roy", location: "Alex City, AL", amount: 5000 },
      { name: "Marlin Brabec", location: "Ames, NE", amount: 5000 },
      { name: "Blake Dillon", location: "Fremont, NE", amount: 5000 },
      { name: "Samuel Heineman", location: "Fremont, NE", amount: 5000 },
      { name: "Lorelee Byrd", location: "Arlington, NE", amount: 5000 },
    ],
  },
};

const auditorDonors = {
  "Mike Foley": {
    committeeName: "Foley for the People- Auditor",
    totalRaised: 73257,
    asOf: "2023\u20132026 NADC filings (cycle to date)",
    individualDonorCount: 35,
    individualAverage: 1344,
    corporate: [],
    individual: [
      { name: "Deb Placek", location: "Lincoln, NE", amount: 6500 },
      { name: "Richard Clements", location: "Elmwood, NE", amount: 5000 },
      { name: "Donald Dillon", location: "Lincoln, NE", amount: 3000 },
      { name: "Joseph Kerrigan", location: "Lincoln, NE", amount: 2500 },
      { name: "Richard Noel", location: "Lincoln, NE", amount: 2500 },
      { name: "Peter Demarco", location: "Springfield, NE", amount: 2000 },
      { name: "Matt Tasler", location: "Lincoln, NE", amount: 2000 },
      { name: "Susan Meckel", location: "Lincoln, NE", amount: 2000 },
      { name: "Mary Volkmer", location: "Lincoln, NE", amount: 2000 },
      { name: "Mike Lawlor", location: "Omaha, NE", amount: 1500 },
    ],
  },
};

// Merged lookup, keyed by candidate name -- this is what elections2026.js
// actually reads from. Candidate names are unique across these races, so a
// flat merge is safe.
const candidateDonors = {
  ...governorDonors,
  ...secretaryOfStateDonors,
  ...attorneyGeneralDonors,
  ...treasurerDonors,
  ...auditorDonors,
};

module.exports = {
  governorDonors,
  secretaryOfStateDonors,
  attorneyGeneralDonors,
  treasurerDonors,
  auditorDonors,
  candidateDonors,
};
