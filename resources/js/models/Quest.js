export default class Quest {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.stage = 0;
        this.stages = data.stages;
        this.checks = data.checks;
    }

    description() {
        return this.stages[this.stage];
    }
}
