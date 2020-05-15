<template>
    <div class="my-2"
         v-if="scenario.isComplete() && scenario.rewards.isNotEmpty()">
        <h2 class="text-white">
            {{ scenario.rewards.count() > 1 ? 'Rewards' : 'Reward' }}
        </h2>
        <component v-bind:is="rewards()"></component>
    </div>
</template>

<script>
    import Scenario from "../../../models/Scenario";
    import N2l from "../../../services/N2l";

    export default {
        props: {
            scenario: Scenario
        },
        data() {
            return {
                n2l: new N2l
            }
        },
        methods: {
            rewards() {
                let output = '';

                if (typeof this.scenario.rewards.first() === 'string') {
                    output = this.scenario.rewards.map(this.addCharacterIconsToRewards).join(', ');
                } else if (Array.isArray(this.scenario.rewards.first())) {
                    let n2l = new N2l();
                    this.scenario.rewards.each((conclusionRewards, index) => {
                        output += '<div>Conclusion <span class="uppercase">' + n2l.convert(index) + '</span>: ';
                        output += conclusionRewards.map(this.addCharacterIconsToRewards).join(', ');
                        output += '</div>';
                    });
                }

                return {
                    template: `<div class="flex items-center">${output}</div>`
                };
            },
            addCharacterIconsToRewards(reward) {
                if (reward.includes('.svg')) {
                    let results = reward.match(/(\d\.svg)/g);
                    results.forEach((icon) => {
                        reward = reward.replace(icon, `<character class="w-6 inline-block" character="${icon}" />`);
                    });
                }

                return reward;
            }
        }
    }
</script>
