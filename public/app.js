// The seven stages of a Nebraska bill's life, in order. "vetoed" and "failed"
// are terminal-negative states handled separately by ladderInfo() below,
// since a dead bill doesn't map onto a single point in this sequence.
const POSITIVE_STAGES = [
  "introduced",
  "committee",
  "general_file",
  "select_file",
  "final_reading",
  "governor",
  "signed",
];

const STAGE_LABELS = {
  introduced: "Introduced",
  committee: "In Committee",
  general_file: "General File",
  select_file: "Select File",
  final_reading: "Final Reading",
  governor: "With Governor",
  signed: "Signed",
  vetoed: "Vetoed",
  failed: "Failed",
};

let allBills = [];
let allSenators = [];
let allOffices = [];
let allNews = [];
let electionsLoaded = false;
let agenciesData = null;
let agencyCount = 0;
let committeesLoaded = false;
let termInfo = null;

function ladderInfo(status) {
  if (status === "vetoed") return { reachedIndex: 5, negative: true };
  if (status === "failed") return { reachedIndex: 1, negative: true };
  const idx = POSITIVE_STAGES.indexOf(status);
  return { reachedIndex: idx === -1 ? 0 : idx, negative: false };
}

function renderLadder(status, statusLabel) {
  const { reachedIndex, negative } = ladderInfo(status);
  const notches = POSITIVE_STAGES.map((stage, i) => {
    let cls = "ladder-notch";
    if (i < reachedIndex) cls += " filled";
    else if (i === reachedIndex) cls += negative ? " filled" : " filled current";
    return `<span class="${cls}"></span>`;
  }).join("");

  return `
    <div class="ladder ${negative ? "terminal-negative" : ""}">
      <div class="ladder-track">${notches}</div>
      <span class="ladder-label">${statusLabel || STAGE_LABELS[status] || status}</span>
    </div>
  `;
}

function formatDate(dateStr) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// View routing (#/bills, #/senators, #/senators/:id)
// ---------------------------------------------------------------------------

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, ""); // "senators/9" | "senators" | "bills" | "" | "news"
  const [view, id] = hash.split("/");
  return { view: view || "home", id: id || null };
}

function setActiveTab(view) {
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === view);
  });
}

function showView(view) {
  const sections = {
    home: ["view-home-workspace"],
    bills: ["view-bills", "view-bills-workspace"],
    senators: ["view-senators", "view-senators-workspace"],
    offices: ["view-offices", "view-offices-workspace"],
    news: ["view-news", "view-news-workspace"],
    elections: ["view-elections", "view-elections-workspace"],
    donors: ["view-donors", "view-donors-workspace"],
    agencies: ["view-agencies", "view-agencies-workspace"],
  };
  Object.entries(sections).forEach(([name, ids]) => {
    ids.forEach((id) => {
      document.getElementById(id).hidden = name !== view;
    });
  });
  setActiveTab(view);
}

function route() {
  const { view, id } = currentRoute();
  showView(view);

  if (view === "senators") {
    if (allSenators.length === 0) {
      loadSenators().then(() => {
        applySenatorFiltersAndRender();
        if (id) openSenatorDetail(id);
      });
    } else {
      applySenatorFiltersAndRender();
      if (id) openSenatorDetail(id);
      else closeSenatorDetail();
    }
    if (!committeesLoaded) loadCommittees();
  } else {
    closeSenatorDetail();
  }

  if (view === "offices" && allOffices.length === 0) {
    loadOffices();
  }

  if (view === "news") {
    if (allNews.length === 0) loadNews();
    else applyNewsFiltersAndRender();
  }

  if (view === "home") {
    renderHome();
  }

  if (view === "elections" && !electionsLoaded) {
    loadElections();
  }

  if (view === "donors") {
    loadDonors(id);
  }

  if (view === "agencies") {
    loadAgencies();
  }
}

window.addEventListener("hashchange", route);

// ---------------------------------------------------------------------------
// Bills
// ---------------------------------------------------------------------------

