<template>
    <modal ref="modal" :title="$t('share.title')" @closed="clearTimer">
        <template v-slot:content>
            <p>Share the following campaign code with your party members to enable progress sync across all
                your devices!</p>
            <div v-if="code && progress" class="flex items-center flex-col my-6">
                <a v-clipboard:copy="code.code" class="cursor-pointer copied">
                    <countdown :label="code.code" :percentage="progress.percentage"></countdown>
                </a>
                <span>{{ progress.label }}</span>
            </div>
            <social-sharing
                    v-if="code"
                    title="Gloomhaven Storyline Tracker"
                    :description="'Your campaign code: ' + code.code"
                    hashtags="gloomhaven"
                    inline-template>
                <div class="flex">
                    <network network="whatsapp" class="mr-2 cursor-pointer">
                        <img src="/img/icons/whatsapp.png" alt="whatsapp" srcset="/img/icons/whatsapp@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <network network="email" class="mr-2 cursor-pointer">
                        <img src="/img/icons/email.png" alt="email" srcset="/img/icons/email@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <a v-clipboard:copy="'code'" class="cursor-pointer mr-6 copied">
                        <img src="/img/icons/copy-link.png" alt="copy-link" srcset="/img/icons/copy-link@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </a>
                </div>
            </social-sharing>
        </template>
    </modal>
</template>

<script>
    import tippy from 'tippy.js';
    import StoryCodeRepository from "../../apiRepositories/StoryCodeRepository";

    export default {
        data() {
            return {
                story: null,
                code: null,
                progress: 0,
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
                this.setTimer();
                this.addCopyTippy();
            },
            async fetchCode() {
                this.code = await this.codeRepository.find(this.story);
                this.updatePercentage();
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
                this.timer = setInterval(this.updatePercentage, 1000);
            },
            clearTimer() {
                if (this.timer) {
                    clearInterval(this.timer);
                }
            }
        }
    }
</script>
