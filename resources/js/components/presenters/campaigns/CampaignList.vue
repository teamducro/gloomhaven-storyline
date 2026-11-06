<template>
    <div>
        <ul class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <li class="col-span-full bg-dark-background rounded-lg shadow-sm divide-y divide-gray-500">
                <div class="w-full flex items-center justify-between p-6 space-x-6"
                     @click="select('local')">
                    <div class="flex-1">
                        <div class="flex items-center w-full">
                            <span class="material-icons mr-2">
                                {{ campaignId === 'local' ? 'radio_button_checked' : 'radio_button_unchecked' }}
                            </span>
                            <h3 class="text-white text-sm font-medium truncate">{{ $t('local') }}</h3>
                            <span class="material-icons ml-auto">cloud_off</span>
                        </div>
                        <p class="flex-1 mt-2 text-sm text-white2-75">
                            {{ $t('campaign page.local desc') }}
                        </p>
                    </div>
                </div>
                <div>
                    <div class="-mt-px flex divide-x divide-gray-500 overflow-hidden rounded-b-lg bg-primary2-20">
                        <div class="-ml-px w-0 flex-1 flex">
                            <a href="#" @click.prevent="$bus.$emit('open-share-modal')"
                               class="relative mt-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-white font-medium border border-transparent hover:bg-primary2-30">
                                <span class="material-icons">share</span>
                                <span class="ml-2 sm:ml-3">{{ $t('Share') }}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </li>

            <li v-for="story in stories.items" :key="story.id"
                class="col-span-1 bg-dark-background rounded-lg shadow-sm divide-y divide-gray-500">
                <div class="w-full flex items-center justify-between p-6 space-x-6"
                     @click="select(story.campaignId)">
                    <div class="flex-1 truncate">
                        <div class="flex items-center">
                            <span class="material-icons mr-2">
                                {{ isSelected(story) ? 'radio_button_checked' : 'radio_button_unchecked' }}
                            </span>
                            <h3 class="text-white text-sm font-medium truncate">{{ story.name }}</h3>
                            <span class="ml-auto material-icons" :class="{outlined: !story.has_expired}">
                                {{ story.has_expired ? 'cloud_off' : 'cloud' }}
                            </span>
                        </div>
                        <div v-if="showPurchaseButton" class="flex items-center">
                            <campaign-badge class="mt-3" :story="story"></campaign-badge>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="-mt-px flex divide-x divide-gray-500 overflow-hidden rounded-b-lg bg-primary2-20">
                        <div v-if="!story.has_expired && !story.is_shared" class="w-0 flex-1 flex">
                            <a href="#" @click.prevent="$bus.$emit('open-edit-campaign-modal', story)"
                               class="relative mt-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-white font-medium border border-transparent hover:bg-primary2-30">
                                <span class="material-icons">settings</span>
                                <span class="ml-2 sm:ml-3">{{ $t('Edit') }}</span>
                            </a>
                        </div>
                        <div v-if="!story.has_expired && !story.is_shared" class="mt-px w-0 flex-1 flex">
                            <a href="#" @click.prevent="share(story)"
                               class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-white font-medium border border-transparent hover:bg-primary2-30">
                                <span class="material-icons">share</span>
                                <span class="ml-2 sm:ml-3">{{ $t('Share') }}</span>
                            </a>
                        </div>
                        <div v-if="story.is_shared" class="mt-px w-0 flex-1 flex">
                            <a href="#" @click.prevent="unlink(story)"
                               class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-white font-medium border border-transparent hover:bg-primary2-30">
                                <span class=" material-icons">link_off</span>
                                <span class="ml-2 sm:ml-3">{{ $t('Unlink') }}</span>
                            </a>
                        </div>
                        <div v-if="canDelete(story)" class="mt-px w-0 flex-1 flex">
                            <a href="#" @click.prevent="confirmDelete(story)" data-test="delete-campaign"
                               class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-white font-medium border border-transparent hover:bg-primary2-30">
                                <span class="material-icons">delete_forever</span>
                                <span class="ml-2 sm:ml-3">{{ $t('Delete permanently') }}</span>
                            </a>
                        </div>
                        <purchase v-if="!story.is_shared && showPurchaseButton"
                                  :story-id="story.id" class="mt-px w-0 flex-1 flex">
                            <a class="cursor-pointer relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-white font-medium border border-transparent hover:bg-primary2-30">
                                <template v-if="story.has_expired || story.expires_soon">
                                    <span class="material-icons">replay</span>
                                    <span class="ml-2 sm:ml-3">{{ $t('Renew') }}</span>
                                </template>
                                <template v-else>
                                    <span class="material-icons">refresh</span>
                                    <span class="ml-2 sm:ml-3">{{ $t('Extend') }}</span>
                                </template>
                            </a>
                        </purchase>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import StoryRepository from "../../../repositories/StoryRepository";
import ApiStoryRepository from "../../../apiRepositories/StoryRepository";
import Confirm from "../../../mixins/Confirm";

export default {
    mixins: [Confirm],
    props: {
        user: {
            type: Object
        }
    },
    data() {
        return {
            stories: collect(),
            campaignId: 'local',
            storyRepository: new StoryRepository,
            apiStoryRepository: new ApiStoryRepository
        }
    },
    beforeMount() {
        this.applyData();
    },
    mounted() {
        this.$bus.$on('campaigns-changed', this.applyData);
    },
    unmounted() {
        this.$bus.$off('campaigns-changed', this.applyData);
    },
    computed: {
        showPurchaseButton() {
            return !this.user || !this.user.is_patron;
        }
    },
    methods: {
        applyData() {
            this.stories = app.stories.sortBy('name');
            this.campaignId = app.campaignId;
        },
        select(campaignId) {
            this.$bus.$emit('campaign-selected', campaignId);

            let name = (campaignId === 'local')
                ? this.$t('local')
                : this.storyRepository.find(campaignId).name;

            this.$bus.$emit('toast', `"${name}" selected!`);
        },
        isSelected(story) {
            return story.campaignId === this.campaignId;
        },
        share(story) {
            this.$bus.$emit('open-share-campaign-code-modal', story);
        },
        unlink(story) {
            this.apiStoryRepository.remove(story);
            this.select(this.isSelected(story) ? 'local' : this.campaignId);
        },
        canDelete(story) {
            return !!this.user && this.user.is_patron && !story.is_shared;
        },
        confirmDelete(story) {
            this.confirm(
                this.$t('Delete permanently'),
                this.$t('delete-campaign-confirm', {name: story.name}),
                () => this.destroy(story),
                this.$t('delete-campaign-note')
            );
        },
        async destroy(story) {
            try {
                await this.apiStoryRepository.destroy(story);
            } catch (e) {
                this.$bus.$emit('toast', this.$t('delete-campaign-failed'), false);
                return;
            }
            this.select(this.isSelected(story) ? 'local' : this.campaignId);
        }
    }
}
</script>
