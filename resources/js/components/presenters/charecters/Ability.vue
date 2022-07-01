<template>
    <div class="relative ability-card hover:cursor-pointer hover:shadow-white"
         :class="[stacked ? 'aspect-stacked-card' :'', group]"
         @click="click">
        <webp :src="ability.image" :class="[stacked ? 'absolute' : '']"
              class="rounded w-full aspect-card"/>
        <transition name="fadein">
            <div v-if="!animating && active" class="absolute bg-dark-gray2-75" @click.stop=""
                 :class="[stacked ? 'left-0 h-full flex items-center' : 'bottom-0 left-0 pt-2 pr-2 rounded-tr-full']">
                <checkbox :checked="selected" @change="changed" :group="group" :id="group+'-'+ability.code"/>
            </div>
        </transition>
        <transition name="fadein">
            <div v-if="!animating && stacked"
                 class="absolute w-7 bg-dark-gray2-75 right-0 h-full flex items-center px-2">
                <strong class="font-title">{{ ability.initiative }}</strong>
            </div>
        </transition>
    </div>
</template>

<script>
import Ability from "../../../models/Ability";
import Checkbox from "../../elements/Checkbox";

export default {
    components: {Checkbox},
    props: {
        group: String,
        ability: Ability,
        selected: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        },
        stacked: {
            type: Boolean,
            default: false
        },
        animating: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {}
    },
    mounted() {

    },
    computed: {},
    methods: {
        changed(id, checked) {
            this.$emit('selected', this.ability.code, checked);
        },
        click() {
            this.$emit('click', this.group, this.ability);
        }
    }
}
</script>

<style lang="scss">

</style>
