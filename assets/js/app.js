import ScenarioRepository from "./repositories/ScenarioRepository";

window._ = require('lodash');
window.$ = require('jquery');
window.Vue = require('vue');

let collect = require('collect.js');

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
        this.scenarios = ScenarioRepository.fetch();

        this.$nextTick(() => {
            window.bus.$emit('scenarios-updated');
        });
    }
});
