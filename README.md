# EcoSpark for Kids · clickable prototype

Static site (no build step). Cloudflare Pages: framework preset None, build command empty, output folder `/`.

- Kid app: `/?start=kid`
- Parent zone: `/?start=parent`
- First launch: `/?start=launch`
- Admin (web): `/admin` (also `/?start=admin`)

Prototype settings (persona, states, open choices, proposals, reset) live in the floating button. Grown-up PIN: 1234. Deploys on every push to main.

The admin is a separate page (`admin.html`, `css/admin.css`, `js/admin-*.js`) built from the WIP page "Web — Admin" (Batches 28 to 33). Its settings button (bottom left) switches persona, first sign-in, empty lists, offline, load errors and session expiry. Build data comes from the Build It content (27 builds); step stills are in `assets/builds`. "Preview in the app" frames the real kid app (`index.html?embed=1`).

Built from the Figma files "EcoSpark — DS" and "EcoSpark • WIP" (Mobile — Kid app, Mobile — Parent zone). Sprout animation is generated from the Figma motion data (`css/sprout.css`).
