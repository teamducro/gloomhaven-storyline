<template>
    <modal ref="modal" title="Share Gloomhaven Storyline Tracker">
        <template v-slot:content>
            <p class="mb-8">Share your current storyline with your friends.</p>
            <social-sharing :url="url"
                            title="Gloomhaven Storyline Tracker"
                            description="The spoiler free storyline tracker for Gloomhaven"
                            hashtags="gloomhaven"
                            inline-template>
                <div class="flex">
                    <network network="whatsapp" class="mr-2 cursor-pointer">
                        <img src="img/share/whatsapp.png" alt="whatsapp" srcset="img/share/whatsapp@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <network network="email" class="mr-2 cursor-pointer">
                        <img src="img/share/email.png" alt="email" srcset="img/share/email@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <a v-clipboard:copy="url" id="copy" class="cursor-pointer mr-6" data-tippy-content="Copied">
                        <img src="img/share/copy-link.png" alt="copy-link" srcset="img/share/copy-link@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </a>

                    <network network="facebook" class="ml-auto mr-2 cursor-pointer">
                        <img src="img/share/facebook.png" alt="facebook" srcset="img/share/facebook@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>

                    <!--<network network="reddit" class=mr-2 cursor-pointer>
                        <img src="img/share/reddit.png" alt="reddit" srcset="img/share/reddit@2x.png 2x"
                        class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>-->

                    <network network="twitter" class="cursor-pointer">
                        <img src="img/share/twitter.png" alt="twitter" srcset="img/share/twitter@2x.png 2x"
                             class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
                    </network>
                </div>
            </social-sharing>
        </template>
    </modal>
</template>

<script>
    import tippy from 'tippy.js';
    import ShareState from "../services/ShareState";

    export default {
        data() {
            return {
                url: '',
                shareState: new ShareState
            }
        },
        mounted() {
            this.$bus.$on('open-share-modal', this.open);
        },
        methods: {
            open() {
                this.url = this.shareState.link();
                this.$refs['modal'].open();
                this.$nextTick(() => {
                    let popups = tippy('#copy', {
                        trigger: 'click'
                    });
                    setTimeout(() => {
                        popups[0].hide();
                    }, 3000);
                })
            }
        }
    }
</script>
