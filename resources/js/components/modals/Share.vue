<template>
    <modal ref="modal" :title="$t('share.title')">
        <template v-slot:content>
            <p class="mb-2">{{ $t('share.1') }}</p>
            <p class="mb-8">
                <a v-clipboard:copy="url"
                   class="copied link">
                    {{ $t('share.2') }}</a>
                {{ $t('share.3') }}
            </p>
            <social-sharing :url="url"
                            title="Gloomhaven Storyline Tracker"
                            description="The spoiler free storyline tracker for Gloomhaven"
                            hashtags="gloomhaven"
                            inline-template>
                <div class="flex">
                    <network network="whatsapp" class="mr-2 cursor-pointer">
                        <img src="img/icons/whatsapp.png" alt="whatsapp" srcset="img/icons/whatsapp@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <network network="email" class="mr-2 cursor-pointer">
                        <img src="img/icons/email.png" alt="email" srcset="img/icons/email@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <a v-clipboard:copy="url" class="cursor-pointer mr-6 copied">
                        <img src="img/icons/copy-link.png" alt="copy-link" srcset="img/icons/copy-link@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </a>

                    <network network="facebook" class="ml-auto mr-2 cursor-pointer">
                        <img src="img/icons/facebook.png" alt="facebook" srcset="img/icons/facebook@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <network network="reddit" class=mr-2 cursor-pointer>
                        <img src="img/icons/reddit.png" alt="reddit" srcset="img/icons/reddit@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <network network="twitter" class="cursor-pointer">
                        <img src="img/icons/twitter.png" alt="twitter" srcset="img/icons/twitter@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>
                </div>
            </social-sharing>
        </template>
    </modal>
</template>

<script>
    import tippy from 'tippy.js';
    import ShareState from "../../services/ShareState";

    export default {
        data() {
            return {
                url: '',
                shareState: new ShareState,
                copyTippy: null
            }
        },
        mounted() {
            this.$bus.$on('open-share-modal', this.open);

            this.copyTippy = tippy('.copied', {
                trigger: 'click',
                content: 'Copied',
                onShown(tippy) {
                    setTimeout(() => {
                        tippy.hide();
                    }, 1500);
                }
            });
        },
        methods: {
            open() {
                this.url = this.shareState.link();
                this.$refs['modal'].open();
            }
        }
    }
</script>
