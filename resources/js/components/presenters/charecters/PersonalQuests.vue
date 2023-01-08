<template>
    <div v-if="quests && Object.keys(quests).length" class="mb-4">

        <div class="mb-2 flex items-center">
            <h2>{{ $t('Personal Quest') }}</h2>
        </div>

        <div v-if="!quest.id" class="flex items-center">
            <autocomplete :label="$t('Search name or nr')"
                          id="personal-quests"
                          :list="Object.keys(quests)"
                          :disabled="unavailableQuests"
                          :filter-closure="questFilterClosure"
                          :auto-close="true"
                          @change="(id) => {select(id)}"
            >
                <template v-for="(quest, id) in quests" v-slot:[id]>
                    {{ quest.number }} {{ $t(quest.name) }}
                </template>
            </autocomplete>

            <div class="mx-4">{{ $t('or') }}</div>

            <button @click="random" :disabled="appData.read_only" class="mdc-button origin-left transform scale-90 mdc-button--raised">
                <i class="material-icons mdc-button__icon">launch</i>
                <span class="mdc-button__label">{{ $t('Draw') }}</span>
            </button>
        </div>

        <div v-if="quest.id" class="flex justify-between">
            <div class="flex flex-col">
                <h3 class="mt-2">{{ quest.number }} {{ $t(quest.name) }}</h3>

                <div v-for="(part, partIndex) in quest.progress">
                    <add-links-and-icons class="mt-2 children-inline"
                                         :text="$t(quest.translatedProgress+'.'+partIndex)"/>
                    <div v-if="part.type === 'checkbox'">
                        <checkbox v-for="(checked, valueIndex) in part.value" :key="'pq-'+partIndex+'-'+valueIndex"
                                  :group="'pq-'+partIndex"
                                  :id="'pq-'+partIndex+'-'+valueIndex"
                                  :checked="!!checked"
                                  @change="(id, isChecked) => {changedCheckboxProgress(partIndex, valueIndex, isChecked)}"></checkbox>
                    </div>
                    <div v-if="part.type === 'number'">
                        <number-field :value="part.value" :min="0" :id="'pq-'+partIndex"
                                      @change="(value) => {changedNumberProgress(partIndex, value)}"></number-field>
                    </div>
                </div>

                <div v-if="goalMet" class="mt-2">
                    <p v-if="quest.character_unlock">
                        {{ $t('Unlocked') }}:
                        <character-icon class="w-6 -mb-2 inline-block" :character="quest.character_unlock"/>
                    </p>
                    <p v-else-if="quest.unlock">
                        {{ $t('quest.unlock') }}
                    </p>
                </div>

                <div>
                    <button @click.prevent="remove" type="button"
                            class="my-4 mdc-button mdc-button--raised">
                        <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                        <span class="mdc-button__label">{{ $t('Remove') + ' ' + quest.number }}</span>
                    </button>
                </div>
            </div>

            <div @click="openCard" class="cursor-pointer w-12">
                <webp :src="quest.card.images[1]" :alt="$t(quest.name)"/>
            </div>
        </div>

    </div>
</template>

<script>
import PersonalQuestRepository from "../../../repositories/PersonalQuestRepository";
import PersonalQuestValidator from "../../../validators/PersonalQuestValidator";
import Helpers from "../../../services/Helpers";

export default {
    inject: ['appData'],
    props: {
        quest: Object,
        sheet: Object
    },
    data() {
        return {
            quests: null,
            goalMet: false,
            personalQuestRepository: new PersonalQuestRepository,
            personalQuestValidator: new PersonalQuestValidator
        }
    },
    mounted() {
        this.quests = this.personalQuestRepository.fetch(this.sheet.game).keyBy('id').items;
        if (this.quest.id) {
            this.validate();
        }
    },
    computed: {
        unavailableQuests() {
            let unavailable = [];
            Object.entries(this.sheet.characters).forEach(([id, character]) => {
                if (character.quest?.id) {
                    unavailable.push(character.quest?.id);
                }
            });

            return unavailable;
        }
    },
    methods: {
        random() {
            const id = [...Object.keys(this.quests)]
                .filter(id => !this.unavailableQuests.includes(parseInt(id)))
                .sort((a, b) => 0.5 - Math.random())[0];
            const quest = this.quests[id];
            this.update(quest);
            this.goalMet = false;
        },
        select(questId) {
            const quest = this.quests[questId];
            this.update(quest);
            this.goalMet = false;
        },
        remove() {
            this.$emit('update:quest', {});
            this.$emit('change', {});
        },
        update(quest) {
            this.$emit('update:quest', quest);
            this.$emit('change', quest);
        },
        changedCheckboxProgress(partIndex, valueIndex, isChecked) {
            this.quest.progress[partIndex].value[valueIndex] = isChecked;

            this.validate();
            this.update(this.quest);
        },
        changedNumberProgress(partIndex, value) {
            this.quest.progress[partIndex].value = value;

            this.validate();
            this.update(this.quest);
        },
        validate() {
            this.goalMet = this.personalQuestValidator.validate(this.quest, this.sheet);
        },
        openCard() {
            this.$bus.$emit('open-default-card', this.quest.card);
        },

        questFilterClosure(query) {
            // This allows to find personal quests based on id or their name.
            return (id) => {
                return id.toLowerCase().startsWith(query)
                    || Helpers.sanitize(this.quests[id]._name).startsWith(query);
            }
        },
    }
}
</script>

<style lang="scss">
.children-inline > img {
    @apply inline;
}
</style>
