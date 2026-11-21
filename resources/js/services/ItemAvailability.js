class ItemAvailability {
    constructor(sheet) {
        this.sheet = sheet;
        this.itemCountUses = {};
        this.getItemAvailability();
    }

    uses(id) {
        return this.itemCountUses[id] || 0;
    }

    getItemAvailability() {
        // Removed items are out of stock for good.
        this.itemCountUses = {...this.sheet.removedItems};

        if (this.sheet.characters) {
            collect(this.sheet.characters).each(character => {
                collect(character.items).each((available, id) => {
                    if (available) {
                        this.itemCountUses[id] = (this.itemCountUses[id] || 0) + 1;
                    }
                });
            })
        }
    }
}

export default ItemAvailability;
