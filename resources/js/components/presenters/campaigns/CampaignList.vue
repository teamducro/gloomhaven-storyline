<template>
    <ul class="mdc-list">
        <li v-if="stories.isEmpty()" class="mdc-list-item min-h-14" tabindex="0"
            @click="select('local')"
            :class="{'mdc-ripple-upgraded--background-focused': campaignId === 'local'}">
            <div class="flex items-center">
                <span class="material-icons mr-2">{{ campaignId === 'local' ? 'radio_button_checked' : 'radio_button_unchecked' }}</span>
                <span class="inline-block w-full flex items-center justify-between mdc-list-item__text">
                    {{ $t('local') }}
                </span>
                <span class="material-icons ml-4">cloud_off</span>
            </div>
        </li>
        <li v-for="story in stories.items" :key="story.id"
            class="mdc-list-item min-h-14" tabindex="0"
            @click="select(story.campaignId)"
            :class="{'mdc-ripple-upgraded--background-focused': isSelected(story)}">
            <div class="inline-block w-full flex items-center justify-between mdc-list-item__text">
                <div class="flex items-center">
                    <span class="material-icons mr-2">{{ isSelected(story) ? 'radio_button_checked' : 'radio_button_unchecked' }}</span>
                    <div class="flex items-center">
                        <change-campaign-name :story="story"
                                              :editing="editing[story.id] || false"
                        ></change-campaign-name>
                        <span class="ml-4 material-icons">cloud_queue</span>
                    </div>
                </div>
                <div class="mt-2 md:mt-0">
                    <template v-if="story.has_expired">
                        <bedge class="mr-4">{{ story.expires_at.format("MMM Do YY") }}</bedge>
                        <bedge class="mr-4" expired>{{ $t('Expired') }}</bedge>
                        <purchase v-if="!story.is_shared" :story-id="story.id" class="inline">
                            <button class="mr-4 mdc-button mdc-button--raised my-2">
                                <i class="material-icons mdc-button__icon" aria-hidden="true">replay</i>
                                {{ $t('Renew') }}
                            </button>
                        </purchase>
                    </template>
                    <template v-else-if="!story.is_shared">
                        <button type="button" class="mdc-button mdc-button--raised mdc-button--circle my-2 mr-2"
                                @click="editing[story.id] = !editing[story.id];">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">
                                {{ editing[story.id] ? 'done' : 'edit' }}
                            </i>
                        </button>
                        <button type="button" class="mdc-button mdc-button--raised mdc-button--circle my-2"
                                @click.stop="share(story)">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">share</i>
                        </button>
                    </template>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                stories: collect(),
                editing: {},
                campaignId: 'local'
            }
        },
        beforeMount() {
            this.applyData();
        },
        mounted() {
            this.$bus.$on('campaigns-changed', this.applyData);
        },
        destroyed() {
            this.$bus.$off('campaigns-changed', this.applyData);
        },
        methods: {
            applyData() {
                this.stories = app.stories;
                this.campaignId = app.campaignId;
            },
            select(campaignId) {
                this.$bus.$emit('campaign-selected', campaignId);
            },
            isSelected(story) {
                return story.campaignId === this.campaignId;
            },
            share(story) {
                this.$bus.$emit('open-share-campaign-code-modal', story);
            }
        }
    }
</script>
