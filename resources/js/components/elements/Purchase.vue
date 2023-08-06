<template>
    <div class="text-left">
        <div v-if="showTrigger" class="contents" @click.prevent.stop="openPurchaseModal">
            <slot></slot>
        </div>
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
                        @click="purchase">
                    <span class="mdc-button__label text-primary">{{ $t('Purchase') }}</span>
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
        }
    },
    computed: {
        isRenew() {
            return !!this.storyId
        }
    },
    data() {
        return {
            games: [],
            expand: null,
            gameData: new GameData,
            purchasing: false,
            story: null,
            storyRepository: new StoryRepository,
            checkout: new CheckoutRepository
        }
    },
    methods: {
        openPurchaseModal() {
            if (this.isRenew) {
                this.story = this.storyRepository.find(this.storyId)
                this.games = this.story.games
            }
            else {
                this.story = null
                this.games = []
            }
            this.expand = null

            this.$refs['purchase-modal'].open();
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
            if (this.purchasing) {
                return;
            }
            this.purchasing = true;

            const response = await this.checkout.checkout(this.storyId, this.games)
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
