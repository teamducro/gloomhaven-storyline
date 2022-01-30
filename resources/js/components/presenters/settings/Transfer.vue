<template>
    <div id="copy"
         class="bg-black2-25 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
        <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left">
            {{ $t('transfer.title') }}
        </h1>

        <p class="text-base">
            {{ $t('transfer.text') }}
        </p>

        <alert v-if="campaignId && !hasMultipleStories" type="warning">
            {{ $t('transfer.warning.text') }}<br>
            <router-link to="/campaigns" class="link">{{ $t('Please consider purchasing a license') }}.</router-link>
            <div class="mt-2">{{ $t('Alternatively you may') }}
                <a @click.stop="$bus.$emit('open-share-modal')" class="link">{{ $t('share') }}</a>
                {{ $t('a campaign link') }}.
            </div>
        </alert>

        <template v-if="hasMultipleStories">
            <div class="mt-4 flex flex-col md:flex-row md:items-center w-full">
                <div class="my-4 md:mr-4 md:my-0">
                    <campaign-switch ref="campaign-switch" :with-transparency="false"></campaign-switch>
                </div>
                <span class="material-icons">forward</span>
                <div class="mt-4 md:mx-4 md:mt-1">
                    <div class="copy-switch mdc-select w-full">
                        <div class="mdc-select__anchor w-full">
                            <i class="mdc-select__dropdown-icon"></i>
                            <div class="mdc-select__selected-text"></div>
                            <span class="mdc-floating-label mdc-floating-label--float-above">
                                {{ $t('Transfer to') }}
                            </span>
                            <div class="mdc-line-ripple"></div>
                        </div>

                        <div class="mdc-select__menu mdc-menu mdc-menu-surface overflow-visible"
                             style="min-width: 240px">
                            <ul class="mdc-list">
                                <li class="mdc-list-item cursor-pointer whitespace-nowrap"
                                    data-value="local">
                                    {{ $t('local') }}
                                    <span class="ml-4 mt-1 cloud-off"></span>
                                </li>
                                <li v-for="(story) in stories.items"
                                    :key="story.campaignId" :data-value="story.campaignId"
                                    class="mdc-list-item cursor-pointer whitespace-nowrap flex items-center">
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
        </template>
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
            hasMultipleStories: null,
            storyRepository: new StoryRepository,
        }
    },
    mounted() {
        this.setStories();
        this.$bus.$on('campaigns-changed', this.setStories);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.setStories);
    },
    methods: {
        async setStories() {
            this.story = this.storyRepository.current();
            this.campaignId = app.campaignId;
            this.stories = app.stories;
            this.hasMultipleStories = app.stories.count() > 0;

            await this.$nextTick();

            if (this.hasMultipleStories) {
                this.$refs['campaign-switch'].applyData();

                if (!this.select) {
                    this.select = new MDCSelect(c('.copy-switch')[0]);
                }
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
