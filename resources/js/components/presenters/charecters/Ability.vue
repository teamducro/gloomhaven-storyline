<template>
    <div class="relative m-2" :class="[stacked ? 'h-6' :'']" @click="click">
        <webp :src="ability.image"
              class="rounded w-40 hover:cursor-pointer hover:shadow-white"/>
        <div v-if="!stacked" class="absolute bottom-0 left-0 pt-2 pr-2 rounded-tr-full bg-dark-gray2-100">
            <checkbox :checked="selected" @change="changed" :group="group" :id="group+'-'+ability.code"/>
        </div>
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
        stacked: {
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
            this.$emit('click', this.group, this.ability.code);
        }
    }
}
</script>

<style lang="scss">

</style>
