import general from "./general"
import storyline from "./storyline"
import scenarios from "./scenarios"
import achievements from "./achievements"
import items from "./items"
import treasures from "./treasures"
import personal_quests from "./personal_quests"
import characters from "./characters"
import prompts from "./prompts"
import abilities from "../en/abilities";

export default {
    ...general,
    ...storyline,
    "scenarios": {
        ...scenarios
    },
    "achievements": {
        ...achievements
    },
    "items": {
        ...items
    },
    "treasures": {
        ...treasures
    },
    "personal_quests": {
        ...personal_quests
    },
    "characters": {
        ...characters
    },
    "prompts": {
        ...prompts
    },
    "abilities": {
        ...abilities
    }
}
