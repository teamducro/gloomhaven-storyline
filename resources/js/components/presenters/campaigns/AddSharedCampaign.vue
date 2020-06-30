<template>
    <div>
        <div class="mt-8">
            <h2 class="text-xl">{{ $t('Received a campaign code?') }}</h2>

            <p class="mt-2">
                {{ $t('Fill in your campaign code, you\'ll get access to the shared campaign.') }}
            </p>
            <form @submit="submitCampaignCode" class="flex items-center">
                <label class="mdc-text-field mdc-text-field--filled" ref="code">
                    <span class="mdc-text-field__ripple"></span>
                    <input class="mdc-text-field__input" aria-labelledby="code-label"
                           v-model="code" type="text" name="code">
                    <span class="mdc-floating-label" id="code-label">Campaign code</span>
                    <span class="mdc-line-ripple"></span>
                </label>
                <div class="relative">
                    <button type="submit" class="mdc-button mdc-button--raised ml-3">
                        <span class="mdc-button__label">{{ $t('Sync Campaign') }}</span>
                    </button>
                    <loader v-if="sending" float></loader>
                </div>
            </form>
            <validation-errors :response="errors" field="code"/>
            <transition name="fade">
                <alert v-if="success" class="inline-block">
                    {{ $t('Your campaign has been synced! 🎉') }}
                </alert>
            </transition>
        </div>
    </div>
</template>

<script>
    import {MDCTextField} from "@material/textfield/component";
    import AuthRepository from "../../../apiRepositories/AuthRepository";
    import StoryRepository from "../../../apiRepositories/StoryRepository";
    import Collapse from "../../elements/Collapse";

    export default {
        components: {Collapse},
        data() {
            return {
                code: null,
                codeField: null,
                errors: null,
                sending: false,
                success: false,
                auth: new AuthRepository,
                storyRepository: new StoryRepository
            }
        },
        mounted() {
            this.codeField = new MDCTextField(this.$refs['code']);
        },
        destroyed() {
            if (this.codeField) {
                this.codeField.destroy();
            }
        },
        methods: {
            submitCampaignCode(e) {
                e.preventDefault();
                if (this.sending) {
                    return;
                }
                this.sending = true;
                this.errors = null;
                this.auth.submitShareCode(this.code).then(response => {
                    this.sending = false;
                    this.code = null;
                    this.selectCampaign(response.data);
                }).catch(e => {
                    this.sending = false;
                    this.errors = e.response.data;
                });
            },
            async selectCampaign(data) {
                const stories = await this.storyRepository.stories(data.access_token);
                if (stories) {
                    const story = stories.first();
                    this.storyRepository.storeCampaignData(story);
                    this.$bus.$emit('campaign-selected', stories.first().campaignId);

                    this.success = true;
                    setTimeout(() => {
                        this.success = false;
                    }, 5000);
                }
            }
        }
    }
</script>
