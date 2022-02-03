<template>
    <div id="snapshots" class="bg-black2-25 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
        <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
            <i class="material-icons mr-4" aria-hidden="true">restore</i>
            {{ $t('snapshots.title') }}
        </h1>
        <p class="text-base">
            {{ $t('snapshots.text-1') }}
        </p>

        <alert v-if="campaignId === 'local'" type="warning">
            {{ $t('snapshots.text-2') }}<br>
            <router-link to="/campaigns" class="link">{{ $t('Please consider purchasing a license') }}.</router-link>
        </alert>

        <alert v-if="story && story.is_shared" type="warning">
            {{ $t('snapshots.only-owner') }}.
        </alert>

        <template v-if="story && !story.is_shared">
            <button @click.stop="takeSnapshot" type="button" class="mt-4 mb-6 mdc-button mdc-button--raised">
                <i class="material-icons mdc-button__icon" aria-hidden="true"
                   :class="{'animate-spin': takingSnapshot}">restore</i>
                <span class="mdc-button__label">{{ $t('Create snapshot') }}</span>
            </button>

            <p class="text-base mt-2" v-if="story.snapshots.isEmpty()">
                {{ $t('snapshots.no-snapshots') }}.
            </p>

            <ul class="mdc-list mdc-list--non-interactive">
                <li v-for="snapshot in story.snapshots.items" :key="snapshot.id"
                    class="mdc-list-item min-h-14" tabindex="0"
                    :class="{'bg-black2-25': snapshot.isCurrent(story)}">
                    <div class="w-full flex items-center justify-between mdc-list-item__text">
                        <div class="flex items-center" style="max-width:calc(100% - 120px)">
                            <span class="truncate">{{ snapshot.name }}</span>
                        </div>
                        <div class="mt-2 md:mt-0">
                                <span class="mr-2">
                                    <span>{{ snapshot.created_at.format('ll') }}</span><span
                                    class="hidden sm:inline">, {{ snapshot.created_at.format('hh:mm a') }}
                                    </span>
                                </span>
                            <button type="button" class="mdc-button mdc-button--raised mdc-button--circle my-2"
                                    @click.stop="restore(snapshot)">
                                <i class="material-icons mdc-button__icon" aria-hidden="true"
                                   :class="{'animate-spin': restoringSnapshot === snapshot.id}">restore</i>
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </template>
    </div>
</template>

<script>
import StoryRepository from "../../../repositories/StoryRepository";
import SnapshotRepository from "../../../apiRepositories/SnapshotRepository";

export default {
    props: {},
    data() {
        return {
            campaignId: null,
            story: null,
            takingSnapshot: false,
            restoringSnapshot: null,
            storyRepository: new StoryRepository,
            snapshotRepository: new SnapshotRepository,
        }
    },
    beforeMount() {
        this.campaignId = app.campaignId;
    },
    mounted() {
        this.$bus.$on('campaigns-changed', this.setStory);
        this.setStory();
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.setStory);
    },
    methods: {
        async setStory() {
            this.story = this.storyRepository.current();
            this.campaignId = app.campaignId;
        },
        async takeSnapshot() {
            if (this.takingSnapshot) {
                return;
            }

            this.takingSnapshot = true;
            this.story = await this.snapshotRepository.take(this.story);
            this.takingSnapshot = false;
        },
        async restore(snapshot) {
            if (this.restoringSnapshot) {
                return;
            }

            this.restoringSnapshot = snapshot.id;
            this.story = await this.snapshotRepository.restore(this.story, snapshot);
            this.$bus.$emit('campaign-selected', this.campaignId);
            this.restoringSnapshot = null;
        },
    }
}
</script>
