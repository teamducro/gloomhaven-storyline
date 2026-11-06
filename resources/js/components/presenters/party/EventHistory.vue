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
                        <span v-if="entry.choice" class="font-title mr-2">{{ entry.choice }}</span>
                        <span v-if="entry.removed" class="material-icons align-middle mr-2">delete</span>
                        <span class="text-sm">{{ new Date(entry.date).toLocaleDateString() }}</span>
                    </span>
                </li>
            </ul>
        </collapse>
    </div>
</template>

<script>
import Card from "../../../models/Card";

export default {
    emits: ['change'],
    inject: ['appData'],
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
            } else {
                this.sheet.eventHistory.push({card: this.key(card), choice: null, removed: true, date: new Date().toISOString()});
            }
            this.$emit('change');
        },
        key(card) {
            return card.type + '-' + card.id;
        }
    }
}
</script>
