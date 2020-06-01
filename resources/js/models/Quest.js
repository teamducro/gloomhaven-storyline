class Quest {

    constructor(data) {
        this.id = data.id;
        this.stage = undefined;
        this.checks = data.checks;
    }

    get name() {
        return `quest.${this.id}.name`;
    }

    get description() {
        return `quest.${this.id}.stages.${this.stage}`;
    }
}

export default Quest
