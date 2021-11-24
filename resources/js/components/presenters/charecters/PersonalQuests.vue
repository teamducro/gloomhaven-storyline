<template>
    <div class="mb-4">

        <div class="mb-2 flex items-center">
            <h2>{{ $t('Personal Quest') }}</h2>
        </div>

        <autocomplete v-if="!quest.id" :label="$t('Search name or nr')"
                      id="personal-quests"
                      :list="Object.keys(quests)"
                      :filter-closure="questFilterClosure"
                      :auto-close="true"
                      @change="(id) => {select(id)}"
        >
            <template v-for="(quest, id) in quests" v-slot:[id]>
                {{ quest.title }}
            </template>
        </autocomplete>

        <div v-if="quest.id" class="flex justify-between">
            <div class="flex flex-col">
                <h3>{{ quest.title }}</h3>

                <div v-for="(part, partIndex) in quest.progress">
                    <p class="mt-4">{{ part.name }}</p>
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

                <div>
                    <button @click.prevent="remove" type="button"
                            class="my-4 mdc-button mdc-button--raised">
                        <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                        <span class="mdc-button__label">{{ $t('Remove') + ' ' + quest.number }}</span>
                    </button>
                </div>
            </div>

            <div @click="openCard" class="cursor-pointer w-12">
                <webp :src="quest.card.images[1]" :alt="quest.name"/>
            </div>
        </div>

    </div>
</template>

<script>
import PersonalQuestRepository from "../../../repositories/PersonalQuestRepository";

export default {
    props: {
        quest: Object,
        game: String
    },
    data() {
        return {
            quests: collect(),
            personalQuestRepository: new PersonalQuestRepository
        }
    },
    mounted() {
        this.quests = this.personalQuestRepository.fetch(this.game).keyBy('id').items;
        console.log('loaded');
        console.log(this.quest.progress);
    },
    computed: {},
    methods: {
        select(questId) {
            const quest = this.quests[questId];
            this.update(quest);
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
            const quest = _.clone(this.quest);
            quest.progress[partIndex].value[valueIndex] = isChecked;

            this.update(quest);
        },
        changedNumberProgress(partIndex, value) {
            const quest = _.clone(this.quest);
            quest.progress[partIndex].value = value;

            this.update(quest);
        },
        openCard() {
            this.$bus.$emit('open-default-card', this.quest.card);
        },

        questFilterClosure(query) {
            // This allows to find items based on id and it's name.
            return (id) => {
                return id.toLowerCase().startsWith(query)
                    || this.quests[id].name.toLowerCase().replace('-', ' ').startsWith(query);
            }
        },
    }
}
</script>
