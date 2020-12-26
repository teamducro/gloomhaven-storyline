<template>
    <div v-if="stories.count() > 1" id="copy"
         class="bg-black2-25 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
        <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left">
            Transfer campaign data
        </h1>
        <p class="text-base">
            Copy campaign data between campaigns.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row sm:items-center w-full">
            <div class="mr-4">
                {{ $t('Transfer') }}
                {{ campaignId === 'local' ? $t('local') : story.name }}
                {{ $t('to') }}
            </div>
            <div class="mt-4 sm:mr-4 sm:mt-0">
                <div class="copy-switch mdc-select w-full">
                    <div class="mdc-select__anchor w-full">
                        <i class="mdc-select__dropdown-icon"></i>
                        <div class="mdc-select__selected-text"></div>
                        <span class="mdc-floating-label mdc-floating-label--float-above">{{
                                $t('Transfer to')
                            }}</span>
                        <div class="mdc-line-ripple"></div>
                    </div>

                    <div class="mdc-select__menu mdc-menu mdc-menu-surface overflow-visible"
                         style="min-width: 240px">
                        <ul class="mdc-list">
                            <li class="mdc-list-item cursor-pointer whitespace-no-wrap"
                                data-value="local">
                                {{ $t('local') }}
                                <span class="ml-4 mt-1 cloud-off"></span>
                            </li>
                            <li v-for="(story) in stories.items"
                                :key="story.campaignId" :data-value="story.campaignId"
                                class="mdc-list-item cursor-pointer whitespace-no-wrap flex items-center">
                                {{ story.name }}
                                <span class="ml-4 mt-1 cloud-on"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <button @click.stop="transfer" type="button" class="mt-4 mb-6 mdc-button mdc-button--raised">
                    <i class="material-icons mdc-button__icon" aria-hidden="true">content_copy</i>
                    <span class="mdc-button__label">{{ $t('Transfer') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {MDCSelect} from "@material/select/component";
import StoryRepository from "../../../repositories/StoryRepository";

export default {
    props: {},
    data() {
        return {
            stories: collect(),
            campaignId: null,
            story: null,
            select: null,
            storyRepository: new StoryRepository
        }
    },
    mounted() {
        this.$bus.$on('campaigns-changed', this.setStories);
        this.setStories();
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.setStories);
    },
    methods: {
        async setStories() {
            this.story = this.storyRepository.current();
            this.campaignId = app.campaignId;
            this.stories = app.stories;

            await this.$nextTick();

            if (!this.select && $('.copy-switch').length) {
                this.select = new MDCSelect($('.copy-switch')[0]);
            }
        },
        async transfer() {
            if (this.select.value === '' || this.campaignId === this.select.value) {
                return;
            }

            this.$bus.$emit('open-transfer-modal', this.select.value);
        }
    }
}
</script>
