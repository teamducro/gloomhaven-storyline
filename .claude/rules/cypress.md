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
