<template>
    <modal ref="modal" :title="$t('share-modal.title')">
        <template v-slot:content>
            <p class="mb-2">{{ $t('share-modal.1') }}</p>
            <p class="mb-8">
                <a v-clipboard:copy="url"
                   class="copied link">
                    {{ $t('share-modal.2') }}</a>
                {{ $t('share-modal.3') }}
            </p>

            <share-icons :url="url" :margin-center="true"/>
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
        },
        methods: {
            open() {
                const path = this.$router.currentRoute.path.split('/')[1];
                this.url = this.shareState.link('local', path);
                this.$refs['modal'].open();
                this.addCopyTippy();
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
            }
        }
    }
</script>
