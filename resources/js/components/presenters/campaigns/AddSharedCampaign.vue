<template>
    <div id="add-shared-campaign">
        <h2 class="text-xl">{{ $t('Received a campaign code?') }}</h2>

        <p class="mt-2">
            {{ $t('Fill in your campaign code, you\'ll get access to the shared campaign.') }}
        </p>
        <form @submit.prevent="submitCampaignCode" class="flex items-center">
            <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="code">
                <span class="mdc-text-field__ripple"></span>
                <input class="mdc-text-field__input" aria-labelledby="code-label"
                       v-model="code" type="text" name="code">
                <span class="mdc-floating-label" id="code-label">Campaign code</span>
                <span class="mdc-line-ripple"></span>
            </label>
            <div class="relative">
                <button type="submit" class="mdc-button mdc-button--raised ml-3">
                    <span class="mdc-button__label">{{ $t('Add Campaign') }}</span>
                </button>
            </div>
        </form>
        <loader class="mt-4" v-if="sending"></loader>
        <validation-errors :response="errors" field="code"/>
        <transition name="fade">
            <alert v-if="success" class="inline-block">
                {{ $t('Your campaign has been synced!') }} 🎉
            </alert>
        </transition>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";
import AuthRepository from "../../../apiRepositories/AuthRepository";
import StoryRepository from "../../../apiRepositories/StoryRepository";

export default {
    props: {
        initCode: {
            type: String,
            default: ''
        }
    },
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

        if (this.initCode) {
            this.code = this.initCode;
            this.submitCampaignCode();
        }
    },
    destroyed() {
        this.codeField?.destroy();
    },
    methods: {
        submitCampaignCode() {
            if (this.sending) {
                return;
            }
            this.sending = true;
            this.errors = null;
            let isShared = this.code === this.initCode;

            this.auth.submitShareCode(this.code).then(response => {
                this.sending = false;
                this.code = null;
                this.selectCampaign(response.data, isShared);
            }).catch(e => {
                this.sending = false;
                e.response.data.message = 'Please request a new code. ' + e.response.data.message;
                this.errors = e.response.data;
                this.codeField.focus();
                if (isShared) {
                    this.$scrollTo("#add-shared-campaign");
                }
            });
        },
        async selectCampaign(data, isShared = false) {
            const stories = await this.storyRepository.stories(data.access_token);
            if (stories) {
                const story = stories.first();
                this.storyRepository.storeCampaignData(story);
                this.$bus.$emit('campaign-selected', stories.first().campaignId);

                this.success = true;
                setTimeout(() => {
                    this.success = false;
                }, 5000);

                if (isShared) {
                    await this.$router.push('/story');
                } else {
                    this.$scrollTo('#campaigns');
                }
            }
        }
    }
}
</script>
