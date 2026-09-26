<template>
    <img :src="'/svg/icons/enhancements/' + svgName + '.svg'" :alt="type"
         class="enhancement-icon" :style="{width: size + 'px', height: size + 'px'}"/>
</template>

<script>

const svgIcons = {
    move: 'move',
    attack: 'attack',
    range: 'range',
    shield: 'shield',
    push: 'push',
    pull: 'pull',
    pierce: 'pierce',
    retaliate: 'retaliate',
    heal: 'heal',
    target: 'target',
    teleport: 'teleport',
    summon_move: 'move',
    summon_attack: 'attack',
    summon_range: 'range',
    summon_hp: 'hp',
    regenerate: 'regenerate',
    ward: 'ward',
    poison: 'poison',
    wound: 'wound',
    muddle: 'muddle',
    immobilize: 'immobilize',
    disarm: 'disarm',
    curse: 'curse',
    strengthen: 'strengthen',
    bless: 'bless',
    jump: 'jump',
    fire: 'fire',
    ice: 'ice',
    air: 'air',
    earth: 'earth',
    light: 'light',
    dark: 'dark',
    wild_element: 'wild',
    attack_hex: 'hex',
};

export default {
    props: {
        type: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            default: 20
        }
    },
    computed: {
        svgName() {
            return svgIcons[this.type];
        }
    }
}
</script>
