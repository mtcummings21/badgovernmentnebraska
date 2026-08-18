// Thin client around the LegiScan public API (https://legiscan.com/legiscan),
// scoped to Nebraska ("NE"). Normalizes LegiScan's raw shape into the simpler
// schema the frontend uses, so the UI doesn't care whether data came from
// LegiScan or from src/mockData.js.

const BASE_URL = "https://api.legiscan.com/";

// LegiScan's numeric bill_status codes, mapped to our simplified stage ids.
// Anything not listed here falls back to "committee" so the UI still renders
// something reasonable rather than crashing on an unrecognized code.
const STATUS_MAP = {
  1: { status: "introduced", label: "Introduced" },
  2: { status: "general_file", label: "Engrossed / General File" },
  3: { status: "final_reading", label: "Enrolled / Final Reading" },
  4: { status: "signed", label: "Passed" },
  5: { status: "vetoed", label: "Vetoed" },
  6: { status: "failed", label: "Failed / Dead" },
};

function normalizeStatus(code) {
  return STATUS_MAP[code] || { status: "committee", label: "In Committee" };
}

async function callApi(apiKey, op, params = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("op", op);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`LegiScan HTTP ${res.status} on op=${op}`);
  }
  const data = await res.json();
  if (data.status !== "OK") {
    throw new Error(`LegiScan API error on op=${op}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

/** Find the current (or most recent) NE session id. */
async function getCurrentSessionId(apiKey) {
  const data = await callApi(apiKey, "getSessionList", { state: "NE" });
  const sessions = data.sessions || [];
  if (sessions.length === 0) throw new Error("No Nebraska sessions returned by LegiScan.");
  // Sessions are typically returned most-recent-last; prefer non-special, latest year_start.
  const sorted = [...sessions].sort((a, b) => b.year_start - a.year_start);
  return sorted[0].session_id;
}

/** Fetch and normalize the full bill list for the current NE session. */
async function fetchBillList(apiKey) {
  const sessionId = await getCurrentSessionId(apiKey);
  const data = await callApi(apiKey, "getMasterList", { id: sessionId });
  const list = data.masterlist || {};

  const bills = Object.keys(list)
    .filter((key) => key !== "session")
    .map((key) => list[key])
    .map((b) => {
      const { status, label } = normalizeStatus(b.status);
      return {
        id: String(b.bill_id),
        number: b.number,
        title: b.title,
        description: b.title, // getMasterList doesn't include full description
        status,
        statusLabel: label,
        committee: null, // requires getBill for committee detail
        sponsors: [],
        introducedDate: null,
        lastActionDate: b.last_action_date || b.status_date || null,
        lastAction: b.last_action || null,
        url: b.url || b.state_link || null,
      };
    });

  return bills;
}

/** Fetch and normalize full detail for a single bill. */
async function fetchBillDetail(apiKey, billId) {
  const data = await callApi(apiKey, "getBill", { id: billId });
  const b = data.bill;
  const { status, label } = normalizeStatus(b.status);

  return {
    id: String(b.bill_id),
    number: b.bill_number,
    title: b.title,
    description: b.description || b.title,
    status,
    statusLabel: label,
    committee: b.committee && b.committee.name ? b.committee.name : null,
    sponsors: (b.sponsors || []).map((s) => s.name),
    introducedDate: (b.history && b.history[0] && b.history[0].date) || null,
    lastActionDate: b.status_date || null,
    lastAction: (b.history && b.history[b.history.length - 1] && b.history[b.history.length - 1].action) || null,
    url: b.state_link || b.url || null,
  };
}

module.exports = { fetchBillList, fetchBillDetail };
