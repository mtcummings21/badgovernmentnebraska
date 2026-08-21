// Top individual and corporate donors for the 2026 Nebraska governor's race.
//
// Hand-maintained, not scraped -- sourced directly from the Nebraska
// Accountability and Disclosure Commission's (NADC) bulk contribution/loan
// data exports (nadc-e.nebraska.gov/PublicSite/DataDownload.aspx), covering
// the 2023-2026 filing years as extracted 8/14/2026. Figures are cycle-to-date
// totals for each candidate's registered committee, aggregated by donor name
// across all four years and ranked by total dollars given. Excludes the
// state's own "$250-or-less, not itemized" small-dollar aggregate line and
// PAC/party-committee money (tracked separately, not shown here). Lists are
// top 10 by dollar amount, or fewer where a candidate simply doesn't have
// 10 distinct corporate donors on file (Walz's corporate list has 7).
//
// individualDonorCount / individualAverage are computed across ALL itemized
// individual contributions (not just the top 10 shown), excluding NADC's
// lump-sum "$250-or-less" bucket -- there's no way to recover a donor count
// from that bucket since NADC reports it as a single unitemized total.
//
// Committees matched: "Jim Pillen for Governor" and "Lynne Walz for Nebraska."
// Rick Beard (Legal Marijuana Now) has no registered candidate committee in
// NADC's system as of this extract, meaning he has not crossed the $5,000
// reporting threshold -- so no donor data exists to show for him.
//
// Brett Lindstrom (independent) filed a committee ("Friends of Lindstrom")
// and raised some money this cycle, but did not gather enough valid
// petition signatures to qualify for the general election ballot -- he is
// intentionally excluded here.
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

module.exports = { governorDonors };
