<template>
    <div v-if="sheet" class="text-white2-87">
        <h2 class="mb-2">{{ $t('Enhance abilities') }}</h2>
        <p v-if="!characters.length">{{ $t('No characters in the party') }}</p>
        <ul class="space-y-1">
            <li v-for="character in characters" :key="character.uuid">
                <a href="#" @click.prevent="enhance(character)"
                   class="enhancer-character flex items-center rounded-md p-2 hover:bg-black2-50">
                    <character-icon class="flex-shrink-0 w-5 mr-2" :character="character.id"/>
                    {{ character.name === character.characterName ? $t(character.characterName) : character.name }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import SheetRepository from "../../repositories/SheetRepository";
import StorySyncer from "../../services/StorySyncer";

export default {
    inject: ['appData'],
    data() {
        return {
            sheet: null,
            sheetRepository: new SheetRepository,
            storySyncer: new StorySyncer,
        }
    },
    mounted() {
        this.sheet = this.sheetRepository.make(this.appData.game);
    },
    computed: {
        characters() {
            return Object.values(this.sheet.characters)
                .filter(character => character.hasAbilities)
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        }
    },
    methods: {
        enhance(character) {
            if (!this.appData.read_only && !this.sheet.enhancementsEnabled) {
                this.sheet.enhancementsEnabled = true;
                this.sheet.store();
                this.storySyncer.store();
            }

            this.$bus.$emit('close-building-card');
            this.$router.push({path: '/characters', query: {abilities: character.uuid}});
        }
    }
}
</script>