async function loadBills() {
  const listEl = document.getElementById("bill-list");
  listEl.innerHTML = `<p class="empty-state">Loading bills&hellip;</p>`;

  try {
    const res = await fetch("/api/bills");
    const data = await res.json();
    allBills = data.bills || [];
    updateStats(allBills);
    applyFiltersAndRender();
  } catch (err) {
    console.error("Falling back to nothing, backend unreachable:", err);
    listEl.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

function updateStats(bills) {
  const total = bills.length;
  const committee = bills.filter((b) => b.status === "committee").length;
  const floor = bills.filter((b) =>
    ["general_file", "select_file", "final_reading"].includes(b.status)
  ).length;
  const signed = bills.filter((b) => b.status === "signed").length;

  document.querySelector('[data-stat="total"]').textContent = total;
  document.querySelector('[data-stat="committee"]').textContent = committee;
  document.querySelector('[data-stat="floor"]').textContent = floor;
  document.querySelector('[data-stat="signed"]').textContent = signed;
}

function applyFiltersAndRender() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const statusFilter = document.getElementById("status-filter").value;
  const sortOrder = document.getElementById("sort-order").value;

  let filtered = allBills.filter((b) => {
    const matchesQuery =
      !query ||
      b.number.toLowerCase().includes(query) ||
      b.title.toLowerCase().includes(query) ||
      (b.description || "").toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  filtered = filtered.sort((a, b) => {
    if (sortOrder === "number") {
      return a.number.localeCompare(b.number, undefined, { numeric: true });
    }
    return new Date(b.lastActionDate || 0) - new Date(a.lastActionDate || 0);
  });

  renderList(filtered);
}

function renderList(bills) {
  const listEl = document.getElementById("bill-list");
  const emptyEl = document.getElementById("empty-state");

  if (bills.length === 0) {
    listEl.innerHTML = "";
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  listEl.innerHTML = bills
    .map(
      (b) => `
      <article class="bill-card" tabindex="0" data-id="${b.id}">
        <div class="bill-card-top">
          <span class="bill-number">${b.number}</span>
          <span class="bill-date">${formatDate(b.lastActionDate)}</span>
        </div>
        <h3 class="bill-title">${b.title}</h3>
        <p class="bill-last-action">${b.lastAction || ""}</p>
        ${renderLadder(b.status, b.statusLabel)}
      </article>
    `
    )
    .join("");

  listEl.querySelectorAll(".bill-card").forEach((card) => {
    card.addEventListener("click", () => openDetail(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetail(card.dataset.id);
      }
    });
  });
}

async function openDetail(id) {
  const overlay = document.getElementById("detail-overlay");
  const body = document.getElementById("detail-body");
  overlay.hidden = false;
  body.innerHTML = `<p>Loading&hellip;</p>`;

  try {
    const res = await fetch(`/api/bills/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unknown error");
    renderDetail(data.bill);
  } catch (err) {
    body.innerHTML = `<p>Could not load this bill's details.</p>`;
  }
}

function renderSponsorList(sponsors) {
  if (!sponsors || sponsors.length === 0) return "";
  return `
    <div class="detail-section">
      <h4>Sponsors</h4>
      <ul>${sponsors
        .map((s) =>
          s.senatorId
            ? `<li><a class="sponsor-link" href="#/senators/${s.senatorId}">${s.name}</a></li>`
            : `<li>${s.name}</li>`
        )
        .join("")}</ul>
    </div>
  `;
}

function renderDetail(b) {
  const body = document.getElementById("detail-body");
  body.innerHTML = `
    <span class="detail-number">${b.number}</span>
    <h3>${b.title}</h3>
    ${renderLadder(b.status, b.statusLabel)}

    <div class="detail-section">
      <h4>Summary</h4>
      <p>${b.description || "No summary available."}</p>
    </div>

    ${renderSponsorList(b.sponsors)}

    ${
      b.committee
        ? `<div class="detail-section"><h4>Committee</h4><p>${b.committee}</p></div>`
        : ""
    }

    <div class="detail-section">
      <h4>Last action</h4>
      <p>${b.lastAction || "\u2014"} <span style="color: var(--muted)">(${formatDate(b.lastActionDate)})</span></p>
    </div>

    ${
      b.url
        ? `<a class="detail-link" href="${b.url}" target="_blank" rel="noopener">View official record &rarr;</a>`
        : ""
    }
  `;
}

function closeDetail() {
  document.getElementById("detail-overlay").hidden = true;
}

document.getElementById("detail-close").addEventListener("click", closeDetail);
document.getElementById("detail-overlay").addEventListener("click", (e) => {
  if (e.target.id === "detail-overlay") closeDetail();
});

document.getElementById("search").addEventListener("input", applyFiltersAndRender);
document.getElementById("status-filter").addEventListener("change", applyFiltersAndRender);
document.getElementById("sort-order").addEventListener("change", applyFiltersAndRender);

// ---------------------------------------------------------------------------
// Senators
// ---------------------------------------------------------------------------

async function loadSenators() {
  const gridEl = document.getElementById("senator-grid");
  gridEl.innerHTML = `<p class="empty-state">Loading senators&hellip;</p>`;

  try {
    const res = await fetch("/api/senators");
    const data = await res.json();
    allSenators = data.senators || [];
    termInfo = data.termInfo || null;
    if (termInfo) {
      document.getElementById("senator-term-blurb").textContent =
        `District, committee assignments, and sponsored bills for all ${termInfo.districts} senators. Each serves a ${termInfo.termLength}.`;
    }
    renderSeatMap(allSenators);
  } catch (err) {
    console.error("Falling back to nothing, backend unreachable:", err);
    gridEl.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

// ---------------------------------------------------------------------------
// Seat map (hemicycle chart)
// ---------------------------------------------------------------------------

const PARTY_COLORS = { R: "#a13d2d", D: "#2f4858", I: "#b98a2d" };
const PARTY_NAMES = { R: "Republican", D: "Democratic", I: "Independent" };

/**
 * Lays out `total` seats in concentric rows forming a hemicycle (dome shape,
 * flat edge at the top, seats curving downward) -- the standard parliament-
 * chart layout. Rows further from center hold more seats, proportional to
 * their radius, so seat spacing stays roughly even across the whole arc.
 */
function computeHemicycleLayout(total, rows, innerRadius, rowGap) {
  const radii = Array.from({ length: rows }, (_, i) => innerRadius + i * rowGap);
  const totalRadius = radii.reduce((a, b) => a + b, 0);

  let perRow = radii.map((r) => Math.round((r / totalRadius) * total));
  let diff = total - perRow.reduce((a, b) => a + b, 0);
  let idx = perRow.length - 1;
  while (diff !== 0) {
    if (diff > 0) {
      perRow[idx]++;
      diff--;
    } else if (perRow[idx] > 0) {
      perRow[idx]--;
      diff++;
    }
    idx = (idx - 1 + perRow.length) % perRow.length;
  }

  const seats = [];
  perRow.forEach((count, rowIndex) => {
    const r = radii[rowIndex];
    for (let s = 0; s < count; s++) {
      const theta = count === 1 ? Math.PI / 2 : Math.PI - (s / (count - 1)) * Math.PI;
      seats.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), theta });
    }
  });

  // Sort left-to-right (theta near PI = far left) so color blocks assigned
  // sequentially form clean left/right party wedges rather than a jumble.
  seats.sort((a, b) => b.theta - a.theta);
  return { seats, outerRadius: radii[radii.length - 1] };
}

function renderSeatMap(senators) {
  const container = document.getElementById("seat-map-container");
  if (!container || senators.length === 0) return;

  const counts = { R: 0, D: 0, I: 0 };
  senators.forEach((s) => {
    if (s.party && counts[s.party] !== undefined) counts[s.party]++;
  });

  const total = senators.length;
  const { seats, outerRadius } = computeHemicycleLayout(total, 5, 46, 18);

  // Assign colors in left-to-right order: Democratic, then Independent
  // (small, so it lands near the middle), then Republican.
  const order = [
    ...Array(counts.D).fill("D"),
    ...Array(counts.I).fill("I"),
    ...Array(counts.R).fill("R"),
  ];

  const dotRadius = 5;
  const pad = dotRadius + 4;
  const viewW = outerRadius * 2 + pad * 2;
  const cyOffset = pad;
  const viewH = outerRadius + pad + cyOffset;
  const cx = viewW / 2;

  const dots = seats
    .map((seat, i) => {
      const party = order[i] || "R";
      const x = cx + seat.x;
      const y = cyOffset + seat.y;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotRadius}" fill="${PARTY_COLORS[party]}" />`;
    })
    .join("");

  const svg = `
    <svg class="seat-map-svg" viewBox="0 0 ${viewW} ${viewH}" xmlns="http://www.w3.org/2000/svg">
      ${dots}
    </svg>
  `;

  const legend = Object.keys(PARTY_COLORS)
    .filter((p) => counts[p] > 0)
    .map(
      (p) => `
        <span class="seat-map-legend-item">
          <span class="seat-map-legend-dot" style="background:${PARTY_COLORS[p]}"></span>
          ${counts[p]} ${PARTY_NAMES[p]}
        </span>
      `
    )
    .join("");

  container.innerHTML = `${svg}<div class="seat-map-legend">${legend}</div>`;
}

// ---------------------------------------------------------------------------
// Standing Committees
// ---------------------------------------------------------------------------

async function loadCommittees() {
  const el = document.getElementById("committees-grid");
  el.innerHTML = `<p class="empty-state">Loading committees&hellip;</p>`;

  try {
    const res = await fetch("/api/committees");
    const data = await res.json();
    committeesLoaded = true;
    renderCommittees(data.committees || []);
  } catch (err) {
    console.error("Falling back to nothing, backend unreachable:", err);
    el.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

function committeeMemberLink(senator, isChair) {
  return `
    <li>
      ${partyBadgeHtml(senator.party)}
      <a href="#/senators/${senator.id}">${senator.fullName}</a>
      ${isChair ? `<span class="committee-chair-tag">Chair</span>` : ""}
    </li>
  `;
}

function renderCommittees(committees) {
  const el = document.getElementById("committees-grid");
  if (committees.length === 0) {
    el.innerHTML = `<p class="empty-state">No committee data available.</p>`;
    return;
  }

  el.innerHTML = committees
    .map(
      (c) => `
      <article class="committee-card">
        <h4 class="committee-name">${c.name}</h4>
        <ul class="committee-member-list">
          ${committeeMemberLink(c.chair, true)}
          ${c.members.map((m) => committeeMemberLink(m, false)).join("")}
        </ul>
      </article>
    `
    )
    .join("");

  el.querySelectorAll(".committee-member-list a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      location.hash = link.getAttribute("href");
    });
  });
}

function applySenatorFiltersAndRender() {
  const query = document.getElementById("senator-search").value.trim().toLowerCase();
  const sortOrder = document.getElementById("senator-sort").value;
  const partyFilter = document.getElementById("senator-party-filter").value;

  let filtered = allSenators.filter((s) => {
    const haystack = `${s.fullName} ${s.lastName} ${s.district}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesParty = partyFilter === "all" || s.party === partyFilter;
    return matchesQuery && matchesParty;
  });

  filtered = filtered.sort((a, b) => {
    if (sortOrder === "name") return (a.lastName || "").localeCompare(b.lastName || "");
    return a.district - b.district;
  });

  renderSenatorGrid(filtered);
}

function partyBadgeHtml(party) {
  if (!party) return "";
  return `<span class="party-badge party-${party}">${party}</span>`;
}

function renderSenatorGrid(senators) {
  const gridEl = document.getElementById("senator-grid");
  const emptyEl = document.getElementById("senator-empty-state");

  if (senators.length === 0) {
    gridEl.innerHTML = "";
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  gridEl.innerHTML = senators
    .map(
      (s) => `
      <article class="senator-card" tabindex="0" data-id="${s.id}">
        <img class="senator-photo" src="${s.photoUrl}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" />
        <div class="senator-card-body">
          <div class="senator-district">District ${s.district} ${partyBadgeHtml(s.party)}</div>
          <h3 class="senator-name">${s.fullName}</h3>
          <p class="senator-elected">${s.electedYear ? `Elected ${s.electedYear}` : "Election year unavailable"}</p>
        </div>
      </article>
    `
    )
    .join("");

  gridEl.querySelectorAll(".senator-card").forEach((card) => {
    card.addEventListener("click", () => {
      location.hash = `#/senators/${card.dataset.id}`;
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        location.hash = `#/senators/${card.dataset.id}`;
      }
    });
  });
}

