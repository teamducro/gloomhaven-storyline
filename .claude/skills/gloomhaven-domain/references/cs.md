# Crimson Scales (cs)

A fan-made campaign (originally free print-and-play, later published) built on Gloomhaven rules, free in the tracker; it reuses GH achievements, item shop and enhancement costs.

## Data

- `games/cs.json` `scenarios`: 79 scenarios, **no map coordinates** (no Map page, no scenario images). Story chapters 1 Intro, 2 Infectious, 3 Wonderous, 4 Chilly, 5 Sail, 6 Tainted; side chapters 100 Solo Quests, 101 Personal Quests, 102 Road Events, 103 City Events, 104 Side Quests; add-on chapters 12 Beetle (AA), 13 Tools (QA), 14 Bleeding Claw (RM) with string ids (`"AA1"`, `"RM5"`). Extra fields `pages`, `monsters`, `cards` (event cards that unlock a scenario), `solo`.
- Achievements are `PCS*` Party achievements in `games/cs.json`, served together with the GH ones (`GameData.achievements`); GH Global achievements and the GH city rule therefore also apply.
- `items` (1–100 plus `aa01`…, `qa01`…, `rm01`…), `personalQuests` (string ids `"330"`, `"aa-001"`), `abilities`; `quests` is empty.

## Party sheet (`pages/PartyCs.vue`)

Reputation, donations, prosperity (CS thresholds 1/4/9/15/22/30/39/50/60), City/Road decks (1–30 start, up to 60), scenario level, notes, class unlocks. Storage key `sheet-cs`.

Sheet unlocks are the CS "every 5 completed scenarios, tick one box" track: 14 rewards alternating +3 prosperity with event 59/60 or scenarios 51–55. Ticking/unticking sets the linked scenario to `incomplete`/`hidden`.

## Alliances

City event 42 grants the manual achievement `PCSOA` (Oak Alliance) or `PCSIA` (Inox Alliance), which unlock side scenario 49 or 50 via `required_by`. Other manual ones: `PCSGB`, `PCSFR`. Conclusion decision `undeadTerrors` (scenario 30) awards `PCSTM` or `PCSPL`.

## Characters and items

- 10 starting classes (BM, BK, CG, CT, FK, HP, HO, LU, MF, ST); locked SP and add-on classes AA, QA, RM. Personal quests unlock a class (`character_unlock`) and sometimes a scenario.
- Solo scenarios 56–66 appear as soon as their class is unlocked or in the party.
- CS perks have text only (no `cards`), so the attack modifier deck is hidden for CS classes in any campaign.
- Abilities: level `1.5` = X cards, `0.1` = Hierophant prayer cards (always in pool), milestone cards cs-675…688.
- Shop = GH item deck by prosperity (`calculateItemsGh`) + CS item designs 1–100 ticked by hand; the Items page always shows the game column. Reward text "(Item N)" in CS refers to GH items.
- Enhancements: classic costs, limit = prosperity level.
