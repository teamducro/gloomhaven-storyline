<template>
    <div class="absolute right-0 top-0 mt-14 sm:mt-4 mr-4 z-5">
        <dropdown class="items-to-add-dropdown" align="right" ref="add-character"
                  @open="dropDownClose = true"
                  @close="dropDownClose = false">
            <template v-slot:trigger>
                <button type="button"
                        class="mdc-icon-button mdc-button--raised material-icons p-2 mr-2 mt-2 !bg-black2-50 rounded-full transform transition-transform"
                        :class="{'rotate-45': dropDownClose}">
                    add
                </button>
            </template>

            <div class="w-full">
                <h2>{{ $t('Add Character') }}</h2>
                <ul class="flex flex-col py-4 px-3">
                    <li v-for="(unlocked, id) in sheet.characterUnlocks" :key="id" v-if="unlocked"
                        class="add-character flow-root"
                        :class="['order-'+sheet.characterOrder[id], sheet.characterOrder[id] === 0 ? 'mt-0' : 'mt-6']">
                        <a @click.stop.prevent="$emit('create', id)" href="#"
                           class="-m-3 p-3 flex items-center rounded-md text-base font-medium text-white hover:bg-black2-75 transition ease-in-out duration-150"
                           :class="{'text-white2-50 grayscale cursor-default': characterRepository.partyHasCharacter(sheet, id)}">
                            <character-icon class="flex-shrink-0 w-5 mr-2" :character="id"/>
                            <span>{{ characterNames[id] }}</span>
                        </a>
                    </li>
                </ul>
                <h2 v-if="hasLocked">{{ $t('Locked') }}</h2>
                <ul v-if="hasLocked" class="flex flex-wrap mx-1 py-2">
                    <li v-for="(unlocked, id) in sheet.characterUnlocks" :key="id" v-if="!unlocked" class="flow-root"
                        :class="'order-'+sheet.characterOrder[id]">
                        <a @click.stop.prevent="$emit('create', id)" href="#" class="block w-5 m-1">
                            <character-icon class="flex-shrink-0 w-5" :character="id"/>
                        </a>
                    </li>
                </ul>
            </div>
        </dropdown>
    </div>
</template>

<script>
import GameData from "../../../services/GameData";
import CharacterRepository from "../../../repositories/CharacterRepository";

export default {
    props: {
        sheet: Object
    },
    data() {
        return {
            characterNames: {},
            dropDownClose: false,
            gameData: new GameData,
            characterRepository: new CharacterRepository
        }
    },
    computed: {
        hasLocked() {
            const all = collect(this.sheet.characterUnlocks).count();
            return all > collect(this.sheet.characterUnlocks).filter().count();
        }
    },
    mounted() {
        this.render();

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    methods: {
        render() {
            this.characterNames = this.gameData.characterNames(app.game);
        },
        open() {
            this.$refs['add-character'].open()
        }
    }
}
</script>

<style scoped lang="scss">
.add-character.order-0 {
    @apply mt-0;
}
</style>
