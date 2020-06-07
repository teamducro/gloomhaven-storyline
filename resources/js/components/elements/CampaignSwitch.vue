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
                <li v-for="(name) in campaigns"
                    :key="name" :data-value="name"
                    class="mdc-list-item cursor-pointer"
                    :aria-selected="name === current"
                    :class="{'mdc-list-item--selected': name === current}">
                    {{ name }}
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
                current: 'local',
                campaigns: [
                    'local',
                    'info'
                ]
            }
        },
        beforeMount() {
            this.setInitialCampaign();
        },
        mounted() {
            this.select = new MDCSelect($('.campaign-switch')[0]);
            this.select.listen('MDCSelect:change', this.changeCampaign);
        },
        destroyed() {
            if (this.select) {
                this.select.destroy();
            }
        },
        methods: {
            changeCampaign() {
                this.current = this.select.value;
            },
            setInitialCampaign() {
                this.current = 'local';
            }
        }
    }
</script>
