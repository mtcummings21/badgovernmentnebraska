# Ledger — Nebraska Legislature Bill Tracker (prototype)

Tracks bills moving through the Nebraska Unicameral Legislature: status, committee,
sponsors, and last action, pulled from the [LegiScan API](https://legiscan.com/legiscan).

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

## How it's structured

```
server.js          Express app: serves the frontend, proxies LegiScan, caches responses
src/legiscan.js     LegiScan API client + normalization into a simple bill schema
src/mockData.js      Sample bills, shaped identically to normalized LegiScan output
public/              Static frontend (no build step — plain HTML/CSS/JS)
```

The frontend never talks to LegiScan directly — it only calls `/api/bills` and
`/api/bills/:id` on this server. That's deliberate: LegiScan keys aren't meant to be
exposed in browser code, and LegiScan's API doesn't allow direct browser (CORS) requests
anyway.

## Known limitations (it's a prototype)

- **State legislature only.** No county, city, or school-board data yet.
- **No historical trend data** — just current status per bill, not a timeline of votes.
- **In-memory cache** — resets whenever the server restarts. Fine for a prototype;
  a real deployment would want a small database instead.
- LegiScan's `getMasterList` (used for the bill list) doesn't include full descriptions,
  committee, or sponsors — those only load when you open a bill's detail view, which
  calls `getBill`.

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
