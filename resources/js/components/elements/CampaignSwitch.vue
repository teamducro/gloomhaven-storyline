<template>
    <div ref="campaign-switch" class="campaign-switch mdc-select mdc-select--filled w-full"
         :class="{'with-transparency': withTransparency}">
        <span class="mdc-deprecated-list-item absolute z-1 pointer-events-none text-xs! -mt-2! text-white2-60!">
            {{ $t('Selected Campaign') }}
        </span>
        <div class="mdc-select__anchor w-full" role="button" aria-haspopup="listbox" aria-expanded="false">
            <span class="mdc-select__ripple"></span>
            <span class="mdc-select__selected-text-container">
                <span class="mdc-select__selected-text">
                    {{ current === 'local' ? $t('local') : current }}
                </span>
            </span>
            <select-dropdown-icon></select-dropdown-icon>
            <span class="mdc-line-ripple"></span>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface overflow-visible" style="min-width: 240px">
            <ul class="mdc-deprecated-list" role="listbox">
                <li role="option" class="mdc-deprecated-list-item cursor-pointer whitespace-nowrap"
                    :aria-selected="current === 'local'"
                    :class="{'mdc-deprecated-list-item--selected': current === 'local'}">
                    <span class="mdc-deprecated-list-item__ripple"></span>
                    <span class="mdc-deprecated-list-item__text">{{ $t('local') }}</span>
                    <span class="ml-4 mt-1 cloud-off"></span>
                </li>
                <li role="option" v-for="story in stories.items"
                    :key="story.campaignId" :data-value="story.campaignId"
                    class="mdc-deprecated-list-item cursor-pointer whitespace-nowrap flex items-center"
                    :aria-selected="campaignId === story.campaignId"
                    :class="{'mdc-deprecated-list-item--selected': campaignId === story.campaignId}">
                    <span class="mdc-deprecated-list-item__ripple"></span>
                    <span class="mdc-deprecated-list-item__text">{{ story.name }}</span>
                    <span class="ml-4 mt-1" :class="story.has_expired ? 'cloud-off' : 'cloud-on'"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {MDCSelect} from "@material/select/component";
import StoryRepository from "../../repositories/StoryRepository";

export default {
    props: {
        withTransparency: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            stories: collect(),
            campaignId: 'local',
            current: 'local',
            select: null,
            storyRepository: new StoryRepository
        }
    },
    mounted() {
        this.select = new MDCSelect(this.$refs['campaign-switch']);
        this.select.listen('MDCSelect:change', this.selected);

        this.$bus.$on('campaigns-changed', this.applyData);
    },
    updated() {
        // MDC caches option values and owns the selected text, so resync after Vue re-renders the options
        this.select.layoutOptions();
        this.select.setSelectedIndex(this.currentIndex(), true);
    },
    unmounted() {
        this.select?.destroy();

        this.$bus.$off('campaigns-changed', this.applyData);
    },
    methods: {
        open() {
            document.querySelector('.campaign-switch .mdc-select__anchor').click();
        },
        applyData() {
            this.campaignId = app.campaignId;
            this.stories = app.stories;
            const story = this.storyRepository.current()
            this.current = story?.name ?? 'local';

            const index = this.currentIndex();
            if (this.select.selectedIndex !== index) {
                this.select.selectedIndex = index
            }
        },
        currentIndex() {
            return this.current === 'local' ? 0
                : this.stories.items.findIndex(story => story.campaignId === this.campaignId) + 1;
        },
        selected(event) {
            const index = event?.detail?.index
            const campaignId = index === 0 ? 'local' : this.stories.items[index - 1].campaignId;
            this.$bus.$emit('campaign-selected', campaignId);

            let name = (campaignId === 'local')
                ? this.$t('local')
                : this.storyRepository.find(campaignId).name;

            this.$bus.$emit('toast', `"${name}" selected!`);
        }
    }
}
</script>
