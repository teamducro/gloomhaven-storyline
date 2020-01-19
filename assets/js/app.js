import ScenarioRepository from "./repositories/ScenarioRepository";
import ScenarioValidator from "./services/ScenarioValidator";

window._ = require('lodash');
window.$ = require('jquery');
window.Vue = require('vue');
window.collect = require('collect.js');

const files = require.context('./components', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

window.bus = new Vue;
window.app = new Vue({
    el: '#app',
    data() {
        return {
            scenarios: null
        }
    },
    mounted() {
        this.fetchScenarios();
    },
    methods: {
        fetchScenarios() {
            this.scenarios = (new ScenarioRepository).fetch();

            this.$nextTick(() => {
                (new ScenarioValidator).validate();
                window.bus.$emit('scenarios-updated');
            });
        }
    }
});
