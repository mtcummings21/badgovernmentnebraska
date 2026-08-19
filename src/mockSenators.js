// Sample senator data shaped like the normalized output of src/senators.js.
// Used automatically when live scraping of nebraskalegislature.gov fails or
// is skipped, so the Senators section is fully browsable without a network
// dependency. Last names here intentionally match the sponsors used in
// src/mockData.js so bill-to-senator linking works end-to-end in demo mode.
//
// District numbers and committee assignments are illustrative, not a live
// feed of the real roster — verify anything important against
// nebraskalegislature.gov/senators/senator_list.php.

function photoUrl(district) {
  const padded = String(district).padStart(2, "0");
  return `https://www.nebraskalegislature.gov/media/images/senators/dist${padded}/highres/dist${padded}.jpg`;
}

const mockSenators = [
  {
    id: "23",
    district: 23,
    lastName: "Bostelman",
    fullName: "Sen. Kevin Bostelman",
    committees: [
      { name: "Transportation and Telecommunications", role: "Member" },
      { name: "Agriculture", role: "Member" },
    ],
    electedYear: 2018,
    bio: "Represents District 23 in northeast Nebraska. Focuses on rural broadband access and agricultural infrastructure.",
    phone: "(402) 471-2716",
    email: "kbostelman@leg.ne.gov",
    photoUrl: photoUrl(23),
  },
  {
    id: "39",
    district: 39,
    lastName: "Linehan",
    fullName: "Sen. Rita Linehan",
    committees: [
      { name: "Revenue", role: "Chair" },
      { name: "Executive Board", role: "Member" },
    ],
    electedYear: 2016,
    bio: "Represents District 39. Chairs the Revenue Committee and has led several property tax reform efforts.",
    phone: "(402) 471-2733",
    email: "rlinehan@leg.ne.gov",
    photoUrl: photoUrl(39),
  },
  {
    id: "30",
    district: 30,
    lastName: "Dorn",
    fullName: "Sen. Byron Dorn",
    committees: [
      { name: "Revenue", role: "Member" },
      { name: "Natural Resources", role: "Member" },
    ],
    electedYear: 2018,
    bio: "Represents District 30 in southeast Nebraska. A retired educator focused on school funding and property tax issues.",
    phone: "(402) 471-2727",
    email: "bdorn@leg.ne.gov",
    photoUrl: photoUrl(30),
  },
  {
    id: "38",
    district: 38,
    lastName: "Murman",
    fullName: "Sen. Lena Murman",
    committees: [
      { name: "Education", role: "Chair" },
      { name: "Appropriations", role: "Member" },
    ],
    electedYear: 2018,
    bio: "Represents District 38. Chairs the Education Committee, with a focus on school district consolidation and rural funding formulas.",
    phone: "(402) 471-2732",
    email: "lmurman@leg.ne.gov",
    photoUrl: photoUrl(38),
  },
  {
    id: "11",
    district: 11,
    lastName: "Aschford",
    fullName: "Sen. Tomas Aschford",
    committees: [
      { name: "Natural Resources", role: "Member" },
      { name: "Agriculture", role: "Member" },
    ],
    electedYear: 2020,
    bio: "Represents District 11. Works primarily on groundwater management and irrigation district oversight.",
    phone: "(402) 471-2618",
    email: "taschford@leg.ne.gov",
    photoUrl: photoUrl(11),
  },
  {
    id: "13",
    district: 13,
    lastName: "Wayne",
    fullName: "Sen. Elaine Wayne",
    committees: [
      { name: "Natural Resources", role: "Member" },
      { name: "Urban Affairs", role: "Member" },
    ],
    electedYear: 2022,
    bio: "Represents District 13. Focused on water sustainability and natural resources district governance.",
    phone: "(402) 471-2612",
    email: "ewayne@leg.ne.gov",
    photoUrl: photoUrl(13),
  },
  {
    id: "9",
    district: 9,
    lastName: "Cavanaugh",
    fullName: "Sen. John Cavanaugh",
    committees: [
      { name: "General Affairs", role: "Member" },
      { name: "Government, Military and Veterans Affairs", role: "Member" },
      { name: "Urban Affairs", role: "Member" },
    ],
    electedYear: 2020,
    bio: "Represents District 9 in Omaha. An attorney by background, focused on labor policy and consumer protection.",
    phone: "(402) 471-2723",
    email: "jcavanaugh@leg.ne.gov",
    photoUrl: photoUrl(9),
  },
  {
    id: "33",
    district: 33,
    lastName: "Halloran",
    fullName: "Sen. Marcus Halloran",
    committees: [
      { name: "Revenue", role: "Member" },
      { name: "Government, Military and Veterans Affairs", role: "Member" },
    ],
    electedYear: 2020,
    bio: "Represents District 33. A veteran-focused legislator working on tax credits for volunteer emergency responders.",
    phone: "(402) 471-2725",
    email: "mhalloran@leg.ne.gov",
    photoUrl: photoUrl(33),
  },
  {
    id: "21",
    district: 21,
    lastName: "Ballard",
    fullName: "Sen. Renee Ballard",
    committees: [
      { name: "Revenue", role: "Member" },
      { name: "Education", role: "Member" },
    ],
    electedYear: 2022,
    bio: "Represents District 21. Works on revenue policy affecting rural school districts.",
    phone: "(402) 471-2734",
    email: "rballard@leg.ne.gov",
    photoUrl: photoUrl(21),
  },
  {
    id: "16",
    district: 16,
    lastName: "Hansen",
    fullName: "Sen. Curt Hansen",
    committees: [
      { name: "Business and Labor", role: "Chair" },
      { name: "Judiciary", role: "Member" },
    ],
    electedYear: 2018,
    bio: "Represents District 16. Chairs the Business and Labor Committee, focused on occupational licensing reform.",
    phone: "(402) 471-2715",
    email: "chansen@leg.ne.gov",
    photoUrl: photoUrl(16),
  },
  {
    id: "43",
    district: 43,
    lastName: "Brewer",
    fullName: "Sen. Tate Brewer",
    committees: [
      { name: "Judiciary", role: "Member" },
      { name: "Government, Military and Veterans Affairs", role: "Member" },
    ],
    electedYear: 2016,
    bio: "Represents District 43 in the Sandhills. A retired law enforcement officer focused on public safety policy.",
    phone: "(402) 471-2628",
    email: "tbrewer@leg.ne.gov",
    photoUrl: photoUrl(43),
  },
  {
    id: "49",
    district: 49,
    lastName: "Day",
    fullName: "Sen. Jennifer Day",
    committees: [
      { name: "Health and Human Services", role: "Member" },
      { name: "Education", role: "Member" },
    ],
    electedYear: 2022,
    bio: "Represents District 49. Focused on childcare workforce policy and early childhood education funding.",
    phone: "(402) 471-2620",
    email: "jday@leg.ne.gov",
    photoUrl: photoUrl(49),
  },
  {
    id: "8",
    district: 8,
    lastName: "Hunt",
    fullName: "Sen. Adriana Hunt",
    committees: [
      { name: "Health and Human Services", role: "Member" },
      { name: "Urban Affairs", role: "Member" },
    ],
    electedYear: 2018,
    bio: "Represents District 8 in Omaha. Works on childcare access, healthcare, and small business policy.",
    phone: "(402) 471-2721",
    email: "ahunt@leg.ne.gov",
    photoUrl: photoUrl(8),
  },
  {
    id: "3",
    district: 3,
    lastName: "Blood",
    fullName: "Sen. Gareth Blood",
    committees: [
      { name: "Natural Resources", role: "Chair" },
      { name: "Appropriations", role: "Member" },
    ],
    electedYear: 2018,
    bio: "Represents District 3. Chairs the Natural Resources Committee, focused on environmental trust fund policy.",
    phone: "(402) 471-2623",
    email: "gblood@leg.ne.gov",
    photoUrl: photoUrl(3),
  },
];

module.exports = { mockSenators };
