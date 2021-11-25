<template>
    <div class="pt-12 pb-4 px-4">
        <div id="info" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-screen-sm">
            <h1 class="mb-4 text-xl">{{ $t('about us.title') }}</h1>

            <p>{{ $t('about us.text') }}</p>
            <div class="m-4">
                <webp src="/img/minis.jpg" alt="Gloomhaven minis"/>
            </div>

            <h2 id="contribute" class="mt-8 mb-4 text-lg">{{ $t('Contributions') }}</h2>

            <p>Support the project by joining the Patreon. You'll earn my deepest gratitude. You make it
                possible for me to maintain the tracker and keep the new features coming.</p>
            <p class="mt-2">Patrons can create unlimited shared campaigns. In addition they can vote on new features and
                are notified when new features roll out! Upcoming features include improvements to Character sheets,
                JotL support or Solo scenarios!</p>

            <div class="flex flex-col sm:flex-row">
                <div>
                    <becomePatronButton class="mt-8 flex justify-start"></becomePatronButton>
                    <donate class="mt-8"></donate>
                </div>
                <div class="mt-8 sm:mt-0 sm:ml-12 sm:flex sm:items-end">
                    <webp src="/img/character-sheets.png" width="225"></webp>
                </div>
            </div>

            <h2 class="mt-8 mb-4 text-lg">{{ $t('Support') }}</h2>
            <p>Would you like to contribute by translating to your native language?</p>
            <p>For help or feedback, please consult the <a href="/#/faq" class="link">FAQ</a> or
                <email-me class="link">send me an e-mail.</email-me>
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
                    Krokantpudding & mgh1979
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Spanish') }}:</span>
                    Juan Carlos Orte Cardona & Álvaro Frutos
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
        return {}
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
