// Event decks on a party or campaign sheet. A deck is drawn from the top and a drawn card goes to the bottom,
// unless it is removed (unchecked) from the deck. `deckOrder[type]` holds the ids top to bottom; it's reconciled
// with the checked cards on every draw.
export default {
    // Returns the drawn card id, or undefined when the deck is empty.
    drawEvent(type, checkedIds) {
        const known = (this.deckOrder[type] || []).filter(id => checkedIds.includes(id));
        // Cards added since the last draw are shuffled into the deck.
        const deck = checkedIds.some(id => !known.includes(id)) ? _.shuffle(checkedIds) : known;
        if (!deck.length) {
            return;
        }

        const [id, ...rest] = deck;
        this.deckOrder = {...this.deckOrder, [type]: [...rest, id]};

        return id;
    },
}
