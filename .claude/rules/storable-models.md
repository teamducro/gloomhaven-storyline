---
paths:
  - "resources/js/models/**"
---

# Storable models

What a `Storable` model stores is a contract with every existing campaign, on the device and on the server.

- `fieldsToStore` maps the stored name to the model property: `stored: 'property'`, or `stored: {property: defaultValue}` when a campaign without the field needs a default.
- Adding a field: give it a default if the code can't handle `undefined`, then add it to `storage` in `cypress/arch.test.js`.
- Never rename or remove a stored name or change a `key()` without reading the old format too (see `services/app/migrate*.js`).
- `valuesToStore()` drops `null`, `''` and empty arrays, so a stored value can come back as its default.
- `delete()` writes `null` under the key (a tombstone the server needs); don't remove the key.
- `Versionable` models carry `version` and `hash`; `StorySyncer` bumps them, models don't.
