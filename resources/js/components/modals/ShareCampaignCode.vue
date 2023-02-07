<template>
    <modal ref="modal" :title="$t('share-modal.title')" @closed="clearTimer">
        <template v-slot:content>
            <template v-if="story && story.is_shared">
                <p>{{ $t('share-campaign-code.not-allowed') }}</p>
            </template>
            <template v-else-if="code && progress">
                <p>{{ $t('share-campaign-code.1') }}</p>
                <div class="flex items-center flex-col my-6">
                    <a v-clipboard:copy="code.code" class="cursor-pointer copied">
                        <countdown :label="code.code" :percentage="progress.percentage"></countdown>
                    </a>
                    <span>{{ $t('share-campaign-code.2') }}: <span class="font-bold">{{ progress.time }}</span></span>
                    <span class="text-sm">{{ $t('share-campaign-code.3') }}</span>
                </div>

                <checkbox-with-label
                    id="read-only"
                    :label="$t('Read only mode')"
                    :checked="code.read_only"
                    @change="updateReadOnly"></checkbox-with-label>
                <p class="mb-8">
                    {{ $t('share-campaign-code.4') }}
                </p>

                <share-icons v-if="url"
                             :url="url"
                             :networks="['whatsapp', 'email']"
                             :description="'Your campaign code: ' + code.code + ' (valid until: ' + progress.time+')'"
                />
            </template>
        </template>
    </modal>
</template>

<script>
import tippy from 'tippy.js';
import StoryCodeRepository from "../../apiRepositories/StoryCodeRepository";

export default {
    data() {
        return {
            url: '',
            story: null,
            code: null,
            progress: null,
            timer: null,
            copyTippy: null,
            codeRepository: new StoryCodeRepository
        }
    },
    mounted() {
        this.$bus.$on('open-share-campaign-code-modal', this.open);
    },
    destroyed() {
        this.clearTimer();
    },
    methods: {
        async open(story) {
            this.story = story;
            this.$refs['modal'].open();
            await this.fetchCode();
            this.setUrl();
            this.setTimer();
            this.addCopyTippy();
        },
        async fetchCode() {
            this.code = await this.codeRepository.find(this.story);
            this.updatePercentage();
        },
        async updateReadOnly(id, checked) {
            this.code = await this.codeRepository.update(this.story, checked);
        },
        updatePercentage() {
            if (this.code) {
                this.progress = this.code.expirationProgress();
                if (this.progress.percentage === 0) {
                    this.fetchCode();
                }
            }
        },
        addCopyTippy() {
            if (this.copyTippy) {
                return;
            }

            this.copyTippy = tippy('.copied', {
                trigger: 'click',
                content: this.$t('Copied'),
                onShown(tippy) {
                    setTimeout(() => {
                        tippy.hide();
                    }, 1500);
                }
            });
        },
        setTimer() {
            this.clearTimer();
            this.timer = setInterval(this.updatePercentage, 1000 * 60);
        },
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        setUrl() {
            const url = process.env.MIX_APP_URL;
            const query = new URLSearchParams({
                code: this.code.code,
                to_page: location.hash.replace('#/', '')
            }).toString();

            this.url = `${url}/?${query}#/campaigns`;
        }
    }
}
</script>
