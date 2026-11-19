# EcoSpark for Kids · clickable prototype

Static site (no build step). Cloudflare Pages: framework preset None, build command empty, output folder `/`.

- Kid app: `/?start=kid`
- Parent zone: `/?start=parent`
- First launch: `/?start=launch`
- Admin (web): `/admin` (also `/?start=admin`)

Prototype settings (persona, states, open choices, proposals, reset) live in the floating button. Grown-up PIN: 1234. Grown-up code for build steps: 2580 (set in family setup, changed in Account). Deploys on every push to main.

19 Nov update (client feedback of 18 Nov, Batches 34 to 37): tab bar Garden · Shed · Scan · Builds · Learn; tap your name for Who's playing (switch player, Grown-ups and sign out); Tell Sprout in the header and on the camera; Next flower bubble without a number; "That's not right" gives the scan back; camera off goes to the parent's Camera screen; grown-up step locked until the grown-up code; +10 sparks at You made it and +10 more on approval; the parent's idea waits on the Garden; each Learn material opens its own path; bedtime goodbye; parent: terms and privacy pages in setup, grown-up code, edit or remove a child, a worry shows first, safety team page, bedtime, Account camera and code rows.

The admin is a separate page (`admin.html`, `css/admin.css`, `js/admin-*.js`) built from the WIP page "Web — Admin" (Batches 28 to 33). Its settings button (bottom left) switches persona, first sign-in, empty lists, offline, load errors and session expiry. Build data comes from the Build It content (27 builds); step stills are in `assets/builds`. "Preview in the app" frames the real kid app (`index.html?embed=1`).

Built from the Figma files "EcoSpark — DS" and "EcoSpark • WIP" (Mobile — Kid app, Mobile — Parent zone). Sprout animation is generated from the Figma motion data (`css/sprout.css`).
