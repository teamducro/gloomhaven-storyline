// A deck is drawn from the top and a drawn card goes to the bottom, unless it is removed (unchecked) from the deck.
// `sheet.deckOrder[type]` holds the ids top to bottom; it's reconciled with the checked cards on every draw.
export default {
    methods: {
        draw(checkedItems, type) {
            const known = (this.sheet.deckOrder[type] || []).filter(id => checkedItems.includes(id));
            // Cards added since the last draw are shuffled into the deck.
            const deck = checkedItems.some(id => !known.includes(id)) ? _.shuffle(checkedItems) : known;
            if (!deck.length) {
                return;
            }

            const [id, ...rest] = deck;
            this.sheet.deckOrder = {...this.sheet.deckOrder, [type]: [...rest, id]};
            this.store();
            this.$bus.$emit('open-event-card', {id: type + '-' + id, game: this.appData.game, viaDraw: true});
        },
    }
}
