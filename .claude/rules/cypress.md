---
paths:
  - "cypress/**"
---

# Cypress specs

- One spec per area in `cypress/e2e/tracker/`; add to the existing spec before creating a new one. CI spreads specs over runners by line count.
- Structure each test with `// Given`, `// When`, `// Then` comments and assert exact values.
- Reuse `cypress/e2e/utilities.js` for navigation and common actions.
- Set up state through the UI, or by writing the campaign blob to localStorage and reloading; assert stored state via `win.app.campaignData`.
- Avoid `cy.wait(ms)`; where an animation forces one, say why in a comment.
- Checks that need no browser (data, source rules) go in `cypress/arch.test.js`, run by `npm run test:arch`.
- Specs listed in `.github/workflows/smoke-prod.yml` also run against production (daily, and after a deploy) with `readOnly`: every unstubbed write fails, as in CI. Keep them host-agnostic: match `Cypress.config('baseUrl')`, never `localhost`. The Frosthaven site (same build, `MIX_MAIN_GAME=fh`) runs a subset with `mainGame=fh`; text that differs per site goes in the spec's per-game table, as in `website/home.cy.js`.
- Images: `arch.test.js` checks every image the game data points to exists in `resources/img`, with a `.webp` (`cwebp -q 75`, the default the others use) (it mirrors the models' path logic; update both together). `cypress/cdn.test.js` (`npm run test:cdn`, needs `CDN_URL`) checks every file in `resources/img` is on the CDN, in the prod smoke workflow; `cdn.yml` syncs it on a merge to master.
