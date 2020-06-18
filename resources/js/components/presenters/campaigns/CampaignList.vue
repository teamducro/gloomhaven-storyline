<template>
    <ul class="mdc-list">
        <li class="mdc-list-item" tabindex="0"
            @click="select('local')"
            :class="{'mdc-ripple-upgraded--background-focused': campaignId === 'local'}">
            <span class="inline-block w-full flex flex-col md:flex-row items-center justify-between mdc-list-item__text">
                {{ $t('local') }}
            </span>
        </li>
        <li v-for="story in stories.items" class="mdc-list-item h-auto" tabindex="0"
            @click="select(story.campaignId)"
            :class="{'mdc-ripple-upgraded--background-focused': campaignId === story.campaignId}">
            <span class="inline-block w-full flex flex-col md:flex-row items-center justify-between mdc-list-item__text z-1">
                <span>{{ story.name }}</span>
                <span class="mt-2 md:mt-0">
                    <template v-if="story.has_expired">
                        <bedge class="mr-4" expired>{{ $t('Expired') }}</bedge>
                        <button class="mr-4 mdc-button mdc-button--raised my-2">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">replay</i>
                            {{ $t('Renew') }}
                        </button>
                    </template>
                    <template v-else>
                        <bedge class="mr-4">{{ story.expires_at.format("MMM Do YY") }}</bedge>
                        <button type="button" class="mdc-button mdc-button--raised my-2"
                                @click="share($event, story)">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">share</i>
                            {{ $t('Share') }}
                        </button>
                    </template>
                </span>
            </span>
        </li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                stories: collect(),
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
            share(e, story) {
                e.stopPropagation();
                this.$bus.$emit('open-share-campaign-code-modal', story);
            }
        }
    }
</script>
