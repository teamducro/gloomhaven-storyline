import './services/app/globals';
import {createRouter, createWebHashHistory} from 'vue-router';
import {loadStripe} from '@stripe/stripe-js/pure';
import Home from "./pages/Home";
import Alert from "./components/elements/Alert";
import EmailMe from "./components/elements/EmailMe";
import InlineSvg from "./components/elements/InlineSvg";
import Purchase from "./components/elements/Purchase";
import Modal from "./components/modals/Modal";
import Checkbox from "./components/elements/Checkbox";
import ShareIcons from "./components/elements/ShareIcons";
import Toast from "./components/elements/Toast";
import Webp from "./components/elements/Webp";
import TopMenu from "./pages/sections/TopMenu";
import SiteFooter from "./pages/sections/SiteFooter";
import BecomePatronButton from "./components/elements/BecomePatronButton";
import {createApp} from 'vue';
import i18nEn from "./lang/en/en";
import bus from './services/EventBus';
import createLegacyI18n from './services/createLegacyI18n';
import registerGlobals from './services/app/registerGlobals';
import reloadForNewBuild from "./services/app/reloadForNewBuild";
import '../sass/website-theme.scss';
import '../sass/website.scss';

window.addEventListener('vite:preloadError', (event) => reloadForNewBuild() && event.preventDefault());

// Router
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: Home},
        {path: '/:pathMatch(.*)*', component: Home}
    ]
});

// Multi Language
const i18n = createLegacyI18n({en: i18nEn});
window.i18n = i18n.global;

const vueApp = createApp({
    provide() {
        return {
            appData: {}
        }
    },
    data() {
        return {
            appUrl: import.meta.env.MIX_APP_URL,
            webpSupported: true,
        }
    },
    async mounted() {
        this.webpSupported = this.isWebpSupported();
        this.shouldRedirectToApp();

        vueApp.config.globalProperties.$stripe = await loadStripe(import.meta.env.MIX_STRIPE_KEY);
    },
    methods: {
        isWebpSupported() {
            let elem = document.createElement('canvas');

            if (!!(elem.getContext && elem.getContext('2d'))) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }

            return false;
        },
        shouldRedirectToApp() {
            ['story', 'scenarios', 'map', 'achievements', 'info', 'campaigns', 'party', 'login', 'shared', 'states'].forEach(path => {
                if (location.hash.includes(path) || location.search.includes(path)) {
                    const newLocation = location.href.replace(import.meta.env.MIX_WEB_URL, import.meta.env.MIX_APP_URL);
                    location.replace(newLocation);
                }
            });
        }
    }
});

// Vue components
vueApp.component('alert', Alert);
vueApp.component('email-me', EmailMe);
vueApp.component('inline-svg', InlineSvg);
vueApp.component('purchase', Purchase);
vueApp.component('modal', Modal);
vueApp.component('checkbox', Checkbox);
vueApp.component('share-icons', ShareIcons);
vueApp.component('toast', Toast);
vueApp.component('webp', Webp);
vueApp.component('becomePatronButton', BecomePatronButton);

// Vue page sections
vueApp.component('top-menu', TopMenu);
vueApp.component('site-footer', SiteFooter);

vueApp.config.globalProperties.$bus = bus;
registerGlobals(vueApp);
vueApp.use(router);
vueApp.use(i18n);
window.app = vueApp.mount('#app');
