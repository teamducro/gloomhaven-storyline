<template>
    <div class="pt-12 pb-4 px-2 sm:px-4">
        <div id="info" class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-screen-sm">
            <h1 class="mb-4 text-xl">{{ $t('about us.title') }}</h1>

            <p>{{ $t('about us.text') }}</p>
            <div class="m-4">
                <webp v-if="mainGame === 'fh'" src="/img/fn-minis.jpg" alt="Frosthaven minis"/>
                <webp v-else src="/img/minis.jpg" alt="Gloomhaven minis"/>
            </div>

            <h2 id="contribute" class="mt-8 mb-4 text-lg">{{ $t('Contributions') }}</h2>

            <p>{{ $t('contribute.text-1') }}</p>
            <p class="mt-2">{{ $t('contribute.text-2') }} Upcoming features include Frosthaven herb garden.</p>

            <div class="flex flex-col sm:flex-row">
                <div>
                    <becomePatronButton class="mt-8 flex justify-start"></becomePatronButton>
                    <donate class="mt-8"></donate>
                </div>
            </div>

            <h2 class="mt-8 mb-4 text-lg">{{ $t('Support') }}</h2>
            <!--<p>{{ $t('support.text-1') }}</p>-->
            <p>{{ $t('support.text-2') }} <a href="/#/faq" class="link">{{ $t('faq') }}</a> {{ $t('or') }}
                <email-me class="link">{{ $t('send me an e-mail') }}</email-me>.
            </p>

            <h2 class="mt-8 mb-4 text-lg">{{ $t('Open source') }}</h2>
            <a href="https://github.com/teamducro/gloomhaven-storyline">
                <button class="mdc-button mdc-button--raised">
                    <inline-svg src="icons/github.svg" class="mdc-button__icon" :classes="['w-full','h-full']"/>
                    <span class="mdc-button__label">GitHub</span>
                </button>
            </a>

            <change-log></change-log>

            <h2 id="credits" class="mt-8 mb-4 text-lg">{{ $t('Credits') }}</h2>
            <p class="mb-2">{{ $t('credits.thanks') }}</p>
            <ul class="list-disc ml-4">
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Gloomhaven assets by') }}
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/Cephalofair">
                            Isaac Childres</a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/thread/1733586/files-creation">
                        Files for creation</a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Chart layout by') }}
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/grimtoothy">
                            Grimtoothy</a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/filepage/177419/scenario-and-storyline-flowchart">
                        Scenario and Storyline Flowchart</a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Scenario summaries by') }}
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/DoctorBandage">
                            DoctorBandage</a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/geeklist/237840/gloomhaven-quest-log">
                        Gloomhaven Quest Log</a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Map coordinates by') }}
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/Dargalin">
                            Dargalin</a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/thread/1880969/online-tracker-campaign-party-and-characters">
                        Online map & campaign tracker</a>
                </li>
                <li class="py-1">
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://purplekingdomgames.com">
                        Purple Kingdom Games development</a>:
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://vgb.purplekingdomgames.com">
                        {{ $t('Virtual Gloomhaven Board') }}</a>
                </li>
                <li class="py-1">
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://www.reddit.com/user/nicomatic/">
                        Nicomatic</a>:
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://heisch.github.io/gloomhaven-item-db/">
                        {{ $t('Gloomhaven Item DB') }}</a>
                </li>
                <li class="py-1">
                    Summaries for Forgotten Circles by O.T.Nad
                </li>
            </ul>
            <p>{{ $t('Translations') }}</p>
            <ul class="list-disc ml-4">
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('French') }}:</span>
                    Aelentyr & Steve Rodrigue
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Italian') }}:</span>
                    Emiliano Caruselli & O.T.Nad
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('German') }}:</span>
                    Krokantpudding & mgh1979 & FSGrunt
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Spanish') }}:</span>
                    Juan Carlos Orte Cardona & Álvaro Frutos
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Portuguese') }}:</span>
                    lucasthibau
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Hungarian') }}:</span>
                    fajack87
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Polish') }}:</span>
                    jkubiszewski
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Russian') }}:</span>
                    Nick
                </li>
            </ul>

            <p class="my-4">
                {{ $t('credits.license') }}
                <a class="link" target="_blank" rel="noreferrer"
                   href="https://creativecommons.org/licenses/by-nc-sa/4.0/">BY-NC-SA 4.0</a>.
            </p>
        </div>
    </div>
</template>

<script>

import Helpers from "../services/Helpers";

const queryString = require('query-string');

export default {
    props: {
        contribute: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            mainGame: process.env.MIX_MAIN_GAME,
        }
    },
    mounted() {
        const scrollTo = Object.keys(queryString.parse(location.search)).find(Boolean);
        if (scrollTo) {
            this.scrollTo(scrollTo);
        } else if (this.contribute) {
            this.scrollTo('contribute');
        }
    },
    methods: {
        scrollTo(id) {
            Helpers.removeQueryString();
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView();
            }
        }
    }
}
</script>
