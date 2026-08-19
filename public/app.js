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
  const hash = location.hash.replace(/^#\/?/, ""); // "senators/9" | "senators" | "bills" | ""
  const [view, id] = hash.split("/");
  return { view: view || "bills", id: id || null };
}

function setActiveTab(view) {
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === view);
  });
}

function showView(view) {
  const sections = {
    bills: ["view-bills", "view-bills-workspace"],
    senators: ["view-senators", "view-senators-workspace"],
    offices: ["view-offices", "view-offices-workspace"],
    news: ["view-news", "view-news-workspace"],
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
    updateSourcePill(data.source);
    updateStats(allBills);
    applyFiltersAndRender();
  } catch (err) {
    console.error("Falling back to nothing, backend unreachable:", err);
    listEl.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

function updateSourcePill(source) {
  const pill = document.getElementById("source-pill");
  if (source === "legiscan") {
    pill.textContent = "Live via LegiScan";
    pill.className = "source-pill live";
  } else {
    pill.textContent = "Sample data";
    pill.className = "source-pill sample";
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
  } catch (err) {
    console.error("Falling back to nothing, backend unreachable:", err);
    gridEl.innerHTML = `<p class="empty-state">Could not reach the server. Is it running?</p>`;
  }
}

function applySenatorFiltersAndRender() {
  const query = document.getElementById("senator-search").value.trim().toLowerCase();
  const sortOrder = document.getElementById("senator-sort").value;

  let filtered = allSenators.filter((s) => {
    const haystack = `${s.fullName} ${s.lastName} ${s.district}`.toLowerCase();
    return !query || haystack.includes(query);
  });

  filtered = filtered.sort((a, b) => {
    if (sortOrder === "name") return (a.lastName || "").localeCompare(b.lastName || "");
    return a.district - b.district;
  });

  renderSenatorGrid(filtered);
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
          <div class="senator-district">District ${s.district}</div>
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
        <span class="detail-number">District ${s.district}</span>
        <h3 style="margin: 4px 0 0;">${s.fullName}</h3>
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
// Boot
// ---------------------------------------------------------------------------

loadBills();
route();
