# K Street Chronicle — Nebraska Legislature Bill Tracker (prototype)

Tracks bills moving through the Nebraska Unicameral Legislature — status, committee,
sponsors, and last action, pulled from the [LegiScan API](https://legiscan.com/legiscan) —
and profiles all 49 state senators, scraped from
[nebraskalegislature.gov](https://nebraskalegislature.gov): district, committee
assignments, term info, and the bills each one has sponsored.

This is a **state-legislature-only** prototype. Nebraska's counties, cities, and school
boards don't have a shared public API, so they're out of scope for now — see "Next steps"
below.

## Running it locally

**Requirements:** Node.js 18+ (uses the built-in `fetch`).

```bash
npm install
cp .env.example .env
npm start
```

Then open http://localhost:3000.

Without a `LEGISCAN_API_KEY` in `.env`, the site runs on realistic **sample data** —
fully functional, so you can see and click around the whole thing right away.

## Adding real data

1. Go to https://legiscan.com/legiscan and click **Sign up** (free).
2. Once logged in, generate an API key from your account page.
3. Paste it into `.env`:
   ```
   LEGISCAN_API_KEY=your_key_here
   ```
4. Restart the server (`npm start`). The header pill will switch from
   "Sample data" to "Live via LegiScan".

LegiScan's free tier is rate-limited and its underlying data refreshes roughly weekly, so
the server caches responses for 15 minutes — plenty fresh for this use case, and gentle on
your quota. If a LegiScan request ever fails (bad key, rate limit, outage), the site
quietly falls back to sample data instead of breaking.

## Senator data

Unlike bills, there's no API for this — the Nebraska Legislature's site
(`nebraskalegislature.gov`) doesn't offer one for senator info, so `src/senators.js`
scrapes it directly: the roster from `/senators/senator_list.php`, and each senator's
district, committees, contact info, and bio from their landing page
(`/senators/landing-pages/index.php?District=N`). This needs **no API key** — it works
the moment the server can reach the internet.

Bills are linked to senators by matching each sponsor's last name against the live
roster (see `src/nameMatch.js`) — reliable in a 49-member body, but it'll silently fail to
link a bill if two current senators ever share a surname, or if a sponsor string doesn't
include a recognizable one.

**"Priority bill" is a manual flag for now** (`src/priorityFlags.js`) — add or remove a
bill's id from that file by hand as priorities are announced each session. Nebraska
does publish an official Priority Bill Listing each session, but it isn't in a format
that's reliably scrapable yet; automating this is a good next step (see below).

Senator data changes rarely — mostly once per biennium — so it's cached for 24 hours
(vs. 15 minutes for bills) and falls back to `src/mockSenators.js` on any scrape failure,
same pattern as the LegiScan fallback.

**Important caveat:** the scraper was written against a snapshot of the live page fetched
during development, not tested end-to-end against a running deployment — the dev sandbox
this was built in can't reach `nebraskalegislature.gov` directly. It parses by structural
HTML tags (headings, links, list items) rather than guessing CSS class names, which
should be reasonably resilient, but **verify it actually pulls real data once deployed**.
If fields come back empty, check the server logs (it logs the scrape failure and falls
back to sample data rather than crashing) and adjust the line-matching logic in
`src/senators.js` against the real page HTML.

## How it's structured

```
server.js             Express app: serves the frontend, proxies LegiScan, scrapes
                       senator data, links sponsors to senators, caches everything
src/legiscan.js        LegiScan API client + normalization into a simple bill schema
src/mockData.js         Sample bills, shaped identically to normalized LegiScan output
src/senators.js         Scrapes nebraskalegislature.gov for roster + senator detail
src/mockSenators.js     Sample senators, matching mock bill sponsors by last name
src/nameMatch.js         Links a bill's sponsor string to a senator record
src/priorityFlags.js     Manually-maintained list of priority-bill ids
public/                 Static frontend (no build step — plain HTML/CSS/JS)
```

The frontend never talks to LegiScan or the Legislature's site directly — it only calls
this server's own `/api/bills`, `/api/bills/:id`, `/api/senators`, and `/api/senators/:id`.
That's deliberate: LegiScan keys aren't meant to be exposed in browser code, LegiScan's
API doesn't allow direct browser (CORS) requests, and scraping from a browser would hit
CORS restrictions too.

## Known limitations (it's a prototype)

- **State legislature only.** No county, city, or school-board data yet.
- **No historical trend data** — just current status per bill, not a timeline of votes.
- **In-memory cache** — resets whenever the server restarts. Fine for a prototype;
  a real deployment would want a small database instead.
- LegiScan's `getMasterList` (used for the bill list) doesn't include full descriptions,
  committee, or sponsors — those only load when you open a bill's detail view, which
  calls `getBill`.
- **Senator scraping is unverified against the live site** (see caveat above) and
  committee "Chair" roles aren't reliably detected from the landing page — everyone shows
  as "Member" from the scraper until that's refined.
- **Priority bills are manual.** No automated feed yet.

## Next steps (if you want to keep building)

- **Local government layer**: there's no shortcut here — it'd mean identifying target
  entities (say, Lincoln and Omaha city councils, Douglas and Lancaster county boards)
  and either scraping their agenda/minutes pages or manually logging entries, since
  most Nebraska municipalities don't publish structured data.
- **Persistence**: swap the in-memory cache for SQLite or Postgres so history isn't
  lost on restart, and so you can start tracking status *changes* over time.
- **Alerts**: LegiScan's change_hash field is designed exactly for "notify me when this
  bill's status changes" — a small cron job comparing hashes would enable that.
- **Deployment**: this runs anywhere Node runs (Render, Fly.io, Railway, a VPS) — just
  set `LEGISCAN_API_KEY` as an environment variable there instead of a local `.env` file.
- **Verify the senator scraper live** and fix any selector mismatches (see caveat above)
  — this is the most important next step for this feature.
- **Automate priority bills**: scrape the official Priority Bill Listing once its format
  is confirmed, instead of hand-editing `src/priorityFlags.js`.
- **Committee chair detection**: the standing-committees page
  (`/committees/standing-committees.php`) likely lists chairs separately from the
  per-senator landing pages — cross-referencing it would let `src/senators.js` mark
  "Chair" accurately instead of defaulting everyone to "Member".
- **Voting records**: LegiScan's `getRollCall` operation has individual vote positions
  per legislator — a natural follow-on to sponsor tracking.
