<template>
    <div>
        <div class="relative mdc-text-field mdc-text-field--textarea w-full"
             :ref="id">
        <textarea :id="id" @change="changed" @keyup="keyup" v-model="text" :disabled="disabled" :max="max"
                  class="mdc-text-field__input" rows="4" cols="40"></textarea>

            <span class="absolute bottom-0 right-0 mr-2 mb-1"
                  :class="hasScroll ? 'mr-6' : 'mr-2'">
            {{ count }} / {{ max }}
        </span>

            <div class="mdc-notched-outline">
                <div class="mdc-notched-outline__leading"></div>
                <div class="mdc-notched-outline__notch">
                    <label :for="id" class="mdc-floating-label">{{ label }}</label>
                </div>
                <div class="mdc-notched-outline__trailing"></div>
            </div>
        </div>
        <p v-if="isLocalCampaign && count > max / 2" class="text-sm">
            {{ $t('character-limit-message') }}.
            <router-link to="/campaigns" class="link">
                {{ $t('Please consider purchasing a licence') }}.
            </router-link>
        </p>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";

export default {
    props: {
        id: {
            type: String
        },
        label: {
            type: String
        },
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isLocalCampaign: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            text: '',
            count: 0,
            field: null,
            hasScroll: false
        }
    },
    async mounted() {
        this.field = new MDCTextField(this.$refs[this.id]);
        this.text = this.value;
        this.count = this.text.length;

        await this.$nextTick();
        this.checkForScrollbar();
        this.$bus.$on('windows-resized', () => {
            this.checkForScrollbar();
        });
    },
    computed: {
        max() {
            return this.isLocalCampaign ? 140 : 1000;
        }
    },
    watch: {
        value: function (value) {
            this.text = value;
            this.count = this.text.length;
        }
    },
    methods: {
        keyup() {
            this.count = this.field?.value.length || 0;

            // Max length reached
            if (this.count > this.max && this.field) {
                this.text = this.field.value.substr(0, this.max);
                this.count = this.text.length;
            }

            this.checkForScrollbar();
        },
        checkForScrollbar() {
            this.hasScroll = this.field.input_.scrollHeight > this.field.input_.clientHeight;
        },
        changed() {
            this.$emit('update:value', this.text);
            this.$emit('change', this.text);
        }
    }
}
</script>

<style lang="scss">
.mdc-notched-outline__notch {
    border-right: none;
    border-left: none;
}
</style>

