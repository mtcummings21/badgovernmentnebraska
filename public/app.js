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

    ${
      b.sponsors && b.sponsors.length
        ? `<div class="detail-section">
             <h4>Sponsors</h4>
             <ul>${b.sponsors.map((s) => `<li>${s}</li>`).join("")}</ul>
           </div>`
        : ""
    }

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
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDetail();
});

document.getElementById("search").addEventListener("input", applyFiltersAndRender);
document.getElementById("status-filter").addEventListener("change", applyFiltersAndRender);
document.getElementById("sort-order").addEventListener("change", applyFiltersAndRender);

loadBills();
