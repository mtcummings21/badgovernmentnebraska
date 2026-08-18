require("dotenv").config();
const express = require("express");
const path = require("path");
const { fetchBillList, fetchBillDetail } = require("./src/legiscan");
const { mockBills } = require("./src/mockData");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.LEGISCAN_API_KEY || "";

// Simple in-memory cache so we don't hammer LegiScan on every page load.
// LegiScan snapshots update weekly, so a short cache is plenty fresh.
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
let listCache = { data: null, fetchedAt: 0 };
const detailCache = new Map(); // billId -> { data, fetchedAt }

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
  res.json({
    liveDataConfigured: Boolean(API_KEY),
    source: API_KEY ? "legiscan" : "mock",
  });
});

app.get("/api/bills", async (req, res) => {
  if (!API_KEY) {
    return res.json({ source: "mock", bills: mockBills });
  }

  const fresh = listCache.data && Date.now() - listCache.fetchedAt < CACHE_TTL_MS;
  if (fresh) {
    return res.json({ source: "legiscan", bills: listCache.data });
  }

  try {
    const bills = await fetchBillList(API_KEY);
    listCache = { data: bills, fetchedAt: Date.now() };
    res.json({ source: "legiscan", bills });
  } catch (err) {
    console.error("Failed to fetch from LegiScan, falling back to sample data:", err.message);
    res.json({ source: "mock", bills: mockBills, warning: "LegiScan request failed; showing sample data." });
  }
});

app.get("/api/bills/:id", async (req, res) => {
  const { id } = req.params;

  if (!API_KEY) {
    const bill = mockBills.find((b) => b.id === id);
    if (!bill) return res.status(404).json({ error: "Bill not found in sample data." });
    return res.json({ source: "mock", bill });
  }

  const cached = detailCache.get(id);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return res.json({ source: "legiscan", bill: cached.data });
  }

  try {
    const bill = await fetchBillDetail(API_KEY, id);
    detailCache.set(id, { data: bill, fetchedAt: Date.now() });
    res.json({ source: "legiscan", bill });
  } catch (err) {
    console.error("Failed to fetch bill detail from LegiScan:", err.message);
    res.status(502).json({ error: "Could not reach LegiScan for this bill." });
  }
});

app.listen(PORT, () => {
  console.log(`Nebraska Bill Tracker running at http://localhost:${PORT}`);
  console.log(API_KEY ? "Using live LegiScan data." : "No LEGISCAN_API_KEY set — serving sample data.");
});
