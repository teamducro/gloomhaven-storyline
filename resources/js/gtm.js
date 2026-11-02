import Helpers from './services/Helpers';
import loadjs from 'loadjs';

if (Helpers.inProduction() && import.meta.env.MIX_GA_ID) {
    loadjs('https://www.googletagmanager.com/gtag/js?id=' + import.meta.env.MIX_GA_ID);

    window.dataLayer = window.dataLayer || [];

    gtag('js', new Date());
    gtag('config', import.meta.env.MIX_GA_ID, {'anonymize_ip': true});
}

function gtag() {
    window.dataLayer.push(arguments);
}
