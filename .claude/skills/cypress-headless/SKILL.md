---
name: cypress-headless
description: Run Cypress specs headless without valet, as CI does. Use when running or debugging `cypress/e2e` specs in a worktree, or when Cypress fails to verify, build or connect.
---

# Headless Cypress

Worktrees have no valet link, so mirror CI (`.github/workflows/cypress.yml`) on a free port. Pass the URLs inline and leave `.env` as it is.

1. Pick a port: `lsof -ti tcp:8080` prints nothing, else take another free port. Other sessions also serve on 8080; a foreign server there means you test their build.
2. Build for that port: `MIX_APP_URL=http://localhost:<port>/tracker MIX_WEB_URL=http://localhost:<port> MIX_API_URL=http://localhost:<port> MIX_CDN_URL= npm run dev`. `MIX_APP_URL` ends in `/tracker`, or ~60 tests fail on redirects. Empty `MIX_CDN_URL` serves images from `public/img`.
3. Serve: `npx http-server public -p <port> --silent` with `run_in_background` and `timeout: 7200000`; the default 30-minute limit kills it mid-run.
4. Run: `env -u ELECTRON_RUN_AS_NODE npx cypress run --config baseUrl=http://localhost:<port>,video=false --spec cypress/e2e/tracker/<spec>.cy.js`
5. Finish: stop the server and confirm `lsof -ti tcp:<port>` is empty (TaskStop can leave an orphan serving a stale build). Tell the user `public/` now holds localhost URLs, so valet needs `npm run dev` again.

## Failures

- "bad option: --no-sandbox": Electron hosts (T3 Code) export `ELECTRON_RUN_AS_NODE`; keep the `env -u`.
- "Cannot find native binding" (rolldown): `node_modules` predates the Vite migration; `npm ci`. Lockfile lacks the mac binding: `npm i --no-save @rolldown/binding-darwin-arm64@<rolldown version>`.
- Missing Cypress binary: `npx cypress install`.
- Many redirect failures: the build URLs don't match the served port.
- PR screenshots: Cypress empties `screenshotsFolder` each run; use a separate folder per before/after run.