async function openSenatorDetail(id) {
  const overlay = document.getElementById("senator-overlay");
  const body = document.getElementById("senator-detail-body");
  overlay.hidden = false;
  body.innerHTML = `<p>Loading&hellip;</p>`;

  try {
    const res = await fetch(`/api/senators/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unknown error");
    renderSenatorDetail(data.senator, data.termInfo);
  } catch (err) {
    body.innerHTML = `<p>Could not load this senator's details.</p>`;
  }
}

function renderSenatorDetail(s, info) {
  const body = document.getElementById("senator-detail-body");

  const committeesHtml =
    s.committees && s.committees.length
      ? `<div class="detail-section">
           <h4>Committee Assignments</h4>
           <ul>${s.committees.map((c) => `<li>${c.name}${c.role && c.role !== "Member" ? ` &mdash; ${c.role}` : ""}</li>`).join("")}</ul>
         </div>`
      : "";

  const contactBits = [s.phone, s.email].filter(Boolean).join(" &middot; ");

  body.innerHTML = `
    <div class="senator-detail-header">
      <img class="senator-detail-photo" src="${s.photoUrl}" alt="" onerror="this.style.visibility='hidden'" />
      <div>
        <span class="detail-number">District ${s.district} ${partyBadgeHtml(s.party)}</span>
        <h3 style="margin: 4px 0 0;">${s.fullName}</h3>
        ${s.partyLabel ? `<p style="margin: 2px 0 0; color: var(--muted); font-size: 13px;">${s.partyLabel}</p>` : ""}
      </div>
    </div>

    ${
      info
        ? `<div class="detail-section"><h4>Term</h4><p>${info.termLength}. ${info.termLimit}</p></div>`
        : ""
    }

    ${
      contactBits
        ? `<div class="detail-section"><h4>Contact</h4><p>${contactBits}</p></div>`
        : ""
    }

    ${committeesHtml}

    ${s.bio ? `<div class="detail-section"><h4>Biography</h4><p>${s.bio}</p></div>` : ""}

    ${
      s.officialUrl
        ? `<a class="detail-link" href="${s.officialUrl}" target="_blank" rel="noopener">View official senator page &rarr;</a>`
        : ""
    }
  `;
}

function closeSenatorDetail() {
  const overlay = document.getElementById("senator-overlay");
  if (overlay) overlay.hidden = true;
}

document.getElementById("senator-detail-close").addEventListener("click", () => {
  closeSenatorDetail();
  // Drop back to the plain senators list rather than leaving a dangling id in the URL.
  if (currentRoute().view === "senators") location.hash = "#/senators";
});
document.getElementById("senator-overlay").addEventListener("click", (e) => {
  if (e.target.id === "senator-overlay") {
    closeSenatorDetail();
    if (currentRoute().view === "senators") location.hash = "#/senators";
  }
});

document.getElementById("senator-search").addEventListener("input", applySenatorFiltersAndRender);
document.getElementById("senator-sort").addEventListener("change", applySenatorFiltersAndRender);
document.getElementById("senator-party-filter").addEventListener("change", applySenatorFiltersAndRender);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDetail();
    closeSenatorDetail();
  }
});

