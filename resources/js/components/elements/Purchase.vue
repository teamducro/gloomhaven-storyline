<template>
    <div class="text-left">
        <div v-if="showTrigger" class="contents" @click.prevent.stop="openPurchaseModal">
            <slot></slot>
        </div>
        <modal ref="choose-modal" :title="$t('Shared campaigns')">
            <template v-slot:content>
                <table class="w-full">
                    <tr v-for="story in stories" :key="'choose-'+story.id" class="border-b border-white2-10">
                        <td class="py-2 pr-4">
                            <span class="font-title text-white2-87">{{ story.name }}</span>
                        </td>
                        <td class="py-2 pr-4 text-sm">
                            <span v-if="story.has_expired" class="text-red-400">{{ $t('Expired') }} {{ story.expires_at.format("ll") }}</span>
                            <span v-else class="text-white2-60">{{ $t('Expires') }} {{ story.expires_at.format("ll") }}</span>
                        </td>
                        <td class="py-2 text-right">
                            <button type="button" class="mdc-button" @click.prevent="renewExisting(story)">
                                <span class="mdc-button__label text-primary">{{ story.has_expired ? $t('Renew') : $t('Extend') }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__label text-white2-75">{{ $t('Cancel') }}</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="purchaseNew">
                    <span class="mdc-button__label text-primary">{{ $t('Buy new campaign') }}</span>
                </button>
            </template>
        </modal>
        <modal ref="purchase-modal" :title="isRenew ? $t('Renew shared campaign') : $t('Buy shared campaign')">
            <template v-slot:content>
                <p>{{ isRenew ? $t('purchase.renew_text') : $t('purchase.new_text') }}</p>
                <table>
                    <tr v-for="(game) in gameData.purchasable()" :key="'game-'+game">
                        <td><checkbox group="purchasable-games"
                                      :id="'game-'+game"
                                      :checked="games.includes(game)"
                                      :auto-disable="false"
                                      @change="(id, isChecked) => {changedGames(game, isChecked)}"></checkbox>
                        </td>
                        <td class="pr-2"><label :for="'game-'+game">{{ $t(game) }}</label></td>
                        <td><span class="font-title text-md text-white2-87">€4,99</span> / year</td>
                    </tr>
                </table>

                <p class="mt-4 text-sm">{{ $t('purchase.following_free') }}: <span>{{ gameData.free().map(game => $t(game)).join(', ') }}</span></p>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__label text-white2-75">{{ $t('Cancel') }}</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="purchase" :disabled="!games.length">
                    <span class="mdc-button__label text-primary" :class="!games.length ? 'opacity-50' : ''">{{ $t('Purchase') }}</span>
                </button>
            </template>
        </modal>
        <modal ref="expand-modal" :title="$t('purchase.expand_title.'+expand)">
            <template v-slot:content>
                <p>{{ $t('purchase.expand_text.'+expand) }} {{ $t('purchase.expand_text.general') }}</p>
                <p>{{ $t('purchase.local') }}</p>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__label text-white2-75">{{ $t('Cancel') }}</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="local">
                    <span class="mdc-button__label text-white2-75">{{ $t('purchase.Go to local') }}</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="purchaseExpand">
                    <span class="mdc-button__label text-primary">{{ $t('Purchase') +' '+ $t(expand) }}</span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
import Helpers from "../../services/Helpers";
import CheckoutRepository from "../../apiRepositories/CheckoutRepository";
import GameData from "../../services/GameData";
import StoryRepository from "../../repositories/StoryRepository";

export default {
    props: {
        storyId: {
            type: Number
        },
        showTrigger: {
            type: Boolean,
            default: true
        },
        preselect: {
            type: String,
            default: null
        }
    },
    computed: {
        isRenew() {
            return !!(this.selectedStoryId || this.storyId)
        },
        effectiveStoryId() {
            return this.selectedStoryId || this.storyId
        }
    },
    data() {
        return {
            games: [],
            stories: [],
            expand: null,
            gameData: new GameData,
            purchasing: false,
            story: null,
            selectedStoryId: null,
            storyRepository: new StoryRepository,
            checkout: new CheckoutRepository
        }
    },
    methods: {
        openPurchaseModal() {
            this.selectedStoryId = null

            if (!this.storyId) {
                this.stories = (app.stories.items || []).filter(s => !s.is_shared && s.expires_at)
                if (this.stories.length > 0) {
                    this.$refs['choose-modal'].open()
                    return
                }
            }

            if (this.storyId) {
                this.story = this.storyRepository.find(this.storyId)
                this.games = this.story.games
            } else {
                this.story = null
                this.games = []
            }
            this.expand = null

            if (this.games.length === 0 && this.preselect) {
                this.games = [this.preselect]
            }

            this.$refs['purchase-modal'].open();
        },
        renewExisting(story) {
            this.selectedStoryId = story.id
            this.story = story
            this.games = story.games || []
            this.expand = null
            this.$refs['choose-modal'].close()
            this.$refs['purchase-modal'].open()
        },
        purchaseNew() {
            this.selectedStoryId = null
            this.story = null
            this.games = this.preselect ? [this.preselect] : []
            this.expand = null
            this.$refs['purchase-modal'].open()
        },
        openExpandModal(game) {
            this.story = this.storyRepository.find(this.storyId)
            this.games = []
            this.expand = game

            this.$refs['expand-modal'].open();
        },
        changedGames(game, isChacked) {
            if (isChacked && !this.games.includes(game)) {
                this.games.push(game)
            }
            else if (!isChacked && this.games.includes(game)) {
                this.games = this.games.filter(g => g !== game)
            }
        },
        async purchaseExpand() {
            this.games = [this.expand]
            await this.purchase()
        },
        async purchase() {
            if (this.purchasing || this.games.length === 0) {
                return;
            }
            this.purchasing = true;

            const response = await this.checkout.checkout(this.effectiveStoryId, this.games)
                .catch(e => {
                    this.purchasing = false;
                    this.error(e.response.data.message);
                });

            this.purchasing = false;

            if (response) {
                this.$stripe.redirectToCheckout({
                    sessionId: response.data.session
                })
                    .then(function (result) {
                        this.error(result.error.message);
                    });
            }
        },
        local() {
            this.$bus.$emit('campaign-selected', 'local');
            this.$bus.$emit('toast', `"${this.$t('local')}" selected!`);
            setTimeout(() => {
                this.$bus.$emit('game-selected', this.expand);
            }, 0);
        },
        error(message) {
            this.$bus.$emit('toast', message, false);
        }
    }
}
</script>
