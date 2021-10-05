<template>
    <div>
        <hero-header/>

        <div class="w-full pt-4">
            <webp src="img/wave.png" alt="background wave" class="w-full object-cover" :lazy="false"/>
        </div>

        <section class="bg-white border-b pt-4 pb-8">
            <div class="container max-w-5xl mx-auto">
                <h1 class="w-full my-2 text-4xl lg:text-5xl lg:leading-tight font-bold leading-tight text-center text-gray-800">
                    Get the
                    most out of Gloomhaven</h1>
                <div class="w-full mb-4">
                    <div class="h-2px mx-auto gradient w-32 sm:w-64 opacity-75 my-0 py-0 rounded shadow"></div>
                </div>

                <two-column-content>
                    <template v-slot:title>
                        <img src="/svg/icons/story.svg" alt="Storyline icon" class="mr-2"/>
                        <h3 class="text-3xl text-gray-800 font-bold leading-none">
                            Summaries
                        </h3>
                    </template>
                    <template v-slot:left>
                        <p class="text-gray-500 mb-2">
                            View a summary of the storyline for each state of a scenario.
                        </p>
                        <p class="text-gray-500 mb-4">
                            To prevent spoilers we only include a summery up-to the current scenario.
                            The conclusion of a scenario is added after it has been completed.
                        </p>
                        <p class="mb-4">
                            <a :href="appUrl"
                               class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                Open storyline
                            </a>
                        </p>
                    </template>
                    <template v-slot:right>
                        <webp src="/img/scenario1.jpg" class="w-full mx-auto rounded-md shadow-md"
                              alt="Gloomhaven Scenario 1"/>
                    </template>
                </two-column-content>


                <two-column-content reverse>
                    <template v-slot:title>
                        <img src="/svg/icons/achievements.svg" alt="Achievements icon" class="mr-2 h-5"/>
                        <h3 class="text-3xl text-gray-800 font-bold leading-none">
                            Clear and organized
                        </h3>
                    </template>
                    <template v-slot:left>
                        <p class="text-gray-500 mb-2">
                            Use the neat Flowchart overview of your completed and unlocked scenarios to keep track
                            of your progress.
                            The scenarios are color coded to quickly find available ones.
                        </p>
                        <p class="text-gray-500 mb-2">
                            Furthermore, it keeps your story organized!
                        </p>
                        <p class="text-gray-500 mb-2">
                            Blocked scenarios are displayed, along with their requirements. This way, you won't need
                            to read up the requirements in the book and risk seeing spoilers.
                        </p>
                        <p class="text-gray-500 mb-4">
                            When you complete scenarios, you will be granted Party and Global achievements.
                            The app features an achievements overview, where all your accomplishments are displayed.
                        </p>
                        <p class="mb-4">
                            <a :href="appUrl"
                               class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                Open storyline
                            </a>
                        </p>
                        <p class="text-gray-500">
                            (Removed details to prevent spoilers)
                        </p>
                    </template>
                    <template v-slot:right>
                        <img src="/img/gloomhaven-storyline-spoilerfree.jpg"
                             loading="lazy"
                             class="w-full mx-auto rounded-md shadow-md"
                             alt="Gloomhaven schreenshot spoiler free"/>
                    </template>
                </two-column-content>


                <two-column-content>
                    <template v-slot:title>
                        <i class="material-icons text-gray-800 mr-2" aria-hidden="true">share</i>
                        <h3 class="text-3xl text-gray-800 font-bold leading-none">
                            Share with party
                        </h3>
                    </template>
                    <template v-slot:left>
                        <p class="text-gray-500 mb-2">
                            Share your progress with your party members! Easy with Gloomhaven Storyline!
                        </p>
                        <p class="text-gray-500 mb-4">
                            You can share your progress manually, or have the app sync it automagically between you
                            and your party members by contributing.
                            Only one person in your party needs to <a href="#pricing" class="link">donate</a>, and your
                            whole party can benefit!
                        </p>
                        <p class="mb-4">
                            <a :href="appUrl"
                               class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                Open storyline
                            </a>
                        </p>
                    </template>
                    <template v-slot:right>
                        <img src="/img/gloomhaven1.jpg"
                             class="w-full mx-auto rounded-md shadow-md"
                             alt="Gloomhaven"
                             loading="lazy"/>
                    </template>
                </two-column-content>


                <two-column-content reverse>
                    <template v-slot:title>
                        <i class="material-icons text-gray-800 mr-2" aria-hidden="true">assignment</i>
                        <h3 class="text-3xl text-gray-800 font-bold leading-none">
                            Party and Character sheets
                        </h3>
                    </template>
                    <template v-slot:left>
                        <p class="text-gray-500 mb-2">
                            Gloomhaven storyline tracker features a Party Sheet!
                        </p>
                        <p class="text-gray-500 mb-4">
                            With it, you can track party-related info like reputation, donations, prosperity and
                            more, all in one place!
                        </p>
                        <p class="text-gray-500 mb-4">
                            You may even track your City and Road Event Decks, this is especially useful for remote
                            play!
                        </p>
                        <p class="mb-4">
                            <a :href="appUrl+'/#/party'"
                               class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                Open partysheet
                            </a>
                        </p>
                    </template>
                    <template v-slot:right>
                        <webp src="/img/gloomhaven-party-character-sheets.jpg"
                              class="w-full mx-auto rounded-md shadow-md"
                              alt="Gloomhaven Party Sheet"/>
                    </template>
                </two-column-content>

                <two-column-content>
                    <template v-slot:title>
                        <i class="material-icons text-gray-800 mr-2 transform rotate-180" aria-hidden="true">style</i>
                        <h3 class="text-3xl text-gray-800 font-bold leading-none">
                            Item database
                        </h3>
                    </template>
                    <template v-slot:left>
                        <p class="text-gray-500 mb-2">
                            Gloomhaven storyline tracker features an item database for
                            all the available items in your Gloomhaven campaign.
                        </p>
                        <p class="text-gray-500 mb-2">
                            Items obtained in your Gloomhaven campaign can conveniently be searched and filtered
                            through. It includes all item card images.
                        </p>
                        <p class="mb-4">
                            <a :href="appUrl+'/#/items'"
                               class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                Open items
                            </a>
                        </p>
                    </template>
                    <template v-slot:right>
                        <webp src="/img/gloomhaven-items.jpg" class="w-full mx-auto rounded-md shadow-md"
                              alt="Gloomhaven Items"/>
                    </template>
                </two-column-content>

                <two-column-content reverse>
                    <template v-slot:title>
                        <i class="material-icons text-gray-800 mr-2" aria-hidden="true">map</i>
                        <h3 class="text-3xl text-gray-800 font-bold leading-none">
                            Map view
                        </h3>
                    </template>
                    <template v-slot:left>
                        <p class="text-gray-500 mb-2">
                            See all of the scenarios you've played and achievements you've gained, displayed on the
                            original Gloomhaven map!
                        </p>
                        <p class="text-gray-500 mb-4">
                            All Global achievements and scenarios displayed on the map are clickable and the full
                            functionality of the Flowchart view is also available in this Map view.
                        </p>
                        <p class="mb-4">
                            <a :href="appUrl+'/#/map'"
                               class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                Open map
                            </a>
                        </p>
                    </template>
                    <template v-slot:right>
                        <webp src="/img/map-zoomed.jpg" class="w-full mx-auto rounded-md shadow-md"
                              alt="Gloomhaven Scenario 1"/>
                    </template>
                </two-column-content>


                <two-column-content>
                    <template v-slot:title>
                        <i class="material-icons text-gray-800 mr-2" aria-hidden="true">filter_list</i>
                        <h3 class="text-3xl text-gray-800 font-bold leading-none">
                            Filters
                        </h3>
                    </template>
                    <template v-slot:left>
                        <p class="text-gray-500 mb-2">
                            Gloomhaven Storyline includes the option to track looted chests and a filter feature to find
                            completed scenarios with chests you missed.
                        </p>
                        <p class="text-gray-500 mb-4">
                            Using the filter feature, you can find just the scenario you need to complete your personal
                            quest.
                        </p>
                        <p class="mb-4">
                            <a :href="appUrl+'/#/scenarios'"
                               class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                Open scenario list
                            </a>
                        </p>
                    </template>
                    <template v-slot:right>
                        <webp src="/img/gloomhaven-filters.jpg" class="w-full mx-auto rounded-md shadow-md"
                              alt="Gloomhaven Filters"/>
                    </template>
                </two-column-content>

            </div>
        </section>


        <section class="bg-white border-b py-8">

            <div class="container mx-auto flex flex-wrap pt-4 pb-12">

                <h1 class="w-full my-2 text-4xl lg:text-5xl lg:leading-tight font-bold leading-tight text-center text-gray-800">
                    Additional features</h1>
                <div class="w-full mb-4">
                    <div class="h-2px mx-auto gradient w-32 sm:w-64 opacity-75 my-0 py-0 rounded shadow"></div>
                </div>

                <div class="w-full md:w-1/2 lg:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
                    <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden">
                        <div class="w-full font-bold text-xl text-gray-800 px-6 flex items-center">
                            <i class="material-icons mr-2" aria-hidden="true">public</i>
                            All modern devices
                        </div>
                        <p class="text-gray-800 px-6">
                            Gloomhaven Storyline supports all modern devices and browsers. Easy to use on your
                            smartphone.
                        </p>

                        <div class="pt-6 w-full font-bold text-xl text-gray-800 px-6 flex items-center">
                            <inline-svg src="icons/deviner" :classes="['w-8', 'h-8']"/>
                            Forgotten Circles
                        </div>
                        <p class="text-gray-800 px-6">
                            The tracker has support for Forgotten Circles
                        </p>
                    </div>
                </div>

                <div class="w-full md:w-1/2 lg:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
                    <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden">
                        <div class="w-full font-bold text-xl text-gray-800 px-6 flex items-center">
                            <i class="material-icons mr-2" aria-hidden="true">language</i>
                            Multi language
                        </div>
                        <p class="text-gray-500 px-6 mb-2">
                            Gloomhaven Storyline is available in English, French, Italian, German and Spanish!
                        </p>
                        <p class="text-gray-500 px-6">
                            Please
                            <email-me class="link">contact me</email-me>
                            if you like to contribute with translations.
                        </p>

                        <div class="pt-6 w-full font-bold text-xl text-gray-800 px-6 flex items-center">
                            <inline-svg src="icons/jotl" :classes="['w-6', 'h-6', 'mr-2']"/>
                            Jaws of the Lion
                        </div>
                        <p class="text-gray-800 px-6">
                            Jaws of the Lion is supported!
                        </p>
                    </div>
                </div>


                <div class="w-full lg:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
                    <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden">
                        <div class="w-full font-bold text-xl text-gray-800 px-6 flex items-center">
                            <i class="material-icons mr-2" aria-hidden="true">api</i>
                            Virtual Gloomhaven Board
                        </div>
                        <p class="text-gray-500 px-6 mb-2">
                            Virtual Gloomhaven Board by Purple Kingdom Games development is designed to help people play
                            Gloomhaven remotely, without the need for a physical board.
                            Gloomhaven Storyline features integration with this great tool, allowing you to open the
                            virtual board directly from the scenario view.
                        </p>
                        <p class="text-gray-500 px-6 mb-2">
                            Registered users will join the same room as party members automatically!
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <pricing></pricing>

        <patreons></patreons>

        <faq></faq>

        <creation></creation>

        <div class="w-full pb-4 -mt-1">
            <webp src="img/wave.png" alt="background wave" class="w-full object-cover transform rotate-180"/>
        </div>

        <section class="container mx-auto text-center px-4 py-6 mb-12">

            <h1 class="w-full my-2 text-4xl lg:text-5xl lg:leading-tight font-bold leading-tight text-center text-white">
                Enjoy
                Gloomhaven</h1>

            <h3 class="my-4 text-3xl leading-tight">An organized campaign synchronized with your party!</h3>

            <purchase class="inline-block">
                <a class="block w-full text-center rounded-lg border border-transparent bg-blue-600 px-6 py-4 text-xl leading-6 font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                    Buy shared campaign
                </a>
            </purchase>

        </section>
    </div>
</template>

<script>
import Pricing from "../pages/sections/Pricing";
import HeroHeader from "../pages/sections/HeroHeader";
import Creation from "../pages/sections/Creation";
import TwoColumnContent from "../pages/sections/TwoColumnContent";
import Faq from "./sections/FAQ";
import Patreons from "./sections/Patreons";
import {scrollIntoView} from 'scroll-js';

export default {
    components: {HeroHeader, TwoColumnContent, Pricing, Creation, Faq, Patreons},
    data() {
        return {
            appUrl: process.env.MIX_APP_URL,
        }
    },
    mounted() {
        let path = this.$router.currentRoute.path.substring(1);
        if (path.length) {
            this.scrollTo(path);
        }
    },
    methods: {
        scrollTo(id) {
            let element = document.getElementById(id);
            if (element) {
                scrollIntoView(element).then(() => {
                    scrollIntoView(element);
                });
            }
        }
    }
}
</script>
