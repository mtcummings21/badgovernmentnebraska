// Nebraska state agencies, categorized as constitutional / code / noncode.
//
// Hand-maintained, not scraped. Nebraska's own Legislative Research Office
// says categorizing agencies this way is "more art than science" since
// neither "code" nor "noncode" is statutorily defined -- this module follows
// the Legislature's own usage.
//
// SOURCES:
// - "Boards and Commissions in Nebraska" (2025), Nebraska Legislature
//   Legislative Research Office, Research Report 2025-4
//   (nebraskalegislature.gov/pdf/reports/research/boards2025.pdf) -- source
//   for the 12 constitutionally-created boards (verbatim list) and the
//   Table 6A / Table 6B code vs. noncode classification of board-governed
//   agencies.
// - governor.nebraska.gov/cabinet (checked 8/21/2026) -- source for the
//   current single-director cabinet departments, which aren't "boards" so
//   don't appear in the Legislature's report at all, but are code agencies
//   in the ordinary sense: each is led by a director who serves at the
//   pleasure of, and answers directly to, the Governor.
//
// NOTE ON OVERLAP: a handful of boards (State Board of Education, Public
// Service Commission, Board of Educational Lands and Funds, Coordinating
// Commission for Postsecondary Education, Board of Trustees of the Nebraska
// State Colleges, Tax Equalization and Review Commission, University of
// Nebraska Board of Regents, and Commission on Industrial Relations) are
// BOTH constitutionally created AND separately classified as "noncode" in
// Table 6B. To avoid listing them twice, this module keeps them only in
// the "constitutional" category, since that's the more distinctive fact
// about them.
//
// NOTE ON THE GOVERNOR'S CABINET LIST: the Governor's own cabinet page
// includes some agency heads (e.g., the State Historical Society) whose
// governing board is classified as "noncode" by the Legislature's report.
// Attending cabinet meetings isn't the same as being under direct
// gubernatorial control, so this module follows the Legislature's Table
// 6A/6B classification rather than the cabinet roster where the two
// disagree.
//
// This is not a complete list of all 230+ Nebraska boards/commissions --
// the noncode list here is the Legislature's full Table 6B (minus the
// constitutional overlaps above), but very narrow single-purpose advisory
// committees and task forces are omitted for readability.
//
// REVISIT: agency names/directors change with reorganizations (e.g., the
// former Department of Environment and Energy is now the Department of
// Water, Environment & Energy). Re-verify against governor.nebraska.gov/cabinet
// periodically.

const stateAgencies = {
  constitutional: {
    description:
      "Boards and commissions created directly by the Nebraska Constitution, rather than by ordinary legislation.",
    agencies: [
      { name: "Board of Parole", note: "Const. Art. IV, Sec. 13" },
      { name: "Board of Pardons", note: "Const. Art. IV, Sec. 13" },
      { name: "State Board of Education", note: "Const. Art. VII, Sec. 3" },
      { name: "Public Service Commission", note: "Const. Art. IV, Sec. 20" },
      { name: "Commission on Industrial Relations", note: "Const. Art. XV, Sec. 9" },
      { name: "Board of Educational Lands and Funds", note: "Const. Art. VII, Sec. 6" },
      { name: "Coordinating Commission for Postsecondary Education", note: "Const. Art. VII, Sec. 14" },
      { name: "Board of Trustees of the Nebraska State Colleges", note: "Const. Art. VII, Sec. 13" },
      { name: "Tax Equalization and Review Commission", note: "Const. Art. IX, Sec. 28" },
      { name: "University of Nebraska Board of Regents", note: "Const. Art. VI, Sec. 10" },
      { name: "Commission on Judicial Qualifications", note: "Const. Art. V, Sec. 28" },
      { name: "Judicial Nominating Commissions", note: "Const. Art. V, Sec. 21 (33 separate commissions, one per judicial district/court)" },
    ],
  },

  code: {
    description:
      "Agencies whose director is appointed by, serves at the pleasure of, and answers directly to the Governor.",
    agencies: [
      { name: "Department of Administrative Services" },
      { name: "Department of Agriculture" },
      { name: "Department of Banking and Finance" },
      { name: "Office of the Chief Information Officer" },
      { name: "Department of Correctional Services" },
      { name: "Nebraska Commission on Law Enforcement and Criminal Justice (Crime Commission)" },
      { name: "Department of Economic Development" },
      { name: "Department of Health and Human Services" },
      { name: "Department of Insurance" },
      { name: "Department of Labor" },
      { name: "Department of Motor Vehicles" },
      { name: "Environmental Quality Council" },
      { name: "Nebraska Natural Resources Commission" },
      { name: "Department of Revenue" },
      { name: "Department of Transportation" },
      { name: "Department of Veterans' Affairs" },
      { name: "Department of Water, Environment & Energy" },
      { name: "Nebraska National Guard (Military Department)" },
      { name: "State Broadband Office" },
      { name: "State Fire Marshal" },
      { name: "State Patrol" },
    ],
  },

  noncode: {
    description:
      "Independent agencies whose director or chief official is appointed by the agency's own governing board (usually gubernatorial appointees themselves), not directly by the Governor.",
    agencies: [
      { name: "Abstracters Board of Examiners" },
      { name: "Accountability and Disclosure Commission, Nebraska" },
      { name: "African American Affairs, Commission on" },
      { name: "Arts Council, Nebraska" },
      { name: "Asian American Affairs, Commission on" },
      { name: "Barber Examiners, Board of" },
      { name: "Blind and Visually Impaired, Commission for the" },
      { name: "Brand Committee, Nebraska" },
      { name: "Corn Development, Utilization, and Marketing Board" },
      { name: "Dairy Industry Development Board, Nebraska" },
      { name: "Deaf and Hard of Hearing, Commission for the" },
      { name: "Dry Bean Commission" },
      { name: "Dry Pea and Lentil Commission" },
      { name: "Educational Telecommunications Commission, Nebraska" },
      { name: "Electrical Board, State" },
      { name: "Engineers and Architects, Board of" },
      { name: "Equal Opportunity Commission" },
      { name: "Ethanol Board, Nebraska" },
      { name: "Foster Care Advisory Committee" },
      { name: "Game and Parks Commission" },
      { name: "Geologists, Board of" },
      { name: "Grain Sorghum Development, Utilization, and Marketing Board" },
      { name: "Hemp Commission" },
      { name: "Historical Society Board of Trustees, Nebraska State" },
      { name: "Indian Affairs, Commission on" },
      { name: "Investment Council, Nebraska" },
      { name: "Land Surveyors, Board of Examiners for" },
      { name: "Landscape Architects, State Board of" },
      { name: "Latino-Americans, Commission on" },
      { name: "Library Commission, Nebraska" },
      { name: "Liquor Control Commission, Nebraska" },
      { name: "Motor Vehicle Industry Licensing Board" },
      { name: "Oil and Gas Conservation Commission, Nebraska" },
      { name: "Power Review Board, Nebraska" },
      { name: "Public Accountancy, Nebraska State Board of" },
      { name: "Public Advocacy, Commission on" },
      { name: "Public Employees Retirement Board" },
      { name: "Racing and Gaming Commission, State" },
      { name: "Real Estate Commission, State" },
      { name: "Real Property Appraiser Board" },
      { name: "State Fair Board, Nebraska" },
      { name: "Tourism Commission, Nebraska" },
      { name: "Wheat Development, Utilization, and Marketing Board, Nebraska" },
    ],
  },
};

module.exports = { stateAgencies };
