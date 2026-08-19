// Nebraska's constitutional executive officers — the six statewide elected
// positions established directly by the Nebraska Constitution (Article IV,
// Section 1): Governor, Lieutenant Governor, Attorney General, Secretary of
// State, State Treasurer, and Auditor of Public Accounts.
//
// Unlike bills or senators, there's no API or single scrapable roster for
// this — it's six offices total, so it's hand-maintained here rather than
// scraped. Verified against nebraska.gov, ballotpedia.org, and Wikipedia as
// of August 2026.
//
// IMPORTANT: all six offices are on the ballot November 3, 2026. Whoever
// wins takes office in January 2027 — update currentHolder, party, and
// since for any seat that changes hands.

const constitutionalOffices = [
  {
    id: "governor",
    title: "Governor",
    currentHolder: "Jim Pillen",
    party: "Republican",
    since: 2023,
    termLength: "4-year term (max two consecutive terms)",
    nextElection: 2026,
    duties:
      "Nebraska's chief executive: appoints agency heads, prepares the state budget, and can veto legislation (subject to override by the Unicameral).",
    officialUrl: "https://governor.nebraska.gov",
  },
  {
    id: "lieutenant-governor",
    title: "Lieutenant Governor",
    currentHolder: "Joe Kelly",
    party: "Republican",
    since: 2023,
    termLength: "4-year term (elected jointly with the Governor, no term limit)",
    nextElection: 2026,
    duties:
      "Serves as president of the Legislature and assumes the Governor's powers and duties when the Governor is absent or incapacitated.",
    officialUrl: "https://ltgov.nebraska.gov",
  },
  {
    id: "attorney-general",
    title: "Attorney General",
    currentHolder: "Mike Hilgers",
    party: "Republican",
    since: 2023,
    termLength: "4-year term",
    nextElection: 2026,
    duties:
      "The state's chief legal officer: represents Nebraska in litigation, prosecutes certain state-level cases, and issues legal opinions to state agencies.",
    officialUrl: "https://ago.nebraska.gov",
  },
  {
    id: "secretary-of-state",
    title: "Secretary of State",
    currentHolder: "Bob Evnen",
    party: "Republican",
    since: 2019,
    termLength: "4-year term",
    nextElection: 2026,
    duties:
      "Oversees elections and business registrations, keeps the Great Seal of Nebraska, and maintains official state records.",
    officialUrl: "https://sos.nebraska.gov",
  },
  {
    id: "state-treasurer",
    title: "State Treasurer",
    currentHolder: "Joey Spellerberg",
    party: "Republican",
    since: 2025,
    termLength: "4-year term",
    nextElection: 2026,
    duties:
      "Safeguards and invests state funds; oversees the NEST 529 college savings program, unclaimed property, and child support disbursement.",
    officialUrl: "https://treasurer.nebraska.gov",
    notes:
      "Appointed by Governor Pillen in November 2025 to fill a vacancy left by Tom Briese; running to keep the seat in the November 2026 election.",
  },
  {
    id: "auditor",
    title: "Auditor of Public Accounts",
    currentHolder: "Mike Foley",
    party: "Republican",
    since: 2023,
    termLength: "4-year term",
    nextElection: 2026,
    duties:
      "Independently audits state agencies, counties, and school districts for compliance and financial accountability.",
    officialUrl: "https://auditors.nebraska.gov",
  },
];

module.exports = { constitutionalOffices };
