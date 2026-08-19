// Manual priority-bill flags, keyed by bill id.
//
// Nebraska publishes an official "Priority Bill Listing" each session
// (senators get one personal priority bill, committees get theirs, and the
// Speaker gets 25), but it isn't in a stable machine-readable format yet.
// Until that's wired up, add/remove bill ids here by hand as priorities are
// announced. Works against both LegiScan bill ids and mock-* ids.
//
// TODO: automate by scraping the Priority Bill Listing PDF/page linked from
// nebraskalegislature.gov's homepage each session, once a reliable format
// is confirmed.

const priorityBillIds = new Set([
  "mock-2", // LB318 - Sen. Linehan, property tax valuation appeals
  "mock-5", // LB19 - Sen. Cavanaugh, tipped minimum wage
  "mock-6", // LB7 - Sen. Halloran, volunteer emergency responder tax credit
]);

function isPriority(billId) {
  return priorityBillIds.has(billId);
}

module.exports = { priorityBillIds, isPriority };
