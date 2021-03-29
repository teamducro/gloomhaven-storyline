class PromptConfig {
    constructor(scenario = null, config = {}) {
        this.name = scenario ? scenario.prompt : '';
        this.show = false;
        this.title = scenario ? `prompts.${scenario.prompt}.title` : '';
        this.text = scenario ? `prompts.${scenario.prompt}.text` : '';
        this.scenario = scenario;
        this.options = [];
        this.callback = null;

        // If set to true the prompt is shown after the scenario is played, otherwise it will be displayed before.
        this.promptAfter = true;

        if (scenario && Number.isInteger(config.options)) {
            for (let i = 1; i <= config.options; i++) {
                this.options.push({
                    id: i,
                    text: `prompts.${scenario.prompt}.${i}`
                })
            }
            delete config.options;
        }

        collect(config).each((item, key) => {
            this[key] = item;
        });
    }
}

export default PromptConfig;