// ---------------------------------------------------------------------------
// Constitutional offices
// ---------------------------------------------------------------------------

async function loadOffices() {
  const gridEl = document.getElementById("offices-grid");
  gridEl.innerHTML = `<p class="empty-state">Loading&hellip;</p>`;

  try {
    const res = await fetch("/api/offices");
    const data = await res.json();
    allOffices = data.offices || [];
    renderOfficesGrid(allOffices);
    document.getElementById("offices-note").textContent = data.note || "";
  } catch (err) {
    console.error("Falling back to nothing, backend unreachable:", err);
    gridEl.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

function renderOfficesGrid(offices) {
  const gridEl = document.getElementById("offices-grid");

  gridEl.innerHTML = offices
    .map(
      (o) => `
      <article class="office-card">
        <img class="office-photo" src="${o.photoUrl}" alt="" loading="lazy" onerror="this.style.display='none'" />
        <div class="office-title">${o.title}</div>
        <h3 class="office-holder">${o.currentHolder}</h3>
        <p class="office-party">${o.party || ""}</p>
        <div class="office-meta">
          <span>In office since ${o.since}</span>
          <span>${o.termLength}</span>
          <span>Next election: ${o.nextElection}</span>
        </div>
        <p class="office-duties">${o.duties || ""}</p>
        ${o.notes ? `<p class="office-note">${o.notes}</p>` : ""}
        ${
          o.officialUrl
            ? `<a class="office-link" href="${o.officialUrl}" target="_blank" rel="noopener">Official website &rarr;</a>`
            : ""
        }
      </article>
    `
    )
    .join("");
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

function formatNewsDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

async function loadNews() {
  const listEl = document.getElementById("news-list");
  listEl.innerHTML = `<p class="empty-state">Loading headlines&hellip;</p>`;

  try {
    const res = await fetch("/api/news");
    const data = await res.json();
    allNews = data.articles || [];
    applyNewsFiltersAndRender();
  } catch (err) {
    console.error("Falling back to nothing, backend unreachable:", err);
    listEl.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

function applyNewsFiltersAndRender() {
  const query = document.getElementById("news-search").value.trim().toLowerCase();
  const sourceFilter = document.getElementById("news-source-filter").value;

  const filtered = allNews.filter((a) => {
    const matchesQuery =
      !query || a.title.toLowerCase().includes(query) || (a.snippet || "").toLowerCase().includes(query);
    const matchesSource = sourceFilter === "all" || a.source === sourceFilter;
    return matchesQuery && matchesSource;
  });

  renderNewsList(filtered);
}

function renderNewsList(articles) {
  const listEl = document.getElementById("news-list");
  const emptyEl = document.getElementById("news-empty-state");

  if (articles.length === 0) {
    listEl.innerHTML = "";
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  listEl.innerHTML = articles
    .map(
      (a) => `
      <article class="news-card">
        <div class="news-card-top">
          <span class="news-source">${a.source}</span>
          <span class="news-date">${formatNewsDate(a.pubDate)}</span>
        </div>
        <h3 class="news-title"><a href="${a.link}" target="_blank" rel="noopener">${a.title}</a></h3>
        ${a.snippet ? `<p class="news-snippet">${a.snippet}</p>` : ""}
        <a class="news-link" href="${a.link}" target="_blank" rel="noopener">Read full story &rarr;</a>
      </article>
    `
    )
    .join("");
}

document.getElementById("news-search").addEventListener("input", applyNewsFiltersAndRender);
document.getElementById("news-source-filter").addEventListener("change", applyNewsFiltersAndRender);

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------

async function renderHome() {
  const pending = [];
  if (allBills.length === 0) pending.push(loadBills());
  if (allSenators.length === 0) pending.push(loadSenators());
  if (allOffices.length === 0) pending.push(loadOffices());
  if (allNews.length === 0) pending.push(loadNews());
  if (!agenciesData) pending.push(fetchAgencyCount());
  if (pending.length > 0) await Promise.all(pending);

  const setStat = (key, value) => {
    const el = document.querySelector(`[data-home-stat="${key}"]`);
    if (el) el.textContent = value || "\u2013";
  };
  setStat("bills", allBills.length);
  setStat("senators", allSenators.length);
  setStat("offices", allOffices.length);
  setStat("agencies", agencyCount);
  setStat("news", allNews.length);

  renderHomeRecentBills();
  renderHomeRecentNews();
}

async function fetchAgencyCount() {
  try {
    const res = await fetch("/api/agencies");
    const data = await res.json();
    agenciesData = data.stateAgencies;
    agencyCount = Object.values(agenciesData).reduce((sum, cat) => sum + cat.agencies.length, 0);
  } catch (err) {
    console.error("Could not fetch agency count:", err);
  }
}

function renderHomeRecentBills() {
  const el = document.getElementById("home-recent-bills");
  if (!el) return;
  if (allBills.length === 0) {
    el.innerHTML = `<p class="empty-state">No bills yet.</p>`;
    return;
  }
  const recent = [...allBills]
    .sort((a, b) => new Date(b.lastActionDate || 0) - new Date(a.lastActionDate || 0))
    .slice(0, 4);

  el.innerHTML = recent
    .map(
      (b) => `
      <a href="#/bills" class="home-preview-item" data-bill-id="${b.id}">
        <div class="home-preview-meta"><span>${b.number}</span><span>${formatDate(b.lastActionDate)}</span></div>
        <p class="home-preview-title">${b.title}</p>
      </a>
    `
    )
    .join("");

  el.querySelectorAll(".home-preview-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      location.hash = "#/bills";
      openDetail(item.dataset.billId);
    });
  });
}

function renderHomeRecentNews() {
  const el = document.getElementById("home-recent-news");
  if (!el) return;
  if (allNews.length === 0) {
    el.innerHTML = `<p class="empty-state">No headlines yet.</p>`;
    return;
  }
  const recent = allNews.slice(0, 4); // already sorted newest-first by the server

  el.innerHTML = recent
    .map(
      (a) => `
      <a href="${a.link}" target="_blank" rel="noopener" class="home-preview-item">
        <div class="home-preview-meta"><span>${a.source}</span><span>${formatNewsDate(a.pubDate)}</span></div>
        <p class="home-preview-title">${a.title}</p>
      </a>
    `
    )
    .join("");
}

// ---------------------------------------------------------------------------
// 2026 Elections
// ---------------------------------------------------------------------------

let electionsData = null;

async function loadElections() {
  const statewideEl = document.getElementById("statewide-races");
  const legEl = document.getElementById("legislature-races");
  statewideEl.innerHTML = `<p class="empty-state">Loading&hellip;</p>`;
  legEl.innerHTML = "";

  try {
    const res = await fetch("/api/elections");
    const data = await res.json();
    electionsData = data;
    electionsLoaded = true;

    document.getElementById(
      "elections-hero-sub"
    ).textContent = `Every statewide constitutional office and all 25 Nebraska Legislature races on the ${data.generalElectionDate} ballot, with the candidates who advanced from the ${data.primaryElectionDate} primary.`;

    renderRaceCards(statewideEl, data.statewideRaces, false);
    renderRaceCards(legEl, data.legislatureRaces, true);
  } catch (err) {
    console.error("Falling back to nothing, backend unreachable:", err);
    statewideEl.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

function raceCandidateHtml(c) {
  return `
    <div class="race-candidate">
      <div class="race-candidate-header">
        ${partyBadgeHtml(c.party)}
        <span class="race-candidate-name">${c.name}${c.incumbent ? "*" : ""}</span>
      </div>
      ${c.partyLabel ? `<span class="race-candidate-running-mate">${c.partyLabel}</span>` : ""}
    </div>
  `;
}

function renderRaceCards(container, races, isLegislature) {
  container.innerHTML = races
    .map((race) => {
      const title = isLegislature ? `District ${race.district}${race.special ? " (special)" : ""}` : race.office;
      const hasDonorData = !isLegislature && race.candidates.some((c) => c.topDonors);
      const holderClass = race.currentHolderParty ? ` race-card-holder-${race.currentHolderParty}` : "";
      return `
        <article class="race-card${holderClass}">
          <span class="race-office">${title}</span>
          <div class="race-candidates">${race.candidates.map(raceCandidateHtml).join("")}</div>
          ${hasDonorData ? `<a href="#/donors/${slugifyOffice(race.office)}" class="race-donors-link">View donor/campaign contributions &rarr;</a>` : ""}
        </article>
      `;
    })
    .join("");
}

// ---------------------------------------------------------------------------
// Donor / campaign contributions
// ---------------------------------------------------------------------------

function formatDonorAmount(amount) {
  return `$${amount.toLocaleString("en-US")}`;
}

function donorColumnHtml(label, donors) {
  if (!donors || !donors.length) {
    return `
      <div class="donor-column">
        <span class="donor-column-label">${label}</span>
        <p class="empty-state">No itemized ${label.toLowerCase()} donors on file.</p>
      </div>
    `;
  }
  return `
    <div class="donor-column">
      <span class="donor-column-label">${label}</span>
      <ol class="donor-column-list">
        ${donors
          .map(
            (d) => `
          <li class="donor-row">
            <div class="donor-row-main">
              <span class="donor-name">${d.name}</span>
              <span class="donor-amount">${formatDonorAmount(d.amount)}</span>
            </div>
            <span class="donor-location">${d.location}</span>
          </li>
        `
          )
          .join("")}
      </ol>
    </div>
  `;
}

function pieChartHtml(title, nebraska, outOfState) {
  const total = nebraska + outOfState;
  if (total <= 0) {
    return `
      <div class="pie-chart-block">
        <span class="pie-chart-title">${title}</span>
        <p class="empty-state">No itemized data.</p>
      </div>
    `;
  }
  const nePct = (nebraska / total) * 100;
  const outPct = 100 - nePct;
  return `
    <div class="pie-chart-block">
      <span class="pie-chart-title">${title}</span>
      <div class="pie-chart-row">
        <div class="pie-chart" style="background: conic-gradient(var(--prairie) 0 ${nePct}%, var(--gold) ${nePct}% 100%);" role="img" aria-label="${title}: ${nePct.toFixed(0)}% Nebraska, ${outPct.toFixed(0)}% out-of-state"></div>
        <ul class="pie-chart-legend">
          <li><span class="pie-swatch" style="background:var(--prairie)"></span>Nebraska &mdash; ${formatDonorAmount(Math.round(nebraska))} (${nePct.toFixed(0)}%)</li>
          <li><span class="pie-swatch" style="background:var(--gold)"></span>Out-of-state &mdash; ${formatDonorAmount(Math.round(outOfState))} (${outPct.toFixed(0)}%)</li>
        </ul>
      </div>
    </div>
  `;
}

function donorGeographyHtml(geography) {
  if (!geography) return "";
  const corp = geography.corporate;
  return `
    <div class="pie-charts-row">
      ${pieChartHtml("Individual contributions", geography.individual.nebraska, geography.individual.outOfState)}
      ${corp ? pieChartHtml("Corporate contributions", corp.nebraska, corp.outOfState) : ""}
    </div>
  `;
}

function donorCandidateCardHtml(c) {
  const td = c.topDonors;
  return `
    <article class="donor-candidate-card">
      <div class="donor-candidate-header">
        ${partyBadgeHtml(c.party)}
        <h3 class="donor-candidate-name">${c.name}</h3>
        ${c.incumbent ? `<span class="race-candidate-running-mate">Incumbent</span>` : ""}
      </div>
      ${
        td
          ? `
        <p class="donor-candidate-summary">
          <strong>${formatDonorAmount(td.totalRaised)}</strong> raised
          ${
            td.individualDonorCount
              ? `<span class="donor-candidate-stat">${td.individualDonorCount.toLocaleString(
                  "en-US"
                )} individual donors &middot; ${formatDonorAmount(td.individualAverage)} average contribution</span>`
              : ""
          }
        </p>
        ${donorGeographyHtml(td.geography)}
        <div class="donor-columns">
          ${donorColumnHtml("Corporate", td.corporate)}
          ${donorColumnHtml("Individual", td.individual)}
        </div>
      `
          : `<p class="empty-state">No registered campaign committee on file with NADC &mdash; hasn't crossed the $5,000 reporting threshold.</p>`
      }
    </article>
  `;
}

function slugifyOffice(office) {
  return office
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderDonorsPage(slug) {
  const container = document.getElementById("donors-candidates");
  const titleEl = document.getElementById("donors-hero-title");
  const backLinkEl = document.getElementById("donors-back-link");
  if (!electionsData) {
    container.innerHTML = `<p class="empty-state">Could not load donor data. Is the server running?</p>`;
    return;
  }
  const race = electionsData.statewideRaces.find(
    (r) => r.candidates.some((c) => c.topDonors) && slugifyOffice(r.office) === slug
  );
  if (!race) {
    if (titleEl) titleEl.textContent = "Donor & campaign contributions.";
    container.innerHTML = `<p class="empty-state">No donor data found for that race.</p>`;
    return;
  }
  if (titleEl) titleEl.textContent = `${race.office}: donor & campaign contributions.`;
  if (backLinkEl) backLinkEl.href = "#/elections";
  container.innerHTML = race.candidates.map(donorCandidateCardHtml).join("");
}

async function loadDonors(slug) {
  const container = document.getElementById("donors-candidates");
  container.innerHTML = `<p class="empty-state">Loading&hellip;</p>`;
  if (!electionsData) {
    await loadElections();
  }
  renderDonorsPage(slug);
}

// ---------------------------------------------------------------------------
// State agencies
// ---------------------------------------------------------------------------

const AGENCY_CATEGORY_LABELS = {
  constitutional: "Constitutional Agencies",
  code: "Code Agencies",
  noncode: "Noncode Agencies",
};

function agencyCategoryHtml(key, category) {
  const label = AGENCY_CATEGORY_LABELS[key] || key;
  return `
    <div class="agency-category">
      <h3 class="agency-category-title">${label} <span class="agency-category-count">${category.agencies.length}</span></h3>
      <p class="agency-category-description">${category.description}</p>
      <ul class="agency-list">
        ${category.agencies
          .map(
            (a) => `
          <li class="agency-row">
            <div class="agency-row-main">
              <span class="agency-name">${a.name}</span>
              ${a.url ? `<a class="agency-link" href="${a.url}" target="_blank" rel="noopener">Website &rarr;</a>` : ""}
            </div>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `;
}

function renderAgenciesPage(stateAgencies) {
  const container = document.getElementById("agencies-categories");
  if (!stateAgencies) {
    container.innerHTML = `<p class="empty-state">Could not load agency data. Is the server running?</p>`;
    return;
  }
  container.innerHTML = ["constitutional", "code", "noncode"]
    .map((key) => agencyCategoryHtml(key, stateAgencies[key]))
    .join("");
}

async function loadAgencies() {
  const container = document.getElementById("agencies-categories");
  if (agenciesData) {
    renderAgenciesPage(agenciesData);
    return;
  }
  container.innerHTML = `<p class="empty-state">Loading&hellip;</p>`;
  await fetchAgencyCount();
  if (agenciesData) {
    renderAgenciesPage(agenciesData);
  } else {
    container.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

loadBills();
route();
