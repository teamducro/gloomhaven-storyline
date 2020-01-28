<template>
    <div>
        <button type="button" @click="open" class="mdc-button mdc-button--raised fixed right-0 top-0 mt-4 mr-4">
            <span class="mdc-button__label">Share</span>
            <i class="material-icons ml-2 text-base">share</i>
        </button>

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
                            <img src="img/whatsapp.png" alt="whatsapp" srcset="img/whatsapp@2x.png 2x"/>
                        </network>

                        <network network="email" class="mr-2 cursor-pointer">
                            <img src="img/email.png" alt="email" srcset="img/email@2x.png 2x"/>
                        </network>

                        <a v-clipboard:copy="url" class="cursor-pointer">
                            <img src="img/copy-link.png" alt="copy-link" srcset="img/copy-link@2x.png 2x"/>
                        </a>

                        <network network="facebook" class="ml-auto mr-2 cursor-pointer">
                            <img src="img/facebook.png" alt="facebook" srcset="img/facebook@2x.png 2x"/>
                        </network>

                        <!--<network network="reddit" class=mr-2 cursor-pointer>
                            <img src="img/reddit.png" alt="reddit" srcset="img/reddit@2x.png 2x"/>
                        </network>-->

                        <network network="twitter" class="cursor-pointer">
                            <img src="img/twitter.png" alt="twitter" srcset="img/twitter@2x.png 2x"/>
                        </network>
                    </div>
                </social-sharing>
            </template>
        </modal>
    </div>
</template>

<script>
    import ShareState from "../services/ShareState";

    export default {
        data() {
            return {
                url: '',
                shareState: new ShareState
            }
        },
        methods: {
            open() {
                this.url = this.shareState.link();
                this.$refs['modal'].open();
            }
        }
    }
</script>
