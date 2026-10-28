# Deployment record

Target: https://getsemu.com
Repository: https://github.com/robs46859-eng/flash
Hosting: Hostinger managed Node.js Web App
Initial release: October 28, 2026

## Local verification

- Production asset build passed.
- 18 focused source-processing tests passed.
- Dependency audit reported no vulnerabilities at installation.
- A real external-source refresh returned 15 listings, including three automatically discovered BAZAAR locations. 14 listings matched their supported source fields; the KMTATTOOLLC dynamic page did not expose its prior price and was flagged for review.
- Editorial image URLs were checked; one unavailable URL was replaced.

## Production verification

- Hostinger deployment completed for application commit `0b5ca8c62e7c92ab1e09ccc0964eb4e9e1883b39` on October 28, 2026. Source is connected to `robs46859-eng/flash`, branch `main`, with Express, Node 22.x, and entry file `server.js`.
- The initial runtime check exposed Hostinger’s CommonJS launcher incompatibility with top-level await. The deployed fix keeps startup initialization inside an async function. A dedicated regression check reproduces the launcher’s `require()` loading path.
- `https://getsemu.com/` and `/api/health` returned HTTP 200. Health identified `denver-afterhours` version `1.0.0`.
- The production `/api/listings` response returned HTTP 200 with **15 listings, 14 matching source fields, and 1 flagged changed page**. Fresh read timestamp: `2026-10-28T23:08:24.436Z` (5:08pm Denver time).
- KMTATTOOLLC’s current price was suppressed because the fetched page did not expose the supported offer field. Zeitgeist correctly displayed “Ask for a quote”; a source match is not a fixed-price claim.
- Production JavaScript, CSS, and service-worker contents exactly matched the locally built assets. The web manifest returned HTTP 200.
- GitHub Actions passed the 18 checks and production asset build for application commit `0b5ca8c62e7c92ab1e09ccc0964eb4e9e1883b39`: https://github.com/robs46859-eng/flash/actions/runs/40785094390

## Browser verification

- All five category views displayed appropriate listings. The pop-up view included five live dates after calendar discovery.
- Verified the live tattoo detail dialog with price conditions, researched hours, address, distance, website, directions, and official social links.
- Verified search, no-results recovery, walk-in filtering, distance filtering and sorting, and saved-place persistence across reloads in the local preview.
- Checked desktop at 1280px and phone layout at 390px. No horizontal page overflow; the hero content fits.
- Tested offline reload in the local preview: the app shell and last loaded listings remained accessible, saved places persisted, and an offline status appeared. The connection override was restored afterward.
- Saved a live desktop screenshot locally under `screenshots/live-desktop.jpg` (ignored by Git).

## Ongoing limits

This release refreshes its configured public sources and discovers new Denver BAZAAR event pages. Other directory membership is curated in source. It does not discover every Denver promotion or read private social posts. A matched source does not establish appointment availability, ticket inventory, or eligibility; visitors should confirm with the business. Repeated source failures remain visible as unverified status rather than silently restoring a current-price claim.
