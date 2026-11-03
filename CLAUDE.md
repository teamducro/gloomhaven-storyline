# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gloomhaven Storyline is a Vue 3 (Options API) single-page application for tracking Gloomhaven game progress. Supports multiple games (Gloomhaven, Frosthaven, Jaws of the Lion, Forgotten Circles, Crimson Scales). Operates offline-first with optional cloud sync.

## Development Commands

### Setup
Node 22 (`.nvmrc`; Vite needs >= 20.19). No lint or typecheck tooling exists — Cypress e2e is the only verification.
```bash
npm install
npx cypress install          # newer npm may skip Cypress's postinstall, leaving no binary

# Simplest (no Valet):
cp .github/.env .env         # preconfigured for http://localhost:8080
npm run watch & npx http-server public -p 8080 -c-1

# Or a .test domain (Cypress's default baseUrl): cp .env.example .env, set
# MIX_WEB_URL/MIX_APP_URL to https://gloomhaven-storyline.test[/tracker], then valet link && valet secure.
# lerd (.lerd.yaml) also works, but nginx.lerd.conf hardcodes the maintainer's /Users/daniel/... root path.
```

### Build
```bash
npm run dev        # dev build
npm run watch      # watch mode (vite build --watch into public/, no dev server)
npm run prod       # production build
npm run prod-fh    # production build for Frosthaven
```
Output goes to `public/` (static site, no server-side code in this repo).

### Testing
```bash
npm test           # opens Cypress test runner (interactive)
npx cypress run --spec cypress/e2e/tracker/storyline.cy.js  # run single test headlessly
npm run test:ci --spec=storyline   # headless; matches cypress/e2e/**/*storyline*.cy.js (uses the .test baseUrl)
```
Tests in `cypress/e2e/`. Cypress defaults to `https://gloomhaven-storyline.test/`. To run without valet the way CI does (`.github/workflows/cypress.yml`):
```bash
cp .github/.env .env && npm run production
npx http-server public -p 8080 --silent &
npx cypress run --config baseUrl=http://localhost:8080 --spec cypress/e2e/tracker/storyline.cy.js
```
Tests reach into app state via `window.app` / localStorage using helpers in `cypress/e2e/utilities.js`; backend calls are stubbed with `cy.intercept`.

### Utilities
```bash
npm run lang                 # add missing translation keys (temporarily needs "type": "module" in package.json)
npm run attack-modifiers     # generate attack modifier deck JSON
npm run merge-scenarios      # merge scenario data
npm run cdn                  # sync to S3
```

PRs target `develop` on upstream `teamducro/gloomhaven-storyline` (forks may only have `master`). Releases follow git-flow (`release/x.y` merged to `master`). CI runs on pushes to `develop`/`master` and on PRs.

## Architecture

### State Management
**No Vuex.** Uses custom patterns:
- Global state in root Vue instance (`window.app`)
- Event bus `$bus` (`services/EventBus.js`, a shim keeping the Vue 2 `$on/$off/$once/$emit` API) on `globalProperties`
- `provide/inject` for reactive data (e.g., `appData.game`, `appData.story`)
- localStorage via `store` library and `Storable` mixin

### Data Flow
1. Static game data (scenarios, achievements, items) loaded from JSON files in `resources/js/*.json` via `GameData.js` service
2. Campaign state persisted to localStorage as one object per campaign: `store.set(app.campaignId, app.campaignData)`. Inside it, each model has a key like `sheet-fh`, `scenario-{game}-{id}`, `achievement-{id}`, `character-{id}` (see `StorySyncer.getStoryData` for the full key → model map). A `null` value is a tombstone for a deleted model.
3. Models mixin `Storable` for automatic localStorage read/write; `Storable.store()` rewrites the whole campaign object, so writes are not per-key
4. `ScenarioValidator.validate()` re-runs the scenario pass while anything changed (capped at 5 passes), then runs `AchievementValidator` and `QuestValidator`, then `StorySyncer.store()`. It runs on state changes to unlock scenarios based on achievements/requirements
5. Optional cloud sync via `StorySyncer` service and Laravel Echo/Pusher for real-time updates

### Key Patterns
- **Repository Pattern**: Data fetching/business logic (e.g., `ScenarioRepository`, `AchievementRepository`)
- **Storable Mixin**: Models define `fieldsToStore` (`{storeKey: modelKey}` or `{storeKey: {modelKey: default}}`) for localStorage serialization. Empty values (null, `''`, `[]`) are dropped on write
- **Versionable Mixin**: Layered on Storable models. It md5-hashes `valuesToStore()` and bumps `version` when the hash changes; sync relies on this
- **Validator Pattern**: `ScenarioValidator` handles complex unlock conditions
- **Service Layer**: Cross-cutting concerns (`GameData`, `StorySyncer`, `ChoiceService`)
- **Auto-registration**: All Vue components in `resources/js/components` auto-registered globally

