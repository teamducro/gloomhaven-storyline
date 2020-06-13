<template>
    <div class="campaign-switch mdc-select">
        <div class="mdc-select__anchor">
            <i class="mdc-select__dropdown-icon"></i>
            <div class="mdc-select__selected-text">
                {{ current }}
            </div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface demo-width-class">
            <ul class="mdc-list">
                <li class="mdc-list-item cursor-pointer"
                    :aria-selected="current === 'local'"
                    :class="{'mdc-list-item--selected': current === 'local'}">
                    {{ $t('local') }}
                </li>
                <li v-for="(story) in stories.items"
                    :key="story.campaignId" :data-value="story.campaignId"
                    class="mdc-list-item cursor-pointer"
                    :aria-selected="current === story.campaignId"
                    :class="{'mdc-list-item--selected': current === story.campaignId}">
                    {{ story.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {MDCSelect} from "@material/select/component";

    export default {
        data() {
            return {
                stories: collect(),
                campaignId: 'local',
                current: 'local'
            }
        },
        beforeMount() {
            this.applyData();
        },
        mounted() {
            this.select = new MDCSelect($('.campaign-switch')[0]);
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
                this.current = app.stories.firstWhere('campaignId', this.campaignId).name;
            },
            campaignSelected() {
                this.$bus.$emit('campaign-selected', this.select.value);
            }
        }
    }
</script>
