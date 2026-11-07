export default {
    methods: {
        draw(checkedItems, type) {
            const id = this.sheet.drawEvent(type, checkedItems);
            if (id === undefined) {
                return;
            }

            this.store();
            this.$bus.$emit('open-event-card', {id: type + '-' + id, game: this.appData.game});
        },
    }
}
