<template>
    <div v-if="history.length" id="event-history" class="w-full mt-8">
        <collapse>
            <template #trigger>
                <h2>{{ $t('Event history') }} ({{ history.length }})</h2>
            </template>

            <ul class="mt-2">
                <li v-for="entry in history" :key="entry.date + entry.card"
                    class="flex items-center justify-between py-1 border-b border-gray-600 cursor-pointer"
                    :class="{'opacity-50': entry.removed}"
                    @click="open(entry)">
                    <span>{{ $t(typeOf(entry).translatedType) }} #{{ typeOf(entry).id }}</span>
                    <span class="text-right">
                        <span v-if="entry.choice" class="font-bold mr-2">{{ entry.choice }}</span>
                        <webp v-if="entry.removed" src="/img/icons/general/event_card_rip_white.png" width="24"
                              class="inline align-middle mr-2 removed" :alt="$t('Removed from deck')" :title="$t('Removed from deck')"/>
                        <webp v-else src="/img/icons/general/event_card_shuffle_white.png" width="24"
                              class="inline align-middle mr-2 returned" :alt="$t('Returned to deck')" :title="$t('Returned to deck')"/>
                        <span class="text-sm">{{ new Date(entry.date).toLocaleDateString() }}</span>
                        <button v-if="!appData.read_only" @click.stop="forget(entry)"
                                class="forget material-icons align-middle ml-2" :title="$t('Remove from history')">close</button>
                    </span>
                </li>
            </ul>
        </collapse>
    </div>
</template>

<script>
import Card from "../../../models/Card";
import Confirm from "../../../mixins/Confirm";

export default {
    emits: ['change'],
    inject: ['appData'],
    mixins: [Confirm],
    props: {
        sheet: Object,
    },
    computed: {
        // Newest first
        history() {
            return [...this.sheet.eventHistory].reverse();
        }
    },
    mounted() {
        this.$bus.$on('event-chosen', this.chosen);
        this.$bus.$on('remove-card', this.removed);
    },
    unmounted() {
        this.$bus.$off('event-chosen', this.chosen);
        this.$bus.$off('remove-card', this.removed);
    },
    methods: {
        open(entry) {
            this.$bus.$emit('open-event-card', {id: entry.card, game: this.appData.game, choice: entry.choice, fromHistory: true});
        },
        typeOf(entry) {
            return new Card(entry.card, this.appData.game);
        },
        chosen(card, choice) {
            if (this.appData.read_only) {
                return;
            }
            this.sheet.eventHistory.push({card: this.key(card), choice, removed: false, date: new Date().toISOString()});
            this.$emit('change');
        },
        removed(card) {
            const entry = [...this.sheet.eventHistory].reverse().find(entry => entry.card === this.key(card) && !entry.removed);
            if (entry) {
                entry.removed = true;
                this.$emit('change');
            }
        },
        forget(entry) {
            const card = this.typeOf(entry);
            this.confirm(this.$t('Remove from history'), this.$t(card.translatedType) + ' #' + card.id, () => {
                this.sheet.eventHistory.splice(this.sheet.eventHistory.indexOf(entry), 1);
                this.$emit('change');
            });
        },
        key(card) {
            return card.type + '-' + card.id;
        }
    }
}
</script>
