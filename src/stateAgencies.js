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
// URLs were checked 8/21/2026 against each agency's own site (or, where an
// agency has no dedicated site, the closest official parent-agency page --
// noted inline). Two entries (Foster Care Advisory Committee, and the
// Judicial Nominating Commissions as a whole) don't have a single
// authoritative URL to link, so `url` is omitted for those.
//
// REVISIT: agency names/directors change with reorganizations (e.g., the
// former Department of Environment and Energy is now the Department of
// Water, Environment & Energy). Re-verify against governor.nebraska.gov/cabinet
// periodically, and spot-check URLs -- several Nebraska agency sites still
// sit on older domains (state.ne.us, ne.gov) rather than the newer
// *.nebraska.gov pattern.

const stateAgencies = {
  constitutional: {
    description:
      "Boards and commissions created directly by the Nebraska Constitution, rather than by ordinary legislation.",
    agencies: [
      { name: "Board of Parole", note: "Const. Art. IV, Sec. 13", url: "https://parole.nebraska.gov/" },
      { name: "Board of Pardons", note: "Const. Art. IV, Sec. 13", url: "https://pardons.nebraska.gov/" },
      { name: "State Board of Education", note: "Const. Art. VII, Sec. 3", url: "https://www.education.ne.gov/stateboard/" },
      { name: "Public Service Commission", note: "Const. Art. IV, Sec. 20", url: "https://psc.nebraska.gov/" },
      { name: "Commission on Industrial Relations", note: "Const. Art. XV, Sec. 9", url: "https://ncir.nebraska.gov/" },
      { name: "Board of Educational Lands and Funds", note: "Const. Art. VII, Sec. 6", url: "https://belf.nebraska.gov/" },
      { name: "Coordinating Commission for Postsecondary Education", note: "Const. Art. VII, Sec. 14", url: "https://ccpe.nebraska.gov/" },
      { name: "Board of Trustees of the Nebraska State Colleges", note: "Const. Art. VII, Sec. 13", url: "https://www.nscs.edu/board-of-trustees" },
      { name: "Tax Equalization and Review Commission", note: "Const. Art. IX, Sec. 28", url: "https://terc.nebraska.gov/" },
      { name: "University of Nebraska Board of Regents", note: "Const. Art. VI, Sec. 10", url: "https://nebraska.edu/regents/" },
      { name: "Commission on Judicial Qualifications", note: "Const. Art. V, Sec. 28", url: "https://nebraskajudicial.gov/administration/committees-commissions/judges-staff-mediation-committees/judicial-qualifications-commission" },
      { name: "Judicial Nominating Commissions", note: "Const. Art. V, Sec. 21 (33 separate commissions, one per judicial district/court)", url: "https://nebraskajudicial.gov/administration/committees-commissions" },
    ],
  },

  code: {
    description:
      "Agencies whose director is appointed by, serves at the pleasure of, and answers directly to the Governor.",
    agencies: [
      { name: "Department of Administrative Services", url: "https://das.nebraska.gov/" },
      { name: "Department of Agriculture", url: "https://nda.nebraska.gov/" },
      { name: "Department of Banking and Finance", url: "https://ndbf.nebraska.gov/" },
      { name: "Office of the Chief Information Officer", url: "https://cio.nebraska.gov/" },
      { name: "Department of Correctional Services", url: "https://corrections.nebraska.gov/" },
      { name: "Nebraska Commission on Law Enforcement and Criminal Justice (Crime Commission)", url: "https://ncc.nebraska.gov/" },
      { name: "Department of Economic Development", url: "https://opportunity.nebraska.gov/" },
      { name: "Department of Health and Human Services", url: "https://dhhs.ne.gov/" },
      { name: "Department of Insurance", url: "https://doi.nebraska.gov/" },
      { name: "Department of Labor", url: "https://dol.nebraska.gov/" },
      { name: "Department of Motor Vehicles", url: "https://dmv.nebraska.gov/" },
      { name: "Environmental Quality Council", url: "https://dwee.nebraska.gov/resources-services/laws-regulations/environmental-quality-council" },
      { name: "Nebraska Natural Resources Commission", url: "https://nrc.nebraska.gov/" },
      { name: "Department of Revenue", url: "https://revenue.nebraska.gov/" },
      { name: "Department of Transportation", url: "https://dot.nebraska.gov/" },
      { name: "Department of Veterans' Affairs", url: "https://veterans.nebraska.gov/" },
      { name: "Department of Water, Environment & Energy", url: "https://dwee.nebraska.gov/" },
      { name: "Nebraska National Guard (Military Department)", url: "https://ne.ng.mil/" },
      { name: "State Broadband Office", url: "https://broadband.nebraska.gov/" },
      { name: "State Fire Marshal", url: "https://sfm.nebraska.gov/" },
      { name: "State Patrol", url: "https://statepatrol.nebraska.gov/" },
    ],
  },

  noncode: {
    description:
      "Independent agencies whose director or chief official is appointed by the agency's own governing board (usually gubernatorial appointees themselves), not directly by the Governor.",
    agencies: [
      { name: "Abstracters Board of Examiners", url: "https://abstracters.nebraska.gov/" },
      { name: "Accountability and Disclosure Commission, Nebraska", url: "https://nadc.nebraska.gov/" },
      { name: "African American Affairs, Commission on", url: "https://ncaaa.nebraska.gov/" },
      { name: "Arts Council, Nebraska", url: "https://www.nebraskaartscouncil.org/" },
      { name: "Asian American Affairs, Commission on", url: "https://caaan.nebraska.gov/" },
      { name: "Barber Examiners, Board of", url: "https://barbers.nebraska.gov/" },
      { name: "Blind and Visually Impaired, Commission for the", url: "https://www.ncbvi.ne.gov/" },
      { name: "Brand Committee, Nebraska", url: "https://nbc.nebraska.gov/" },
      { name: "Corn Development, Utilization, and Marketing Board", note: "Nebraska Corn Board", url: "https://www.nebraskacorn.org/" },
      { name: "Dairy Industry Development Board, Nebraska", url: "https://www.nebraskadairyindustry.org/" },
      { name: "Deaf and Hard of Hearing, Commission for the", url: "https://www.ncdhh.ne.gov/" },
      { name: "Dry Bean Commission", url: "https://nebraskadrybean.com/" },
      { name: "Dry Pea and Lentil Commission", url: "https://nebraskadrypeas.gov/" },
      { name: "Educational Telecommunications Commission, Nebraska", note: "Nebraska Public Media (NET)", url: "https://netnebraska.org/" },
      { name: "Electrical Board, State", url: "https://electrical.nebraska.gov/" },
      { name: "Engineers and Architects, Board of", url: "https://ea.nebraska.gov/" },
      { name: "Equal Opportunity Commission", url: "https://neoc.nebraska.gov/" },
      { name: "Ethanol Board, Nebraska", url: "https://www.ne-ethanol.org/" },
      { name: "Foster Care Advisory Committee", note: "advises the Dept. of Health and Human Services" },
      { name: "Game and Parks Commission", url: "https://outdoornebraska.gov/" },
      { name: "Geologists, Board of", url: "https://www.geology.state.ne.us/" },
      { name: "Grain Sorghum Development, Utilization, and Marketing Board", note: "Nebraska Grain Sorghum Board", url: "https://sorghum.nebraska.gov/" },
      { name: "Hemp Commission", note: "administered via the Dept. of Agriculture's hemp program", url: "https://nda.nebraska.gov/hemp" },
      { name: "Historical Society Board of Trustees, Nebraska State", url: "https://history.nebraska.gov/" },
      { name: "Indian Affairs, Commission on", url: "https://indianaffairs.nebraska.gov/" },
      { name: "Investment Council, Nebraska", url: "https://nic.nebraska.gov/" },
      { name: "Land Surveyors, Board of Examiners for", url: "https://nbels.nebraska.gov/" },
      { name: "Landscape Architects, State Board of", url: "https://www.landarch.state.ne.us/" },
      { name: "Latino-Americans, Commission on", note: "Latino American Commission", url: "https://latinoac.nebraska.gov/" },
      { name: "Library Commission, Nebraska", url: "https://nlc.nebraska.gov/" },
      { name: "Liquor Control Commission, Nebraska", url: "https://lcc.nebraska.gov/" },
      { name: "Motor Vehicle Industry Licensing Board", url: "https://mvdealerbd.ne.gov/" },
      { name: "Oil and Gas Conservation Commission, Nebraska", url: "https://www.nogcc.ne.gov/" },
      { name: "Power Review Board, Nebraska", url: "https://powerreview.nebraska.gov/" },
      { name: "Public Accountancy, Nebraska State Board of", url: "https://www.nbpa.ne.gov/" },
      { name: "Public Advocacy, Commission on", url: "https://www.ncpa.ne.gov/" },
      { name: "Public Employees Retirement Board", note: "administered by NPERS", url: "https://npers.ne.gov/" },
      { name: "Racing and Gaming Commission, State", url: "https://nrgc.nebraska.gov/" },
      { name: "Real Estate Commission, State", url: "https://www.nrec.ne.gov/" },
      { name: "Real Property Appraiser Board", url: "https://www.appraiser.ne.gov/" },
      { name: "State Fair Board, Nebraska", url: "https://www.statefair.org/" },
      { name: "Tourism Commission, Nebraska", note: "Nebraska Tourism", url: "https://visitnebraska.com/" },
      { name: "Wheat Development, Utilization, and Marketing Board, Nebraska", note: "Nebraska Wheat Board", url: "https://www.nebraskawheat.com/" },
    ],
  },
};

module.exports = { stateAgencies };
