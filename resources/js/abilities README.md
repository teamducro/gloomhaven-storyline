To convert Abilities data from **worldhaven** to **Storyline**

1. Download `character-ability-cards.js` from worldhaven: https://github.com/any2cards/worldhaven/blob/master/data/character-ability-cards.js
2. Execute the below Find and Replace actions using RegEx

| Find | Replace |
| --- | --- |
| ^\s*"points":.*\n                   | delete |
| ^\s*"image":.*\n                    | delete |
| ^\s*"xws":.*\n                      | delete |
| "expansion": "Crimson Scales",      | "game": "cs", |
| "initiative":\s"(\d*)"              | "initiative": $1 |
| "level":\s"(\d*)"                   | "level": $1 |
| "cardno":\s"(\d*)"                  | "id": "cs-$1" |
| ^(\s*)("game":.*)                   | $1$2\n$1"character_id": "CG", 
Replace `CG` with the appropriate class' `character_id` abbreviation |