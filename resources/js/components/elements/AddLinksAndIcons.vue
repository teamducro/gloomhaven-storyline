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
    inject: ['appData'],
    props: {
        text: {
            type: String,
            required: true
        },
        tag: {
            type: String,
            default: 'span'
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
                template: `<${this.tag}>${output}</${this.tag}>`
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
            const characters = this.gameData.characterOrder(this.appData.game);

            if (text.match(new RegExp('{' + characters.join('|'))) !== null) {
                characters.forEach((character) => {
                    text = text.replace(`{${character}_CIRCLE}`, `<span class="rounded-full border border-white inline-flex"><character-icon class="w-4" character="${character}" /></span>`);
                    text = text.replace(`{${character}}`, `<character-icon class="w-6 -ml-1 -mb-2 inline-block" character="${character}" />`);
                });
            }

            return text;
        },
        addIcons(text) {
            if (text.includes('{')) {
                collect({
                    // Ability Enhancements
                    '{SHIELD}': this.$t('Shield') + ' <webp src="/img/icons/general/shield.png" width="20" class="inline"/>',
                    '{HEAL}': this.$t('Heal') + ' <webp src="/img/icons/general/heal.png" width="20" class="inline"/>',
                    '{ATTACK}': this.$t('Attack') + ' <webp src="/img/icons/general/attack.png" width="20" class="inline"/>',
                    '{RANGE}': this.$t('Range') + ' <webp src="/img/icons/general/range.png" width="20" class="inline"/>',
                    '{MOVE}': this.$t('Move') + ' <webp src="/img/icons/general/move.png" width="20" class="inline"/>',
                    '{JUMP}': this.$t('Jump') + ' <webp src="/img/icons/general/jump.png" width="20" class="inline"/>',
                    '{FLYING}': this.$t('Flying') + ' <webp src="/img/icons/general/flying.png" width="20" class="inline"/>',
                    '{RETALIATE}': this.$t('REGENERATE') + ' <webp src="/img/icons/general/retaliate.png" width="20" class="inline"/>',
                    '{SWING}': this.$t('SWING') + ' <webp src="/img/icons/general/swing.png" width="20" class="inline"/>',
                    '{TELEPORT}': this.$t('TELEPORT') + ' <webp src="/img/icons/general/teleport.png" width="20" class="inline"/>',
                    '{TARGET}': this.$t('TARGET') + ' <webp src="/img/icons/general/target.png" width="20" class="inline"/>',

                    '{RECOVER}': this.$t('Recover') + ' <webp src="/img/icons/general/recover_white.png" width="20" class="inline"/>',
                    '{REFRESH}': this.$t('Refresh') + ' <webp src="/img/icons/general/refresh_white.png" width="20" class="inline"/>',
                    '{SPENT}': this.$t('Spent') + ' <webp src="/img/icons/general/spent_white.png" width="20" class="inline"/>',
                    '{CONSUMED}': this.$t('Consumed') + ' <webp src="/img/icons/general/consumed_white.png" width="20" class="inline"/>',
                    '{LOST}': this.$t('Lost') + ' <webp src="/img/icons/general/lost_white.png" width="20" class="inline"/>',

                    '{MODIFIER_MINUS_ONE}': '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                    '{-1}': '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                    '{SOLDIER}': '<inline-svg src="icons/soldier"/>',

                    // Elements
                    '{ANY}': '<webp src="/img/icons/elements/any.png" width="20" class="inline"/>',
                    '{USE}': '<webp src="/img/icons/elements/use.png" width="20" class="inline"/>',
                    '{DARK}': '<webp src="/img/icons/elements/dark.png" width="20" class="inline"/>',
                    '{EARTH}': '<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>',
                    '{EARTH_FIRE}': '<webp src="/img/icons/elements/earth_fire.png" width="40" class="inline"/>',
                    '{FIRE}': '<webp src="/img/icons/elements/fire.png" width="20" class="inline"/>',
                    '{FIRE_LIGHT}': '<webp src="/img/icons/elements/fire_light.png" width="40" class="inline"/>',
                    '{ICE}': '<webp src="/img/icons/elements/ice.png" width="20" class="inline"/>',
                    '{WIND}': '<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>',
                    '{LIGHT}': '<webp src="/img/icons/elements/light.png" width="20" class="inline"/>',
                    '{ANY_X}': '<webp src="/img/icons/elements/anyX.png" width="20" class="inline"/>',
                    '{DARK_X}': '<webp src="/img/icons/elements/darkX.png" width="20" class="inline"/>',
                    '{EARTH_X}': '<webp src="/img/icons/elements/earthX.png" width="20" class="inline"/>',
                    '{FIRE_X}': '<webp src="/img/icons/elements/fireX.png" width="20" class="inline"/>',
                    '{ICE_X}': '<webp src="/img/icons/elements/iceX.png" width="20" class="inline"/>',
                    '{WIND_X}': '<webp src="/img/icons/elements/windX.png" width="20" class="inline"/>',
                    '{LIGHT_X}': '<webp src="/img/icons/elements/lightX.png" width="20" class="inline"/>',
                    
                    // TODO: Frosthaven mixed element icons (also Frosthaven-style icons for consumed elements).
                    '{EARTH_OR_DARK}': '<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>/<webp src="/img/icons/elements/dark.png" width="20" class="inline"/>',
                    '{EARTH_OR_DARK_X}': '<webp src="/img/icons/elements/earthX.png" width="20" class="inline"/>/<webp src="/img/icons/elements/darkX.png" width="20" class="inline"/>',
                    '{FIRE_OR_EARTH}': '<webp src="/img/icons/elements/fire.png" width="20" class="inline"/>/<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>',
                    '{FIRE_OR_WIND}': '<webp src="/img/icons/elements/fire.png" width="20" class="inline"/>/<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>',
                    '{FIRE_OR_LIGHT_X}': '<webp src="/img/icons/elements/fireX.png" width="20" class="inline"/>/<webp src="/img/icons/elements/lightX.png" width="20" class="inline"/>',
                    '{ICE_OR_EARTH}': '<webp src="/img/icons/elements/ice.png" width="20" class="inline"/>/<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>',
                    '{ICE_OR_EARTH_X}': '<webp src="/img/icons/elements/iceX.png" width="20" class="inline"/>/<webp src="/img/icons/elements/earthX.png" width="20" class="inline"/>',
                    '{ICE_OR_WIND}': '<webp src="/img/icons/elements/ice.png" width="20" class="inline"/>/<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>',
                    '{ICE_OR_WIND_X}': '<webp src="/img/icons/elements/iceX.png" width="20" class="inline"/>/<webp src="/img/icons/elements/windX.png" width="20" class="inline"/>',
                    '{WIND_OR_EARTH}': '<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>/<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>',
                    '{WIND_OR_LIGHT}': '<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>/<webp src="/img/icons/elements/light.png" width="20" class="inline"/>',
                    '{WIND_OR_DARK}': '<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>/<webp src="/img/icons/elements/dark.png" width="20" class="inline"/>',
                    '{LIGHT_OR_DARK}': '<webp src="/img/icons/elements/light.png" width="20" class="inline"/>/<webp src="/img/icons/elements/dark.png" width="20" class="inline"/>',

                    '{AOE.CLEAVE_0_1}': '<webp src="/img/icons/aoe/cleave_0_1.png" width="40" class="inline"/>',
                    '{AOE.CONE_0_1}': '<webp src="/img/icons/aoe/cone_0_1.png" width="40" class="inline"/>',
                    '{AOE.CONE_1_1}': '<webp src="/img/icons/aoe/cone_1_1.png" width="40" class="inline"/>',
                    '{AOE.CUBE_2_2}': '<webp src="/img/icons/aoe/cube_2_2.png" width="40" class="inline"/>',
                    '{AOE.LINE_0_1_1}': '<webp src="/img/icons/aoe/line_0_1_1.png" width="60" class="inline"/>',
                    '{AOE.LINE_1_1}': '<webp src="/img/icons/aoe/line_1_1.png" width="60" class="inline"/>',

                    // Conditions
                    '{BANE}': this.$t('BANE') + ' <webp src="/img/icons/status/bane.png" width="20" class="inline"/>',
                    '{BLESS}': this.$t('BLESS') + ' <webp src="/img/icons/status/bless.png" width="20" class="inline"/>',
                    '{BRITTLE}': this.$t('BRITTLE') + ' <webp src="/img/icons/status/brittle.png" width="20" class="inline"/>',
                    '{CHILL}': this.$t('CHILL') + ' <webp src="/img/icons/status/chill.png" width="20" class="inline"/>',
                    '{CURSE}': this.$t('CURSE') + ' <webp src="/img/icons/status/curse.png" width="20" class="inline"/>',
                    '{DISARM}': this.$t('DISARM') + ' <webp src="/img/icons/status/disarm.png" width="20" class="inline"/>',
                    '{EMPOWER}': this.$t('EMPOWER') + ' <webp src="/img/icons/status/empower.png" width="20" class="inline"/>',
                    '{IMMOBILIZE}': this.$t('IMMOBILIZE') + ' <webp src="/img/icons/status/immobilize.png" width="20" class="inline"/>',
                    '{IMPAIR}': this.$t('IMPAIR') + ' <webp src="/img/icons/status/impair.png" width="20" class="inline"/>',
                    '{INFECT}': this.$t('INFECT') + ' <webp src="/img/icons/status/infect.png" width="20" class="inline"/>',
                    '{INVISIBLE}': this.$t('INVISIBLE') + ' <webp src="/img/icons/status/invisible.png" width="20" class="inline"/>',
                    '{LOOT 1}': '“' + this.$t('Loot') + ' <webp src="/img/icons/general/loot_white.png" width="20" class="inline"/> 1”',
                    '{LOOT 2}': '“' + this.$t('Loot') + ' <webp src="/img/icons/general/loot_white.png" width="20" class="inline"/> 2”',
                    '{MUDDLE}': this.$t('MUDDLE') + ' <webp src="/img/icons/status/muddle.png" width="20" class="inline"/>',
                    '{PIERCE}': this.$t('PIERCE') + ' <webp src="/img/icons/status/pierce.png" width="20" class="inline"/>',
                    '{POISON}': this.$t('POISON') + ' <webp src="/img/icons/status/poison.png" width="20" class="inline"/>',
                    '{PULL}': this.$t('PULL') + ' <webp src="/img/icons/status/pull.png" width="20" class="inline"/>',
                    '{PUSH}': this.$t('PUSH') + ' <webp src="/img/icons/status/push.png" width="20" class="inline"/>',
                    '{REGENERATE}': this.$t('REGENERATE') + ' <webp src="/img/icons/status/regenerate.png" width="20" class="inline"/>',
                    '{RUPTURE}': this.$t('RUPTURE') + ' <webp src="/img/icons/status/rupture.png" width="20" class="inline"/>',
                    '{STRENGTHEN}': this.$t('STRENGTHEN') + ' <webp src="/img/icons/status/strengthen.png" width="20" class="inline"/>',
                    '{STUN}': this.$t('STUN') + ' <webp src="/img/icons/status/stun.png" width="20" class="inline"/>',
                    '{WARD}': this.$t('WARD') + ' <webp src="/img/icons/status/ward.png" width="20" class="inline"/>',
                    '{WOUND}': this.$t('WOUND') + ' <webp src="/img/icons/status/wound.png" width="20" class="inline"/>',
                    '{POISON_2}': this.$t('POISON') + ' <webp src="/img/icons/status/poison-2.png" width="20" class="inline"/>',
                    '{POISON_3}': this.$t('POISON') + ' <webp src="/img/icons/status/poison-3.png" width="20" class="inline"/>',
                    '{POISON_4}': this.$t('POISON') + ' <webp src="/img/icons/status/poison-4.png" width="20" class="inline"/>',
                    '{WOUND_2}': this.$t('WOUND') + ' <webp src="/img/icons/status/wound-2.png" width="20" class="inline"/>',
                    '{WOUND_3}': this.$t('WOUND') + ' <webp src="/img/icons/status/wound-3.png" width="20" class="inline"/>',

                    // Class-colored Text
                    '{COLONY}': '<span class="text-character-aa">' + this.$t('Colony') + '</span>',
                    '{CULTIVATE}': '<span class="text-character-aa">' + this.$t('Cultivate') + '</span>',
                    '{DEATHSHROUD_SPIDER}': '<span class="text-character-aa">' + this.$t('Deathshroud') + '</span>',
                    '{FIRESPITTER_ANT}': '<span class="text-character-aa">' + this.$t('Firespitter') + '</span>',
                    '{GHOST_SHIMMER_BEE}': '<span class="text-character-aa">' + this.$t('Ghostshimmer') + '</span>',
                    '{ROCKSPINE_TERMITE}': '<span class="text-character-aa">' + this.$t('Rockspine') + '</span>',
                    '{RUPTURED}': '<span class="text-character-aa">' + this.$t('Ruptured') + '</span>',
                    '{AUGMENT}': '<span class="text-character-mt">' + this.$t('Augment') + '</span>',
                    '{COMMAND}': '<span class="text-character-bt">' + this.$t('Command') + '</span>',
                    '{DOOM}': '<span class="text-character-ds">' + this.$t('Doom') + '</span>',
                    '{GLOW}': '<span class="text-character-lu">' + this.$t('Glow') + '</span>',
                    '{LADDER}': '<span class="text-character-fk">' + this.$t('Ladder') + '</span>',
                    '{MOUNT}': '<span class="text-character-ct">' + this.$t('Mount') + '</span>',
                    '{MOUNTED}': '<span class="text-character-ct">' + this.$t('Mounted') + '</span>',
                    '{PRAYER}': '<span class="text-character-hp">' + this.$t('Prayer') + '</span>',
                    '{PRAYERS}': '<span class="text-character-hp">' + this.$t('Prayers') + '</span>',
                    '{PROJECTILE}': '<span class="text-character-bm">' + this.$t('Projectile') + '</span>',
                    '{SATE}': '<span class="text-character-rm">' + this.$t('Sate') + '</span>',
                    '{SATED}': '<span class="text-character-rm">' + this.$t('Sated') + '</span>',
                    '{SCRAP}': '<span class="text-character-qa">' + this.$t('Scrap') + '</span>',
                    '{SHACKLE}': '<span class="text-character-cg">' + this.$t('Shackle') + '</span>',
                    '{SHACKLED}': '<span class="text-character-cg">' + this.$t('Shackled') + '</span>',
                    '{SONG}': '<span class="text-character-ss">' + this.$t('Song') + '</span>',
                    '{SPIRIT}': '<span class="text-character-sp">' + this.$t('Spirit') + '</span>',
                    '{SPIRITS}': '<span class="text-character-sp">' + this.$t('Spirits') + '</span>',
                    '{TIMED}': '<span class="text-character-qa">' + this.$t('Timed') + '</span>',
                    '{VOID}': '<span class="text-character-ho">' + this.$t('Void') + '</span>',
                    '{VOIDSIGHT}': '<span class="text-character-ho">' + this.$t('Voidsight') + '</span>',

                    // Class Ability Icons
                    '{COLONY_ICON}': '<webp src="/img/icons/status/colony.png" width="20" class="inline"/>',
                    '{DEATHSHROUD_SPIDER_ICON}': '<webp src="/img/icons/status/deathshroud.png" width="20" class="inline"/>',
                    '{FIRESPITTER_ANT_ICON}': '<webp src="/img/icons/status/firespitter.png" width="20" class="inline"/>',
                    '{GHOST_SHIMMER_BEE_ICON}': '<webp src="/img/icons/status/ghostshimmer.png" width="20" class="inline"/>',
                    '{VOIDSIGHT_ICON}': '<webp src="/img/icons/status/voidsight.png" width="20" class="inline"/>',
                    '{TIME_ICON}': '<webp src="/img/icons/status/time.png" width="20" class="inline" alt="' + this.$t('Time') + '"/>',
                    '{SHADOW_ICON}': '<webp src="/img/icons/status/shadow.png" width="20" class="inline" alt="' + this.$t('Shadow') + '"/>',
                    '{RANGED_ICON}': '<webp src="/img/icons/status/ranged.png" width="20" class="inline" alt="' + this.$t('Ranged mode') + '"/>',
                    '{MELEE_ICON}': '<webp src="/img/icons/status/melee.png" width="20" class="inline" alt="' + this.$t('Melee mode') + '"/>',
                    '{INFUSION_ICON}': '<webp src="/img/icons/status/infusion.png" width="20" class="inline" alt="' + this.$t('Infusion') + '"/>',
                    '{RESONANCE_ICON}': '<webp src="/img/icons/status/resonance.png" width="20" class="inline" alt="' + this.$t('Resonance') + '"/>',
                    '{TRANSFER_ICON}': '<webp src="/img/icons/status/transfer.png" width="30" class="inline" alt="' + this.$t('Transfer') + '"/>',
                    '{PRESSURE_OVER_ICON}': '<webp src="/img/icons/status/pressure_over.png" width="20" class="inline" alt="' + this.$t('Over pressure') + '"/>',
                    '{PRESSURE_HIGH_ICON}': '<webp src="/img/icons/status/pressure_high.png" width="20" class="inline" alt="' + this.$t('High pressure') + '"/>',
                    '{PRESSURE_LOW_ICON}': '<webp src="/img/icons/status/pressure_low.png" width="20" class="inline" alt="' + this.$t('Low pressure') + '"/>',
                    '{PRESSURE_UP_ICON}': '<webp src="/img/icons/status/pressure_up.png" width="20" class="inline" alt="' + this.$t('Low pressure') + '"/>',
                    '{PRESSURE_DOWN_ICON}': '<webp src="/img/icons/status/pressure_down.png" width="20" class="inline" alt="' + this.$t('Low pressure') + '"/>',
                    '{TROPHY_ICON}': '<webp src="/img/icons/status/trophy.png" width="20" class="inline" alt="' + this.$t('Tide') + '"/>',
                    '{TIDE_ICON}': '<webp src="/img/icons/status/tide.png" width="20" class="inline" alt="' + this.$t('Tide') + '"/>',

                    // Damage Modifiers
                    '{-2_WHITE}': '<webp src="/img/icons/perks/-2_white.png" width="20" class="inline"/>',
                    '{-1_WHITE}': '<webp src="/img/icons/perks/-1_white.png" width="20" class="inline"/>',
                    '{+0_WHITE}': '<webp src="/img/icons/perks/+0_white.png" width="20" class="inline"/>',
                    '{+1_WHITE}': '<webp src="/img/icons/perks/+1_white.png" width="20" class="inline"/>',
                    '{+2_WHITE}': '<webp src="/img/icons/perks/+2_white.png" width="20" class="inline"/>',
                    '{+3_WHITE}': '<webp src="/img/icons/perks/+3_white.png" width="20" class="inline"/>',
                    '{+4_WHITE}': '<webp src="/img/icons/perks/+4_white.png" width="20" class="inline"/>',
                    '{+X_WHITE}': '<webp src="/img/icons/perks/+x_white.png" width="20" class="inline"/>',
                    '{2X_WHITE}': '<webp src="/img/icons/perks/2x_white.png" width="20" class="inline"/>',
                    '{AGAIN}': '<webp src="/img/icons/perks/again_white.png" width="20" class="inline"/>',

                    '{NOTE_115}': '<webp src="/img/notes/note-115.png" width="421"/>',
                    '{NOTE_42}': '<webp src="/img/notes/note-42.png" width="421"/>',
                    '{PAGE}': this.$t('PAGE') + ' <webp src="/img/icons/general/page.png" width="20" class="opacity-80 inline"/>',

                    // Items
                    '{BODY}': '<webp src="/img/icons/equipment/body.png" alt="body" width="20" class="inline"/>',
                    '{HEAD}': '<webp src="/img/icons/equipment/head.png" alt="head" width="20" class="inline"/>',
                    '{LEGS}': '<webp src="/img/icons/equipment/legs.png" alt="legs" width="20" class="inline"/>',
                    '{SMALL-ITEM}': '<webp src="/img/icons/equipment/small-item.png" alt="small-item" width="20" class="inline"/>',
                    '{ONE-HAND}': '<webp src="/img/icons/equipment/one-hand.png" alt="one-hand" width="20" class="inline"/>',
                    '{TWO-HANDS}': '<webp src="/img/icons/equipment/two-hands.png" alt="two-hands" width="20" class="inline"/>',

                    // Resources
                    '{CORPSECAP}': '<inline-svg src="resources/corpsecap"/>',
                    '{ALGOX}': '<inline-svg src="resources/algox"/>',
                    '{ARROWVINE}': '<inline-svg src="resources/arrowvine"/>',
                    '{AXENUT}': '<inline-svg src="resources/axenut"/>',
                    '{FLAMEFRUIT}': '<inline-svg src="resources/flamefruit"/>',
                    '{COINS}': '<inline-svg src="resources/coins"/>',
                    '{GOLD}': '<inline-svg src="resources/gold"/>',
                    '{HIDE}': '<inline-svg src="resources/hide"/>',
                    '{LUMBER}': '<inline-svg src="resources/lumber"/>',
                    '{LURKERS}': '<inline-svg src="resources/lurkers"/>',
                    '{METAL}': '<inline-svg src="resources/metal"/>',
                    '{PROSPERITY}': '<inline-svg src="icons/prosperity"/>',
                    '{TREASURE}': '<inline-svg src="resources/random-item-treasure"/>',
                    '{ROCKROOT}': '<inline-svg src="resources/rockroot"/>',
                    '{SNOWTHISTLE}': '<inline-svg src="resources/snowthistle"/>',
                    '{UNFETTERED}': '<inline-svg src="resources/unfettered"/>',

                    // Buildings
                    '{DOWNTIME}': '<inline-svg src="icons/downtime"/>',
                    '{OPERATIONS}': '<inline-svg src="icons/operations"/>',
                    '{REPAIR}': '<inline-svg src="icons/repair"/>',
                    '{UPGRADE}': '<inline-svg src="icons/upgrade"/>',
                    '{WRECKED}': '<inline-svg src="icons/wrecked"/>',
                    '{BOAT}': '<inline-svg src="icons/boat"/>',
                    '{SLED}': '<inline-svg src="icons/sled"/>',
                    '{CLIMBING_GEAR}': '<inline-svg src="icons/climbing-gear"/>',

                    // Frosthaven (icons only) ability enhancements
                    '{DAMAGE.fh}': '<webp src="/img/icons/general/damage.png" width="20" class="inline" alt="' + this.$t('DAMAGE') + '"/>',
                    '{SHIELD.fh}': '<webp src="/img/icons/general/shield_fh.png" width="20" class="inline" alt="' + this.$t('SHIELD') + '"/>',
                    '{HEAL.fh}': '<webp src="/img/icons/general/heal.png" width="20" class="inline" alt="' + this.$t('HEAL') + '"/>',
                    '{ATTACK.fh}': '<webp src="/img/icons/general/attack.png" width="20" class="inline" alt="' + this.$t('ATTACK') + '"/>',
                    '{RANGE.fh}': '<webp src="/img/icons/general/range_fh.png" width="20" class="inline" alt="' + this.$t('RANGE') + '"/>',
                    '{MOVE.fh}': '<webp src="/img/icons/general/move_fh.png" width="20" class="inline" alt="' + this.$t('MOVE') + '"/>',
                    '{JUMP.fh}': '<webp src="/img/icons/general/jump_fh.png" width="20" class="inline" alt="' + this.$t('JUMP') + '"/>',
                    '{FLYING.fh}': '<webp src="/img/icons/general/flying_fh.png" width="20" class="inline" alt="' + this.$t('FLYING') + '"/>',
                    '{RETALIATE.fh}': '<webp src="/img/icons/general/retaliate.png" width="20" class="inline" alt="' + this.$t('RETALIATE') + '"/>',
                    '{TELEPORT.fh}': '<webp src="/img/icons/general/teleport_fh.png" width="20" class="inline" alt="' + this.$t('TELEPORT') + '"/>',
                    '{TARGET.fh}': '<webp src="/img/icons/general/target.png" width="20" class="inline" alt="' + this.$t('TARGET') + '"/>',
                    
                    '{RECOVER.fh}': '<webp src="/img/icons/general/recover_white.png" width="20" class="inline" alt="' + this.$t('RECOVER') + '"/>',
                    '{REFRESH.fh}': '<webp src="/img/icons/general/refresh_white.png" width="20" class="inline" alt="' + this.$t('REFRESH') + '"/>',
                    '{SPENT.fh}': '<webp src="/img/icons/general/spent_white.png" width="20" class="inline" alt="' + this.$t('SPENT') + '"/>',
                    '{CONSUMED.fh}': '<webp src="/img/icons/general/consumed_white.png" width="20" class="inline" alt="' + this.$t('CONSUMED') + '"/>',
                    '{LOST.fh}': '<webp src="/img/icons/general/lost_white.png" width="20" class="inline" alt="' + this.$t('LOST') + '"/>',

                    // Frosthaven (icons only) conditions
                    '{BANE.fh}': '<webp src="/img/icons/status/bane_fh.png" width="20" class="inline" alt="' + this.$t('BANE') + '"/>',
                    '{BLESS.fh}': '<webp src="/img/icons/status/bless.png" width="20" class="inline" alt="' + this.$t('BLESS') + '"/>',
                    '{BRITTLE.fh}': '<webp src="/img/icons/status/brittle.png" width="20" class="inline" alt="' + this.$t('BRITTLE') + '"/>',
                    '{CURSE.fh}': '<webp src="/img/icons/status/curse.png" width="20" class="inline" alt="' + this.$t('CURSE') + '"/>',
                    '{DISARM.fh}': '<webp src="/img/icons/status/disarm.png" width="20" class="inline" alt="' + this.$t('DISARM') + '"/>',
                    '{IMMOBILIZE.fh}': '<webp src="/img/icons/status/immobilize.png" width="20" class="inline" alt="' + this.$t('IMMOBILIZE') + '"/>',
                    '{IMPAIR.fh}': '<webp src="/img/icons/status/impair.png" width="20" class="inline" alt="' + this.$t('IMPAIR') + '"/>',
                    '{INVISIBLE.fh}': '<webp src="/img/icons/status/invisible.png" width="20" class="inline" alt="' + this.$t('INVISIBLE') + '"/>',
                    '{MUDDLE.fh}': '<webp src="/img/icons/status/muddle.png" width="20" class="inline" alt="' + this.$t('MUDDLE') + '"/>',
                    '{PIERCE.fh}': '<webp src="/img/icons/status/pierce.png" width="20" class="inline" alt="' + this.$t('PIERCE') + '"/>',
                    '{POISON.fh}': '<webp src="/img/icons/status/poison.png" width="20" class="inline" alt="' + this.$t('POISON') + '"/>',
                    '{PULL.fh}': '<webp src="/img/icons/status/pull_fh.png" width="20" class="inline" alt="' + this.$t('PULL') + '"/>',
                    '{PUSH.fh}': '<webp src="/img/icons/status/push_fh.png" width="20" class="inline" alt="' + this.$t('PUSH') + '"/>',
                    '{REGENERATE.fh}': '<webp src="/img/icons/status/regenerate.png" width="20" class="inline" alt="' + this.$t('REGENERATE') + '"/>',
                    '{STRENGTHEN.fh}': '<webp src="/img/icons/status/strengthen.png" width="20" class="inline" alt="' + this.$t('STRENGTHEN') + '"/>',
                    '{STUN.fh}': '<webp src="/img/icons/status/stun.png" width="20" class="inline" alt="' + this.$t('STUN') + '"/>',
                    '{WARD.fh}': '<webp src="/img/icons/status/ward_fh.png" width="20" class="inline" alt="' + this.$t('WARD') + '"/>',
                    '{WOUND.fh}': '<webp src="/img/icons/status/wound_fh.png" width="20" class="inline" alt="' + this.$t('WOUND') + '"/>',

                    // TODO: Replace these with coloured icons instead of using the perk icons, as per the Frosthaven item cards
                    '{-1_MODIFIER}': '<webp src="/img/icons/perks/-1_white.png" width="20" class="inline" alt="-1"/>',
                    '{+0_MODIFIER}': '<webp src="/img/icons/perks/+0_white.png" width="20" class="inline" alt="+0"/>',
                    '{+1_MODIFIER}': '<webp src="/img/icons/perks/+1_white.png" width="20" class="inline" alt="+1"/>',
                    '{+2_MODIFIER}': '<webp src="/img/icons/perks/+2_white.png" width="20" class="inline" alt="+2"/>',
                    '{2X_MODIFIER}': '<webp src="/img/icons/perks/2x_white.png" width="20" class="inline" alt="2x"/>',
                    '{NULL_MODIFIER}': '<webp src="/img/icons/perks/null_white.png" width="20" class="inline" alt="0x"/>',

                    // Bonuses
                    '{CHECK}': '<webp src="/img/icons/general/check.png" width="20" class="inline" alt="' + this.$t('check mark') + '"/>',
                    '{ROUND}': '<webp src="/img/icons/general/eot_white.png" width="20" class="inline" alt="' + this.$t('Round bonus') + '"/>',
                    '{PERSISTENT}': '<webp src="/img/icons/general/ongoing_white.png" width="20" class="inline" alt="' + this.$t('Persistent bonus') + '"/>',
                    '{ITEM}': '<webp src="/img/icons/general/item.png" width="10" class="inline" alt="' + this.$t('Item') + '"/>',

                }).each((icon, key) => {
                    text = text.replaceAll(key, icon);
                });
            }

            return text;
        }
    }
}
</script>
