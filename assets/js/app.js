window._ = require('lodash');
window.Vue = require('vue');
import scenarios from './scenarios.json';

let collect = require('collect.js');

const files = require.context('./components', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

window.bus = new Vue;
window.app = new Vue({
    el: '#app',
    data() {
        return {
            scenarios: null,
            edges: null
        }
    },
    mounted() {
        this.scenarios = collect(scenarios.scenarios);
        this.edges = collect(scenarios.edges);
    }
});
