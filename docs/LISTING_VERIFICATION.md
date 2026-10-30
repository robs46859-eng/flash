# Supplied-listing verification — October 30, 2026

The supplied list was checked against official business, venue, university, and team/league sources before adding it. Seven businesses and all four game matchups were added. Dollar amounts below are posted service prices, not guaranteed appointment availability or discounts.

## Businesses

| Supplied entry | Verified result and change | Official sources |
| --- | --- | --- |
| Dedication Tattoo | Added at **1905 S Broadway** with a **$100 tattoo minimum**. The official page separately requires at least a $100 appointment deposit. The supplied $25–$100 flash-tattoo claim was not verified and is omitted; merchandise/prints must not be treated as tattoo-service prices. Traditional, Japanese, black-and-grey, appointments and walk-ins are supported by the official site. | [Shop information](https://www.dedicationtattoo.com/dedicated-line/), [studio](https://www.dedicationtattoo.com/), [retail shop](https://www.dedicationtattoo.com/shop/) |
| Old Larimer Street Tattoo | Added at **2229 Larimer St** with a **$75 minimum** and daily noon–8pm hours. Artists manage scheduling and deposit requirements individually. The site uses two ZIP codes, so the listing retains the verified street/city without an uncertain ZIP. A universal hourly-price claim was not added. | [Official FAQ](https://oldlarimer.com/faqs-4), [studio](https://oldlarimer.com/) |
| Mantra Tattoo & Piercing | Added the supplied **Lakewood location at 1695 Wadsworth Blvd**. The $80–$100 minimum and a universal non-hourly pricing policy could not be confirmed. Listing says **Ask for a quote**. Its locations page has conflicting hour blocks; confirm hours with the shop. | [Locations and quote link](https://mantratattoo.us/locations/), [official FAQ](https://mantratattoo.us/getting-a-tattoo-faqs/) |
| Cleopatra Ink Denver | Added at **1869 S Broadway**, with Monday and Wednesday–Sunday 10am–8pm hours and Tuesday closed. Free design consultations, walk-ins, realism and fine-line work are supported. No fixed tattoo price or universal flat-rate policy was confirmed, so it says **Ask for a quote**. Subjective claims about market competitiveness were omitted. | [Official Denver studio page](https://www.cleopatraink.com/denver) |
| Semion Barbershop | Added the **Lincoln location, 507 Lincoln St #102**. Confirmed Semion Cut **$40**, Scissor Cut **$44**, Buzz Cut **$30**, and beard trim with straight-razor shave **$40**. Signature-cut inclusions were confirmed. | [Service menu](https://www.semionbarbershop.com/services/), [Lincoln location and hours](https://www.semionbarbershop.com/location/lincoln-denver/) |
| Alfani’s Barbershop | Added at **1238 E Colfax Ave**. Confirmed signature cut **$39**, cut/beard **$55**, Two Bits **$69**, and buzz cut **$27**. Corrected Two Bits to **haircut + face shave**; the official menu does not promise an additional separate beard trim as described in the supplied label. | [Official service menu and hours](https://www.alfanisbarbershop.com/services) |
| At The Shop Denver | Added at **2907 Huron St, Suite 102**. Confirmed haircut/shampoo **$44**, head shave/razor fade **$48**, and haircut/shave **$85**. Full haircuts include shampoo. | [Service menu](https://attheshopdenver.com/services-pricing), [address and hours](https://attheshopdenver.com/find-us) |
| “Premium LoDo/RiNo Barbershops” | **Not added as a business.** This is an aggregate market estimate without an identified shop, verifiable service menu, street address or official source. The supplied $55–$85 / $75–$120 ranges are not presented as verified local offers. | No primary source supplied or verified. |

## Sports & games

These are regular ticketed events in a new **Sports & games** category. They are not presented as flash deals or discounted tickets. All times below are Denver local time.

| Game | Verified start and venue | Official schedule source |
| --- | --- | --- |
| Colorado Avalanche vs. Calgary Flames | **Oct 31, 2026 · 8pm MDT · Ball Arena** | [NHL season feed](https://api-web.nhle.com/v1/club-schedule-season/COL/20262027), game ID `2026020226`; [Ball Arena event calendar](https://www.ballarena.com/misc/all-events/) |
| Denver Broncos vs. Kansas City Chiefs | **Nov 1, 2026 · 2:25pm MST · Empower Field at Mile High** | [Broncos official schedule](https://www.denverbroncos.com/schedule/), exact home-game schema ID `chiefs-at-broncos-2026-reg-8` |
| Denver Nuggets vs. Portland Trail Blazers | **Nov 2, 2026 · 7pm MST · Ball Arena** | [Nuggets official schedule](https://www.nba.com/nuggets/schedule), [NBA game page](https://www.nba.com/game/por-vs-den-0022600169) |
| Denver Pioneers vs. Wyoming Cowboys | **Nov 14, 2026 · 1pm MST · Hamilton Gymnasium** | [DU official 2026–27 schedule](https://denverpioneers.com/sports/mens-basketball/schedule/2026-27), event ID `16268`; [university announcement](https://denverpioneers.com/news/2026/9/8/mens-basketball-denver-mens-basketball-sets-2026-non-conference-schedule) |

**None of the supplied ticket-price estimates was verified as a current purchasable price floor.** Each game displays “See ticket prices” and links to the official ticket destination when available. The app does not imply seats are available at $15, $30, $40, $65 or $150.

Venue addresses were checked against [Ball Arena](https://www.ballarena.com/connect-with-us/contact-us/), [Empower Field](https://www.empowerfieldatmilehigh.com/contact/contact_us), and [DU’s Hamilton Gymnasium entrance information](https://denverpioneers.com/news/2022/6/24/denver-athletics-to-hold-auditions-for-public-address-announcer-roles). Distances remain approximate straight-line miles from Union Station.

## Refresh behavior added

- The three new barber adapters re-read individual service prices, rather than retaining a current-price claim from an old snapshot.
- Consultation listings distinguish checking the shop/location from verifying a fixed price.
- NHL uses immutable game ID plus home/away codes; NFL uses the exact structured event ID; NBA matches home team, away team and Denver-local game date; DU matches the event ID, opponent and home venue.
- A schedule match has its own **Schedule checked** badge. It never means a ticket price was checked.
- NFL’s timezone-less UTC fields are normalized explicitly. Denver’s daylight-saving change on November 1 is covered by tests.
- Cancelled/postponed games are hidden. Without a published end time, a conservative six-hour window after the start is used to remove the game from upcoming results; it is not an advertised game duration.
- Games can be sorted by **Soonest event**. That is the default for Sports & games and Pop-up events.
- Changed or unreadable sources remain explicitly flagged. No new variables, API keys, database or paid integrations were added.
