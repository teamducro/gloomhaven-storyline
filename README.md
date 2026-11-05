# Gloomhaven storyline

The spoiler free storyline tracker for Gloomhaven.\
Keep track of your progress of completed and unlocked scenarios!\
https://gloomhaven-storyline.com

## Features

- **Summaries**\
  View a summary of the storyline for each state of a scenario.

  To prevent spoilers we only include a summary up-to the current scenario. The conclusion of a scenario is added after
  it has been completed.
- **Clear and organized**\
  Use the neat Flowchart overview of your completed and unlocked scenarios to keep track of your progress. The scenarios
  are color coded to quickly find available ones.

  Furthermore, it keeps your story organized!
  Blocked scenarios are displayed, along with their requirements. This way, you won't need to read up the requirements
  in the book and risk seeing spoilers.

  When you complete scenarios, you will be granted Party and Global achievements. The app features an achievements
  overview, where all your accomplishments are displayed.
- **Share with party**\
  Share your progress with your party members! Easy with Gloomhaven Storyline!

  You can share your progress manually, or have the app sync it automagically between you and your party members by
  purchasing a license. Only one person in your party needs to purchase a license, and your whole party can benefit!
- **Party Sheet**\
  Gloomhaven storyline tracker features a Party Sheet!

  With it, you can track party-related info like reputation, donations, prosperity and more, all in one place!
- **Character Sheet**\
  Character stats like, perks, xp, gold, equipped items and even ability cards are easily managed in Gloomhaven storyline tracker. 
- **Map view**\
  See all of the scenarios you've played and achievements you've gained, displayed on the original Gloomhaven map!

  All Global achievements and scenarios displayed on the map are clickable and the full functionality of the Flowchart
  view is also available in this Map view.
- **Filters**\
  Gloomhaven Storyline includes the option to track looted chests and a filter feature to find completed scenarios with
  chests you missed.

  Using the filter feature, you can find just the scenario you need to complete your personal quest.
- **Expansions**\
  The tracker supports Gloomhaven with Forgotten Circles, Gloomhaven 2nd Edition (in progress), Frosthaven, Jaws of the
  Lion, Crimson Scales and the Mercenary Pack.
- **Support for all modern devices**\
  Gloomhaven Storyline supports all modern devices and browsers. Easy to use on your smartphone.
- **Multi language**\
  Gloomhaven Storyline is available in English, French, Italian, German, Spanish, Polish, Russian, Hungarian and
  Portuguese!

  Please contact me if you like to contribute with translations.
- **Virtual Gloomhaven Board**\
  Virtual Gloomhaven Board by Purple Kingdom Games development is designed to help people play Gloomhaven remotely,
  without the need for a physical board. Gloomhaven Storyline features integration with this great tool, allowing you to
  open the virtual board directly from the scenario view.

  Registered users will join the same room as party members automatically!

## Change log

Only somewhat big features are included, every update brings bug fixes and improvements to the app!

[Change log](https://gloomhaven-storyline.com/tracker?change-log#/info)

## Credits

Thanks to these creators for their content.

[Credits](https://gloomhaven-storyline.com/tracker?credits#/info)

## How to build the tracker locally?

Install [node](https://nodejs.org/) version 22 (Vite needs at least 20.19), the installation will include `npm`.

*Quick start (no Valet)*

- Fork the project and clone it
- run `npm install`
- run `cp .github/.env .env` (the CI config, pointing at `http://localhost:8080`)
- run `npm run watch` to build into `public/` and rebuild on every change
- in a second terminal, run `npx http-server public -p 8080`

Visit the tracker on `http://localhost:8080/tracker`.

*Setup with Laravel Valet* (feel free to use something else like mamp for a local webserver)

- Install [Laravel Valet](https://laravel.com/docs/master/valet)
- Navigate to project directory
- run `valet link`
- run `valet secure`
- copy `.env.example` to `.env`
- set the `MIX_WEB_URL` to your local website, for example: `MIX_WEB_URL=https://gloomhaven-storyline.test`
- set `MIX_APP_URL` to the same domain and append `/tracker`, for example: `MIX_APP_URL=https://gloomhaven-storyline.test/tracker`
- run `npm install` from the project directory to install dependencies.
- run `npm run dev` to compile project files and assets to the `public` directory.

If everything is working correctly you can visit the tracker locally on: `https://gloomhaven-storyline.test/tracker`

*Setup with Lerd*

`.lerd.yaml` serves `public/` through nginx (`Containerfile.lerd`). `nginx.lerd.conf` has the project path hardcoded
(`root /Users/daniel/Documents/Projects/gloomhaven-storyline/public;`); change it to your own checkout. `.lerd.yaml`
also still pins `node_version: "16"`, which is too old for Vite.

*Development*

The project is a Vue 3 app built with [Vite](https://vite.dev). There is no dev server: Vite builds into `public`, which Valet or http-server serves.

- `npm run watch` rebuilds the tracker and the website on every change; refresh the browser to see it.
- `npm run dev` builds once (unminified, with source maps).
- `npm run production` builds for production (minified, hashed file names), `npm run prod-fh` builds the Frosthaven site.
- Images load from the CDN; set `MIX_CDN_URL=` (empty) to load them from `public/img`.
- The service worker caches the app; if a change doesn't show up, use a hard reload or unregister it in the browser's dev tools.

*Translations*

Translations live in `resources/js/lang/{locale}/`, one file per topic; `en.js` only combines them.

- Add new keys to the English topic file, e.g. `resources/js/lang/en/scenarios.js`.
- run `npm run lang` to copy missing keys (in English) to the other locales, then translate them there.

*Tests*

End-to-end tests use [Cypress](https://www.cypress.io).

- `npm test` opens the Cypress runner against `https://gloomhaven-storyline.test` (Valet), so build first.
- Headless against localhost, like CI: with `http-server` running on port 8080 (see quick start), run
  `npx cypress run --config baseUrl=http://localhost:8080 --spec cypress/e2e/tracker/storyline.cy.js`.
- If Cypress complains that its binary is missing, run `npx cypress install`.

After changes are made, open a Pull Request into the develop branch for review. 

All content remains under creative commons license BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
