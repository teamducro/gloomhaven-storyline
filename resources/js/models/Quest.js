class Quest {

    constructor(data) {
        this.id = data.id;
        this.stage = undefined;
        this.checks = data.checks;
    }

    get name() {
        return `${this.translationKey()}.name`;
    }

    get description() {
        return `${this.translationKey()}.stages.${this.stage}`;
    }

    translationKey() {
        let result = '';
        if (app.game === 'gh') {
            result = 'quest';
        } else {
            result = `quest-${app.game}`;
        }
        return `${result}.${this.id}`;
    }
}

export default Quest
