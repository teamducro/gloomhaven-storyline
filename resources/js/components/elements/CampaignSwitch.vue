<template>
    <div ref="campaign-switch" class="campaign-switch mdc-select w-full"
         :class="{'with-transparency': withTransparency}">
        <span class="mdc-list-item absolute z-1 pointer-events-none !text-xs !-mt-2 !text-white2-60">
            {{ $t('Selected Campaign') }}
        </span>
        <div class="mdc-select__anchor w-full">
            <i class="mdc-select__dropdown-icon"></i>
            <div class="mdc-select__selected-text">
                {{ current === 'local' ? $t('local') : current }}
            </div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface overflow-visible" style="min-width: 240px">
            <ul class="mdc-list">
                <li class="mdc-list-item cursor-pointer whitespace-nowrap"
                    :aria-selected="current === 'local'"
                    :class="{'mdc-list-item--selected': current === 'local'}">
                    {{ $t('local') }}
                    <span class="ml-4 mt-1 cloud-off"></span>
                </li>
                <li v-for="story in stories.items"
                    :key="story.campaignId" :data-value="story.campaignId"
                    class="mdc-list-item cursor-pointer whitespace-nowrap flex items-center"
                    :aria-selected="campaignId === story.campaignId"
                    :class="{'mdc-list-item--selected': campaignId === story.campaignId}">
                    {{ story.name }}
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
    destroyed() {
        this.select?.destroy();

        this.$bus.$off('campaigns-changed', this.applyData);
    },
    methods: {
        open() {
            document.querySelector('.campaign-switch .mdc-select__selected-text').click();
        },
        applyData() {
            this.campaignId = app.campaignId;
            this.stories = app.stories;
            const story = this.storyRepository.current()
            this.current = story?.name ?? 'local';

            const index = this.current === 'local' ? 0
                : this.stories.items.findIndex(story => story.campaignId === this.campaignId) + 1;
            if (this.select.selectedIndex !== index) {
                this.select.selectedIndex = index
            }
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
