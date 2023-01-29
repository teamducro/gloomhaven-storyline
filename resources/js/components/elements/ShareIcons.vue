<template>
    <div class="flex">
        <a v-clipboard:copy="url" class="cursor-pointer mr-2 copied">
            <img :src="`${baseUrl}/img/icons/copy-link${black ? '-black' : ''}.png`" alt="copy-link"
                 :srcset="`${baseUrl}/img/icons/copy-link${black ? '-black' : ''}@2x.png 2x`"
                 class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
        </a>
        <share-network
                v-for="network in networks"
                :key="network"
                :network="network"
                :url="url"
                :title="title"
                :description="description"
                :hashtags="hashtags"
                class="cursor-pointer"
                :class="{
                    'ml-auto': network === 'reddit' && marginCenter,
                    'mr-2': networks.length-1 !== networks.indexOf(network)
                }">
            <img :src="`${baseUrl}/img/icons/${network}${black ? '-black' : ''}.png`" :alt="network"
                 :srcset="`${baseUrl}/img/icons/${network}${black ? '-black' : ''}@2x.png 2x`"
                 class="opacity-75 hover:opacity-100 transition-opacity duration-200"/>
        </share-network>
    </div>
</template>

<script>
    import tippy from "tippy.js";
    import BaseUrl from "../../mixins/BaseUrl";

    export default {
        mixins: [BaseUrl],
        props: {
            url: {
                type: String
            },
            title: {
                type: String,
                default: 'Gloomhaven Storyline Tracker'
            },
            description: {
                type: String,
                default: 'The spoiler free storyline tracker for Gloomhaven'
            },
            hashtags: {
                type: String,
                default: 'Gloomhaven'
            },
            black: {
                type: Boolean,
                default: false
            },
            marginCenter: {
                type: Boolean,
                default: false
            },
            networks: {
                type: Array,
                default: () => {
                    return [
                        'whatsapp',
                        'email',
                        'reddit',
                        'facebook',
                        'twitter'
                    ]
                }
            }
        },
        data() {
            return {
                copyTippy: null
            }
        },
        mounted() {
            this.addCopyTippy();
        },
        methods: {
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
            }
        }
    }
</script>

<style scoped>

</style>
