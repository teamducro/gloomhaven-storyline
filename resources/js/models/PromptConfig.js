class PromptConfig {
    constructor(config = {}) {
        this.show = false;
        this.title = '';
        this.text = '';
        this.scenario;
        this.options = [];
        this.callback;

        collect(config).each((item, key) => {
            this[key] = item;
        });
    }
}

export default PromptConfig;
