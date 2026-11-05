# Mercenary Pack (mp), crossover pack

Never the current game: `GameData.validate` rejects it and `GameSwitch` hides it. Off by default unless the campaign has an MP class (`GameData.enabledByDefault`), toggled under Settings > Games; when enabled, `GameData.crossoverData()` merges its content into whatever game is played.

- `scenarios` in `games/mp.json`: 4 solo scenarios with string ids `AN1`, `SA1`, `CA1`, `HA1` and FH-style `loot`. Appended to the current game's scenarios; listed only when the pack is enabled and the class is in the party; unlocked when the class is unlocked or in the party.
- `items` in `games/mp.json`: 5 items (`AN`, `SA`, `CA A`, `CA B`, `HA`). Ids take the **host** game prefix (`gh-AN`, `gh2-AN`) while `item.game` stays `mp`.
- Classes AN, SA, CA, HA (`starting_group: mp_unlocked`) with masteries; abilities from `games/mp.json`, looked up by the character's own game. Enhancements price their cards FH-style.
