# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gloomhaven Storyline is a Vue 3 (Options API) single-page application for tracking Gloomhaven game progress. Supports multiple games (Gloomhaven, Frosthaven, Jaws of the Lion, Forgotten Circles, Crimson Scales). Operates offline-first with optional cloud sync.

## Development Commands

### Setup
```bash
npm install
cp .env.example .env
# Edit .env: set MIX_WEB_URL and MIX_APP_URL to local dev domain
valet link  # or use alternative local server
```

### Build
```bash
npm run dev        # dev build
npm run watch      # watch mode (vite build --watch into public/, no dev server)
npm run prod       # production build
npm run prod-fh    # production build for Frosthaven
```

### Testing
```bash
npm test           # opens Cypress test runner (interactive)
npx cypress run --spec cypress/e2e/tracker/storyline.cy.js  # run single test headlessly
```
Tests in `cypress/e2e/`. Cypress configured for `https://gloomhaven-storyline.test/`.

### Utilities
```bash
npm run lang                 # add missing translation keys
npm run attack-modifiers     # generate attack modifier deck JSON
npm run merge-scenarios      # merge scenario data
npm run cdn                  # sync to S3
```

## Architecture

### State Management
**No Vuex.** Uses custom patterns:
- Global state in root Vue instance (`window.app`)
- Event bus via `Vue.prototype.$bus` for cross-component communication
- `provide/inject` for reactive data (e.g., `appData.game`, `appData.story`)
- localStorage via `store` library and `Storable` mixin

### Data Flow
1. Static game data (scenarios, achievements, items) loaded from JSON files in `resources/js/*.json` via `GameData.js` service
2. Campaign state persisted to localStorage with key pattern `campaignId` → campaign data
3. Models mixin `Storable` for automatic localStorage read/write
4. `ScenarioValidator` runs iterative validation (up to 4 passes) on state changes to unlock scenarios based on achievements/requirements
5. Optional cloud sync via `StorySyncer` service and Laravel Echo/Pusher for real-time updates

### Key Patterns
- **Repository Pattern**: Data fetching/business logic (e.g., `ScenarioRepository`, `AchievementRepository`)
- **Storable Mixin**: Models define `fieldsToStore` for localStorage serialization
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
│   │   └── Storable.js     # Mixin for localStorage persistence
│   ├── repositories/       # Data access layer
│   ├── apiRepositories/    # Backend API layer
│   ├── services/           # Business logic services
│   │   ├── GameData.js     # JSON data loader
│   │   └── StorySyncer.js  # Cloud sync service
│   ├── validators/         # Validation logic
│   ├── lang/               # i18n translations (9 languages)
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
- Conflict resolution: local timestamp wins if newer

### Scenario Unlocking Logic
Core validation in `validators/ScenarioValidator.js`:
- Iterative validation passes to resolve dependencies
- Checks scenario completion, achievements, treasures, quests
- Complex requirement parsing from JSON data (e.g., `required_by: [{"complete": ["PFS"]}]`)
- Triggers on any scenario state change via event bus

### Game Data Structure
Static JSON files define scenarios, achievements, items per game:
- `scenarios-{game}.json` - scenario definitions with coordinates, links, requirements, rewards
- `achievements-{game}.json` - achievement definitions
- `items-{game}.json` - item definitions
- Loaded dynamically based on selected game via `GameData.js`

### Multi-Game Support
Game selection via `MIX_MAIN_GAME` env var (gh/fh/jotl/fc/cs):
- Different static assets copied from `resources/public-{game}`
- JSON data files suffixed by game (e.g., `scenarios-fh.json`)
- Runtime game switching supported via campaign settings

## Common Tasks

### Adding a New Component
1. Create `.vue` file in `resources/js/components/`
2. Component auto-registers globally with filename as tag name

### Modifying Scenario Data
1. Edit JSON in `resources/js/scenarios-{game}.json`
2. Run `npm run merge-scenarios` if merging external data
3. Rebuild with `npm run dev`

### Adding Translations
1. Add keys to `resources/js/lang/{locale}.json`
2. Run `npm run lang` to sync missing keys across locales

### Debugging State
- Open browser console: `window.app` for global state
- `window.app.story` for current campaign
- `window.app.scenarios` for all scenarios
- localStorage keys use pattern: `{campaignId}` → campaign data

### Testing Scenario Unlocking
1. Load tracker at `/tracker`
2. Complete scenarios via flowchart UI
3. Validator runs automatically on state change
4. Check console for validation logs
5. Cypress tests in `cypress/e2e/tracker/storyline.cy.js`
