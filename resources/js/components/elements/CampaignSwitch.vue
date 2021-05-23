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
                <li v-for="(story) in stories.items"
                    :key="story.campaignId" :data-value="story.campaignId"
                    class="mdc-list-item cursor-pointer whitespace-nowrap flex items-center"
                    :aria-selected="current === story.campaignId"
                    :class="{'mdc-list-item--selected': current === story.campaignId}">
                    {{ story.name }}
                    <span class="ml-4 mt-1 cloud-on"></span>
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
            storyRepository: new StoryRepository
        }
    },
    mounted() {
        this.select = new MDCSelect(this.$refs['campaign-switch']);
        this.select.listen('MDCSelect:change', this.campaignSelected);

        this.$bus.$on('campaigns-changed', this.applyData);
    },
    destroyed() {
        if (this.select) {
            this.select.destroy();
        }
        this.$bus.$off('campaigns-changed', this.applyData);
    },
    methods: {
        applyData() {
            this.campaignId = app.campaignId;
            this.stories = app.stories;
            const story = this.storyRepository.current()
            if (story) {
                this.current = story.name;
            }
        },
        campaignSelected() {
            this.$bus.$emit('campaign-selected', this.select.value);
        }
    }
}
</script>

<style scoped lang="scss">
.campaign-switch.with-transparency {
    .mdc-select__anchor {
        &, &:before, &:after {
            background-color: transparent !important;
        }
    }
}
</style>
