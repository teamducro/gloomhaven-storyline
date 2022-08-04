<template>
    <component v-bind:is="render()"></component>
</template>

<script>
import ItemTextParser from "../../services/ItemTextParser";
import ScenarioTextParser from "../../services/ScenarioTextParser";
import ScenarioRepository from "../../repositories/ScenarioRepository";
import Helpers from "../../services/Helpers";
import GameData from "../../services/GameData";
import ItemRepository from "../../repositories/ItemRepository";

export default {
    props: {
        text: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            itemTextParser: new ItemTextParser,
            scenarioTextParser: new ScenarioTextParser,
            itemRepository: new ItemRepository,
            scenarioRepository: new ScenarioRepository,
            gameData: new GameData,
            scenarios: {}
        }
    },
    methods: {
        render() {
            let output = Helpers.nl2br(this.text);
            output = this.addItemLinks(output);
            output = this.addScenarioLinks(output);
            output = this.addCharacterIcons(output);
            output = this.addIcons(output);
            const scenarios = this.scenarios;

            return {
                data() {
                    return {
                        scenarios
                    }
                },
                template: `<span>${output}</span>`
            };
        },
        addItemLinks(text) {
            this.itemTextParser.parse(text).each((itemText, id) => {
                let item = this.itemRepository.find(id);
                const linkContent = itemText.replace(`“${item._name}”`, `“${this.$t(item.name)}”`);
                text = text.replace(itemText, `<a class="link" href="#" @click.prevent="$bus.$emit('open-item', {id:${id}})">${linkContent}</a>`);
            });

            return text;
        },
        addScenarioLinks(text) {
            this.scenarioTextParser.parse(text).each((name, id) => {
                const scenario = this.scenarioRepository.find(id);
                if (scenario) {
                    if (scenario.isVisible()) {
                        this.scenarios[id] = scenario;
                        text = text.replace(name, `<scenario-number :scenario="scenarios[${id}]" :showName="true"/>`);
                    } else {
                        text = text.replace(name, this.$t('Hidden Scenario'));
                    }
                }
            });

            return text;
        },
        addCharacterIcons(text) {
            const characters = this.gameData.characterOrder(app.game);

            if (text.match(new RegExp(characters.join('|'))) !== null) {
                characters.forEach((character) => {
                    text = text.replace(`{${character}}`, `<character-icon class="w-6 -ml-1 -mb-2 inline-block" character="${character}" />`);
                });
            }

            return text;
        },
        addIcons(text) {
            if (text.includes('{')) {
                collect({
                    '{SHIELD}'              : this.$t('Shield')     + ' <webp src="/img/icons/general/shield.png" width="20" class="inline"/>',
                    '{HEAL}'                : this.$t('Heal')       + ' <webp src="/img/icons/general/heal.png" width="20" class="inline"/>',
                    '{ATTACK}'              : this.$t('Attack')     + ' <webp src="/img/icons/general/attack.png" width="20" class="inline"/>',
                    '{RANGE}'               : this.$t('Range')      + ' <webp src="/img/icons/general/range.png" width="20" class="inline"/>',
                    '{MOVE}'                : this.$t('Move')       + ' <webp src="/img/icons/general/move.png" width="20" class="inline"/>',
                    '{JUMP}'                : this.$t('Jump')       + ' <webp src="/img/icons/general/jump.png" width="20" class="inline"/>',
                    '{RECOVER}'             : this.$t('Recover')    + ' <webp src="/img/icons/general/recover_white.png" width="20" class="inline"/>',
                    '{REFRESH}'             : this.$t('Refresh')    + ' <webp src="/img/icons/general/refresh_white.png" width="20" class="inline"/>',
                    '{FLYING}'              : this.$t('Flying')     + ' <webp src="/img/icons/general/flying.png" width="20" class="inline"/>',
                    '{MODIFIER_MINUS_ONE}'  : '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                    '{-1}'                  : '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                    '{ANY}'                 : '<webp src="/img/icons/elements/any.png" width="20" class="inline"/>',
                    '{USE}'                 : '<webp src="/img/icons/elements/use.png" width="20" class="inline"/>',
                    '{DARK}'                : '<webp src="/img/icons/elements/dark.png" width="20" class="inline"/>',
                    '{EARTH}'               : '<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>',
                    '{FIRE}'                : '<webp src="/img/icons/elements/fire.png" width="20" class="inline"/>',
                    '{FIRE_LIGHT}'          : '<webp src="/img/icons/elements/fire_light.png" width="40" class="inline"/>',
                    '{ICE}'                 : '<webp src="/img/icons/elements/ice.png" width="20" class="inline"/>',
                    '{WIND}'                : '<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>',
                    '{LIGHT}'               : '<webp src="/img/icons/elements/light.png" width="20" class="inline"/>',
                    '{ANY_X}'               : '<webp src="/img/icons/elements/anyX.png" width="20" class="inline"/>',
                    '{DARK_X}'              : '<webp src="/img/icons/elements/darkX.png" width="20" class="inline"/>',
                    '{EARTH_X}'             : '<webp src="/img/icons/elements/earthX.png" width="20" class="inline"/>',
                    '{FIRE_X}'              : '<webp src="/img/icons/elements/fireX.png" width="20" class="inline"/>',
                    '{ICE_X}'               : '<webp src="/img/icons/elements/iceX.png" width="20" class="inline"/>',
                    '{WIND_X}'              : '<webp src="/img/icons/elements/windX.png" width="20" class="inline"/>',
                    '{LIGHT_X}'             : '<webp src="/img/icons/elements/lightX.png" width="20" class="inline"/>',
                    
                    '{AOE.CLEAVE_0_1}'      : '<webp src="/img/icons/aoe/cleave_0_1.png" width="40" class="inline"/>',
                    '{AOE.CONE_0_1}'        : '<webp src="/img/icons/aoe/cone_0_1.png" width="40" class="inline"/>',
                    '{AOE.CONE_1_1}'        : '<webp src="/img/icons/aoe/cone_1_1.png" width="40" class="inline"/>',
                    '{AOE.CUBE_2_2}'        : '<webp src="/img/icons/aoe/cube_2_2.png" width="40" class="inline"/>',
                    '{AOE.LINE_0_1_1}'      : '<webp src="/img/icons/aoe/line_0_1_1.png" width="60" class="inline"/>',
                    '{AOE.LINE_1_1}'        : '<webp src="/img/icons/aoe/line_1_1.png" width="60" class="inline"/>',
                    '{AOE.LINE_1_1}'        : '<webp src="/img/icons/aoe/line_1_1.png" width="60" class="inline"/>',
                    
                    '{BLESS}'       : this.$t('BLESS')      + ' <webp src="/img/icons/status/bless.png" width="20" class="inline"/>',
                    '{CURSE}'       : this.$t('CURSE')      + ' <webp src="/img/icons/status/curse.png" width="20" class="inline"/>',
                    '{DISARM}'      : this.$t('DISARM')     + ' <webp src="/img/icons/status/disarm.png" width="20" class="inline"/>',
                    '{EMPOWER}'     : this.$t('EMPOWER')    + ' <webp src="/img/icons/status/empower.png" width="20" class="inline"/>',
                    '{INVISIBLE}'   : this.$t('INVISIBLE')  + ' <webp src="/img/icons/status/invisible.png" width="20" class="inline"/>',
                    '{IMMOBILIZE}'  : this.$t('IMMOBILIZE') + ' <webp src="/img/icons/status/immobilize.png" width="20" class="inline"/>',
                    '{LOOT 1}'      : '“' + this.$t('Loot') + ' <webp src="/img/icons/general/loot_white.png" width="20" class="inline"/> 1”',
                    '{LOOT 2}'      : '“' + this.$t('Loot') + ' <webp src="/img/icons/general/loot_white.png" width="20" class="inline"/> 2”',
                    '{MUDDLE}'      : this.$t('MUDDLE')     + ' <webp src="/img/icons/status/muddle.png" width="20" class="inline"/>',
                    '{PIERCE}'      : this.$t('PIERCE')     + ' <webp src="/img/icons/status/pierce.png" width="20" class="inline"/>',
                    '{POISON}'      : this.$t('POISON')     + ' <webp src="/img/icons/status/poison.png" width="20" class="inline"/>',
                    '{PULL}'        : this.$t('PULL')       + ' <webp src="/img/icons/status/pull.png" width="20" class="inline"/>',
                    '{PUSH}'        : this.$t('PUSH')       + ' <webp src="/img/icons/status/push.png" width="20" class="inline"/>',
                    '{REGENERATE}'  : this.$t('REGENERATE') + ' <webp src="/img/icons/status/regenerate.png" width="20" class="inline"/>',
                    '{RUPTURE}'     : this.$t('RUPTURE')    + ' <webp src="/img/icons/status/rupture.png" width="20" class="inline"/>',
                    '{STRENGTHEN}'  : this.$t('STRENGTHEN') + ' <webp src="/img/icons/status/strengthen.png" width="20" class="inline"/>',
                    '{STUN}'        : this.$t('STUN')       + ' <webp src="/img/icons/status/stun.png" width="20" class="inline"/>',
                    '{SWING}'       : this.$t('SWING')      + ' <webp src="/img/icons/status/swing.png" width="20" class="inline"/>',
                    '{TARGET}'      : this.$t('TARGET')     + ' <webp src="/img/icons/status/target.png" width="20" class="inline"/>',
                    '{TELEPORT}'    : this.$t('TELEPORT')   + ' <webp src="/img/icons/general/teleport.png" width="20" class="inline"/>',
                    '{WARD}'        : this.$t('WARD')       + ' <webp src="/img/icons/status/ward.png" width="20" class="inline"/>',
                    '{WOUND}'       : this.$t('WOUND')      + ' <webp src="/img/icons/status/wound.png" width="20" class="inline"/>',

                    '{2_POISON}'    : this.$t('POISON')     + ' <webp src="/img/icons/status/poison.png_2" width="20" class="inline"/>',
                    '{3_POISON}'    : this.$t('POISON')     + ' <webp src="/img/icons/status/poison.png_3" width="20" class="inline"/>',
                    '{4_POISON}'    : this.$t('POISON')     + ' <webp src="/img/icons/status/poison.png_4" width="20" class="inline"/>',
                    '{5_POISON}'    : this.$t('POISON')     + ' <webp src="/img/icons/status/poison.png_5" width="20" class="inline"/>',
                    '{6_POISON}'    : this.$t('POISON')     + ' <webp src="/img/icons/status/poison.png_6" width="20" class="inline"/>',
                    '{7_POISON}'    : this.$t('POISON')     + ' <webp src="/img/icons/status/poison.png_7" width="20" class="inline"/>',
                    '{2_WOUND}'     : this.$t('WOUND')      + ' <webp src="/img/icons/status/wound_2.png" width="20" class="inline"/>',
                    '{3_WOUND}'     : this.$t('WOUND')      + ' <webp src="/img/icons/status/wound_3.png" width="20" class="inline"/>',
                    '{4_WOUND}'     : this.$t('WOUND')      + ' <webp src="/img/icons/status/wound_4.png" width="20" class="inline"/>',
                    
                    '{AUGMENT}'     : '<span class="text-characters-mt">' + this.$t('Augment') + '</span>',
                    '{COLONY}'      : '<span class="text-characters-aa">' + this.$t('Colony') + '</span>',
                    '{COMMAND}'     : '<span class="text-characters-bt">' + this.$t('Command') + '</span>',
                    '{DOOM}'        : '<span class="text-characters-ds">' + this.$t('Doom') + '</span>',
                    '{GLOW}'        : '<span class="text-characters-lu">' + this.$t('Glow') + '</span>',
                    '{LADDER}'      : '<span class="text-characters-fk">' + this.$t('Ladder') + '</span>',
                    '{MOUNTED}'     : '<span class="text-characters-ct">' + this.$t('Mounted') + '</span>',
                    '{PROJECTILE}'  : '<span class="text-characters-bm">' + this.$t('Projectile') + '</span>',
                    '{SATED}'       : '<span class="text-characters-rm">' + this.$t('Sated') + '</span>',
                    '{SHACKLE}'     : '<span class="text-characters-cg">' + this.$t('Shackle') + '</span>',
                    '{SONG}'        : '<span class="text-characters-ss">' + this.$t('Song') + '</span>',
                    '{SPIRIT}'      : '<span class="text-characters-sp">' + this.$t('Spirit') + '</span>',
                    '{VOID}'        : '<span class="text-characters-ho">' + this.$t('Void') + '</span>',
                    '{VOIDSIGHT}'   : '<span class="text-characters-ho">' + this.$t('Voidsight') + '</span>',
                    

                    '{-2_WHITE}'    : '<webp src="/img/icons/perks/-2_white.png" width="20" class="inline"/>',
                    '{-1_WHITE}'    : '<webp src="/img/icons/perks/-1_white.png" width="20" class="inline"/>',
                    '{+0_WHITE}'    : '<webp src="/img/icons/perks/+0_white.png" width="20" class="inline"/>',
                    '{+1_WHITE}'    : '<webp src="/img/icons/perks/+1_white.png" width="20" class="inline"/>',
                    '{+2_WHITE}'    : '<webp src="/img/icons/perks/+2_white.png" width="20" class="inline"/>',
                    '{+3_WHITE}'    : '<webp src="/img/icons/perks/+3_white.png" width="20" class="inline"/>',
                    '{+4_WHITE}'    : '<webp src="/img/icons/perks/+4_white.png" width="20" class="inline"/>',
                    '{2X_WHITE}'    : '<webp src="/img/icons/perks/2x_white.png" width="20" class="inline"/>',
                    '{AGAIN}'       : '<webp src="/img/icons/perks/again_white.png" width="20" class="inline"/>',
                    '{NOTE_115}'    : '<webp src="/img/notes/note-115.png" width="421"/>',
                    '{NOTE_42}'     : '<webp src="/img/notes/note-42.png" width="421"/>',

                    '{BODY}'        : '<webp src="/img/icons/equipment/body.png" alt="body" width="20"/>',
                    '{HEAD}'        : '<webp src="/img/icons/equipment/head.png" alt="head" width="20"/>',
                    '{LEGS}'        : '<webp src="/img/icons/equipment/legs.png" alt="legs" width="20"/>',
                    '{SMALL-ITEM}'  : '<webp src="/img/icons/equipment/small-item.png" alt="small-item" width="20"/>',
                    '{ONE-HAND}'    : '<webp src="/img/icons/equipment/one-hand.png" alt="one-hand" width="20"/>',
                    '{TWO-HANDS}'   : '<webp src="/img/icons/equipment/two-hands.png" alt="two-hands" width="20"/>'
                }).each((icon, key) => {
                    text = text.replaceAll(key, icon);
                });
            }

            return text;
        }
    }
}
</script>