### Directory Structure
```
resources/
├── js/
│   ├── app.js              # Main entry, bootstraps Vue app
│   ├── routes.js           # Vue Router config
│   ├── components/         # Vue components (auto-registered)
│   │   ├── elements/       # Reusable UI elements
│   │   ├── modals/         # Modal dialogs
│   │   └── presenters/     # Complex UI presenters
│   ├── pages/              # Route-level components
│   ├── models/             # Domain models (Scenario, Sheet, Character, etc.)
│   │   ├── Storable.js     # Mixin for localStorage persistence
│   │   └── Versionable.js  # Mixin for change detection / sync versioning
│   ├── apiModels/          # Backend API models (Story, User, ...)
│   ├── mixins/             # Vue component mixins
│   ├── repositories/       # Data access layer
│   ├── apiRepositories/    # Backend API layer
│   ├── services/           # Business logic services
│   │   ├── GameData.js     # JSON data loader
│   │   └── StorySyncer.js  # Cloud sync service
│   ├── validators/         # Validation logic
│   ├── lang/{locale}/*.js  # i18n translations (9 locales; en is source of truth)
│   └── *.json              # Static game data
├── sass/                   # Stylesheets
├── svg/                    # SVG assets
├── public-gh/              # Gloomhaven-specific static files
└── public-fh/              # Frosthaven-specific static files
```

### Build System
Vite configured in `vite.config.mjs`, run twice (`BUNDLE=app|website`) so each bundle gets one css file:
- Vue 3 full build (`vue/dist/vue.esm-bundler.js`): root templates live in-DOM in `index.html`
- Env vars keep the `MIX_` prefix (`envPrefix`), read via `import.meta.env.MIX_*`
- Tailwind CSS + Material Design SCSS, imported from the entry files
- Inline SVGs via `import.meta.glob('...svg', {query: '?raw'})` in `InlineSvg.vue`
- Production entry files are content-hashed (`js/app-<hash>.js`, written into the HTML): lazy chunks import the entry
  by file name, so a `?v=` query would load the app twice. CSS keeps `?v=`.
- Post-build plugin: copies `resources/public-{game}`, img, svg, fonts to `public/`, entry/`?v=` versioning,
  service worker cache version + precache file list (`'build-files'` placeholder)
- Multi-game builds: `MIX_MAIN_GAME=gh|fh` selects base game

Two bundles:
- `app.js` - main tracker app (loads at `/tracker`)
- `website.js` - marketing site (loads at `/`)

vue-i18n 11 runs in legacy mode via `services/createLegacyI18n.js`, with a lenient message compiler:
messages contain custom `{TOKEN}` placeholders and literal `|` that the vue-i18n 9+ syntax rejects.

### Backend Integration
Optional Laravel backend for cloud sync:
- API calls via `apiRepositories/*Repository.js` using axios
- Laravel Echo + Pusher for real-time sync
- Offline-first: works fully without backend, syncs when logged in
- `StorySyncer.store()` pushes only when the story hash changed. Per-model conflict handling relies on the Versionable `version`. The server-side merge rule is not in this repo
- With `MIX_API_URL` empty (as in CI), there is no backend. Cypress stubs the endpoints it touches

### Scenario Unlocking Logic
Core validation in `validators/ScenarioValidator.js`:
- Iterative validation passes to resolve dependencies
- Checks scenario completion, achievements, treasures, quests
- Complex requirement parsing from JSON data (e.g., `required_by: [{"complete": ["PFS"]}]`)
- Triggers on any scenario state change via event bus

### Game Data Structure
Static JSON files define scenarios, achievements, items, quests, abilities per game:
- Base Gloomhaven files are **unsuffixed** (`scenarios.json`, `items.json`); other games use a suffix: `-fh`, `-jotl`, `-fc`, `-cs`, `-mp` (Mercenary Pack). Not every game has every file (e.g. FC reuses GH scenarios)
- `scenarios*.json` - scenario definitions with coordinates, links, requirements, rewards
- All JSON is statically imported in `GameData.js` and bundled into the app. A new data file must be imported there
- New game support also touches `models/Game.js`

### Multi-Game Support
- `MIX_MAIN_GAME` (build time) is only `gh` or `fh`. It picks `resources/public-{gh|fh}` and the default game. The other games are runtime choices, not separate builds
- Runtime game switching: `$bus` event `game-selected` → `app.switchGame`, which re-fetches scenarios/achievements/quests from the repositories

## Common Tasks

### Adding a New Component
1. Create `.vue` file in `resources/js/components/`
2. Component auto-registers globally with filename as tag name

### Modifying Scenario Data
1. Edit JSON in `resources/js/scenarios[-{game}].json`
2. Run `npm run merge-scenarios` if merging external data
3. Rebuild with `npm run dev`

### Adding Translations
1. Add keys to `resources/js/lang/en/<file>.js` (aggregated by `en.js`)
2. Run `npm run lang` to copy missing keys into the other locales

### Debugging State
- Open browser console: `window.app` for global state
- `window.app.story` for current campaign
- `window.app.scenarios` for all scenarios
- `window.app.campaignData` is the in-memory campaign object; `localStorage[window.app.campaignId]` is the persisted copy

### Testing Scenario Unlocking
1. Load tracker at `/tracker`
2. Complete scenarios via flowchart UI
3. Validator runs automatically on state change (it doesn't log; inspect `window.app.scenarios` instead)
4. Cypress tests in `cypress/e2e/tracker/storyline.cy.js`
