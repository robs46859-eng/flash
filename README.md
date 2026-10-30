# Denver Afterhours

An installable, mobile-friendly web app for finding flash tattoos and spontaneous local plans in Denver and the surrounding metro area.

**Live app:** [getsemu.com](https://getsemu.com)
**Source:** [robs46859-eng/flash](https://github.com/robs46859-eng/flash)

## What it does

- Separate categories for **flash tattoos, barbers, spas, theaters, sports & games, and pop-up events**.
- Shop details with official websites, published social links, researched hours, addresses, costs, offer conditions, and directions.
- Approximate straight-line distance from **Denver Union Station**, the app’s downtown reference. Coordinates are approximate; these are not walking or driving distances.
- Search by shop, neighborhood, or style; filter by budget, distance, offers, and walk-ins; sort by distance, price, or name.
- Save spots on your device, or choose a random find.
- Refresh official sources on page load, on reconnect, and when **Refresh finds** is selected.
- Installable PWA with app icons, a web manifest, an offline app shell, and the last loaded listing snapshot.

## Freshness and coverage

The directory contains 23 researched entries: the original 12 researched October 28, 2026, plus seven businesses and four games verified October 30. The official Denver BAZAAR calendar can add more event locations automatically. See [the verification report](docs/LISTING_VERIFICATION.md) for each supplied claim, corrections, primary sources, and excluded price estimates.

This is a curated directory with supported source parsers, **not a citywide web or social-media crawler**. Sports entries check configured official schedules on refresh and link to ticket providers; ticket-price estimates are not advertised. Games without a published end time leave upcoming results six hours after their start (a display cutoff, not a promised duration). It does not scrape Instagram feeds, bypass login, or guarantee remaining appointments or tickets.

Every completed refresh reads the configured official pages again. Concurrent visitors share only an already-running check; completed checks are not reused. Browser API responses are `no-store`, and the service worker never caches API requests.

- **Source checked:** the relevant posted price/offer or structured event was matched.
- **Schedule checked:** the official home-game schedule matched; ticket prices and seat availability are not verified.
- **Shop checked:** the shop/location matched, but there is no verified fixed tattoo price; request a quote.
- **Page changed:** the page loaded, but the supported offer field was not found. Its current price is hidden.
- **Check source:** the source could not be read. Its current price is hidden.
- **Researched:** the initial snapshot or previously loaded information is being displayed, with its date.

Regular menu prices and shop minimums are explicitly distinguished from discounted or flash offers. An undated offer being posted does not prove that it can be booked today. Check with the business before visiting. Prices may exclude gratuity, tax, extras, or fees described at the source.

Business hours refresh when matching location-specific structured hours are present; otherwise, researched hours remain labeled as researched. Venue coordinates and directory membership are maintained in source. Expired, postponed, and cancelled events are excluded from the visible results. Discovery only follows the configured organizer’s event links, accepts Colorado locations with known coordinates, and excludes locations over 30 miles from Union Station.

### Main sources

- [Certified Tattoo flash pricing](https://certifiedtattoo.com/flash-tattoos)
- [Ritual Tattoo](https://www.ritualtattoogallery.com/)
- [Think Tank Tattoo](https://www.thinktanktattoo.com/)
- [KMTATTOOLLC](https://kmtattoollc.glossgenius.com/about) — dynamic page may not expose its pricing to the refresh service; shown with a needs-review status when unmatched.
- [Zeitgeist pre-drawn designs](https://www.zeitgeisttattoodenver.com/predrawn)
- [The Usual Barbershop](https://www.theusualbarbershop.com/)
- [Lake Steam Baths](https://www.lakesteam.com/)
- [Oakwell downtown location](https://oakwell.com/beer-spa-downtown-denver/) — published hours differ between official pages, so the app asks visitors to confirm their booking time.
- [DCPA rush tickets](https://www.denvercenter.org/rush-tickets/)
- [Denver BAZAAR calendar](https://denverbazaar.com/)

Editorial photographs are served from Unsplash and illustrate categories; they do not depict or imply endorsement by a particular listed shop. Web fonts are served by Google Fonts. Core browsing remains usable if those services are unavailable.

## Run locally

Requires **Node.js 22 or newer** and npm. No database, accounts, location permission, private API keys, or paid integrations are required.

```bash
npm ci
npm run build
npm start
```

Open <http://localhost:4318>. Set `PORT` to change the listening port; `HOST` defaults to `0.0.0.0` for managed hosting. `npm run dev` builds once and starts the server; rebuild and restart after source changes.

```bash
npm test
```

The 33-test focused suite covers price extraction, changed/removed offers, deposit-versus-price handling, social-link filtering, distance, cancellation/expiration, structured event discovery, missing prices, source failures, fresh reads, game identity, home/away matching, timezone conversion, postponements, service-menu updates, and Hostinger launcher compatibility. Live source checks and browser checks are recorded separately in `DEPLOYMENT.md`.

## Deploy on Hostinger managed Node.js hosting

The production deployment uses Hostinger’s managed **Web App / Node.js** service, connected to this repository.

| Setting | Value |
| --- | --- |
| Domain | `getsemu.com` |
| Framework | Express |
| Root directory | Repository root |
| Node.js | 22 or newer |
| Package manager | npm |
| Install | `npm ci` |
| Build command | `npm run build` |
| Start command | `npm start` |
| Entry file | `server.js` |
| Static assets | `dist/`, served by Express |
| Environment | Hostinger supplies `PORT`; no secrets needed |

The server builds the static assets automatically if the host invokes `server.js` without running the build step. Use the **Node.js Web App** workflow; uploading only `dist/` to PHP/static hosting will not provide the refresh API. Enable automatic deployments from `main` if desired. A deployment should pass the checks below before being treated as ready.

```bash
curl https://getsemu.com/api/health
curl https://getsemu.com/api/listings
```

`/api/health` confirms the server process is responding. `/api/listings` performs actual external reads and reports per-listing results, so inspect its `confirmed` count and statuses as well. A healthy server does not guarantee every external source is readable.

## Project structure

```text
server.js              Express server, headers, API and static assets
src/data.mjs           Original places and directory exports
src/additions.mjs      Businesses and sports verified October 30
src/sports.mjs         NHL/NFL/NBA/DU schedule adapters
src/engine.mjs         Source fetching, bounded discovery and extraction
src/index.html         Accessible responsive application shell
src/styles.css         Layout and visual design
src/app.js             Search, filters, saved places, details and refresh
src/sw.js              Offline shell, excluding API requests
scripts/build.mjs      Generates dist/ and researched seed data
tests/engine.test.mjs   Original source-processing checks
tests/additions.test.mjs Price and schedule verification regressions
```

To add a place, update `src/data.mjs` with an official source, researched details, approximate coordinates, and an appropriate price rule. Add a parser and a focused fixture test if the source format is new. Then build, test, verify the real source, and redeploy.

## Privacy and limitations

Saved IDs and the last listing snapshot live in browser storage. There are no user accounts, analytics, submissions, payments, or GPS requests. The server reads public business pages only. Source outages and markup changes are handled explicitly. Device storage may be cleared by the browser; offline fonts and third-party photos are not guaranteed.
