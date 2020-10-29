<template>
    <div>
        <hero-header/>

        <section class="wave-mask bg-white border-b pt-48 pb-8">
            <div class="container max-w-5xl mx-auto">
                <h1 class="w-full my-2 text-4xl lg:text-5xl font-bold leading-tight text-center text-gray-800">Get the
                    most out of Gloomhaven</h1>
                <div class="w-full mb-4">
                    <div class="h-2px mx-auto gradient w-64 opacity-75 my-0 py-0 rounded shadow"></div>
                </div>

                <div class="flex flex-wrap">
                    <div class="w-5/6 sm:w-1/2 p-6">
                        <div class="flex items-center mb-4">
                            <img src="/img/icons/story.svg" alt="Storyline icon" class="mr-2"/>
                            <h3 class="text-3xl text-gray-800 font-bold leading-none">
                                Summaries
                            </h3>
                        </div>
                        <p class="text-gray-600 mb-2">
                            View a summary of the storyline for each state of a scenario.
                        </p>
                        <p class="text-gray-600">
                            To prevent spoilers we only include a summery up-to the current scenario.
                            The conclusion of a scenario is added after it has been completed.
                        </p>
                    </div>
                    <div class="w-full sm:w-1/2 p-6">
                        <webp src="/img/scenario1.jpg" class="w-full mx-auto" alt="Gloomhaven Scenario 1"/>
                    </div>
                </div>


                <div class="flex flex-wrap flex-col-reverse sm:flex-row">
                    <div class="w-full sm:w-1/2 p-6 mt-6">
                        <img src="/img/gloomhaven-storyline-spoilerfree.jpg" class="w-full mx-auto"
                             alt="Gloomhaven schreenshot spoiler free"/>
                    </div>
                    <div class="w-full sm:w-1/2 p-6 mt-6">
                        <div class="align-middle">
                            <div class="flex items-center mb-4">
                                <img src="/img/icons/achievements.svg" alt="Achievements icon" class="mr-2 h-5"/>
                                <h3 class="text-3xl text-gray-800 font-bold leading-none">
                                    Clear and organized
                                </h3>
                            </div>
                            <p class="text-gray-600 mb-2">
                                Use the neat Flowchart overview of your completed and unlocked scenarios to keep track
                                of your progress.
                                The scenarios are color coded to quickly find available ones.
                            </p>
                            <p class="text-gray-600 mb-2">
                                Furthermore, it keeps your story organized!
                            </p>
                            <p class="text-gray-600 mb-2">
                                Blocked scenarios are displayed, along with their requirements. This way, you won't need
                                to read up the requirements in the book and risk seeing spoilers.
                            </p>
                            <p class="text-gray-600 mb-4">
                                When you complete scenarios, you will be granted Party and Global achievements.
                                The app features an achievements overview, where all your accomplishments are displayed.
                            </p>
                            <p class="mb-4">
                                <a :href="this.appUrl"
                                   class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                    Open storyline
                                </a>
                            </p>
                            <p class="text-gray-600">
                                (Removed details to prevent spoilers)
                            </p>
                        </div>
                    </div>
                </div>


                <div class="flex flex-wrap">
                    <div class="w-5/6 sm:w-1/2 p-6">
                        <div class="flex items-center mb-4">
                            <i class="material-icons text-gray-800 mr-2" aria-hidden="true">map</i>
                            <h3 class="text-3xl text-gray-800 font-bold leading-none">
                                Map view
                            </h3>
                        </div>
                        <p class="text-gray-600 mb-2">
                            See all of the scenarios you've played and achievements you've gained, displayed on the
                            original Gloomhaven map!
                        </p>
                        <p class="text-gray-600 mb-2">
                            All Global achievements and scenarios displayed on the map are clickable and the full
                            functionality of the Flowchart view is also available in this Map view.
                        </p>
                    </div>
                    <div class="w-full sm:w-1/2 p-6">
                        <webp src="/img/map-zoomed.jpg" class="w-full mx-auto" alt="Gloomhaven Scenario 1"/>
                    </div>
                </div>


                <div class="flex flex-wrap flex-col-reverse sm:flex-row">
                    <div class="w-full sm:w-1/2 p-6 mt-6">
                        <img src="/img/gloomhaven1.jpg" class="w-full mx-auto" alt="Gloomhaven"/>
                    </div>
                    <div class="w-full sm:w-1/2 p-6 mt-6">
                        <div class="align-middle">
                            <div class="flex items-center mb-4">
                                <i class="material-icons text-gray-800 mr-2" aria-hidden="true">share</i>
                                <h3 class="text-3xl text-gray-800 font-bold leading-none">
                                    Share with party
                                </h3>
                            </div>
                            <p class="text-gray-600 mb-2">
                                Share your progress with your party members! Easy with Gloomhaven Storyline!
                            </p>
                            <p class="text-gray-600 mb-4">
                                You can share your progress manually, or have the app sync it automagically between you
                                and your party members by purchasing a license.
                                Only one person in your party needs to <a href="#pricing" class="link">purchase a
                                license</a>, and your whole party can benefit!
                            </p>
                            <p class="mb-4">
                                <a :href="this.appUrl"
                                   class="inline-block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                    Open storyline
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <div class="w-5/6 sm:w-1/2 p-6">
                        <div class="flex items-center mb-4">
                            <i class="material-icons text-gray-800 mr-2" aria-hidden="true">filter_list</i>
                            <h3 class="text-3xl text-gray-800 font-bold leading-none">
                                Filters
                            </h3>
                        </div>
                        <p class="text-gray-600 mb-2">
                            Gloomhaven Storyline includes the option to track looted chests and a filter feature to find
                            completed scenarios with chests you missed.
                        </p>
                        <p class="text-gray-600">
                            Using the filter feature, you can find just the scenario you need to complete your personal
                            quest.
                        </p>
                    </div>
                    <div class="w-full sm:w-1/2 p-6">
                        <webp src="/img/gloomhaven-filters.jpg" class="w-full mx-auto" alt="Gloomhaven Filters"/>
                    </div>
                </div>

            </div>
        </section>


        <section class="bg-white border-b py-8">

            <div class="container mx-auto flex flex-wrap pt-4 pb-12">

                <h1 class="w-full my-2 text-4xl lg:text-5xl font-bold leading-tight text-center text-gray-800">
                    Additional features</h1>
                <div class="w-full mb-4">
                    <div class="h-2px mx-auto gradient w-64 opacity-75 my-0 py-0 rounded shadow"></div>
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
                    </div>
                </div>

                <div class="w-full md:w-1/2 lg:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
                    <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden">
                        <div class="w-full font-bold text-xl text-gray-800 px-6 flex items-center">
                            <i class="material-icons mr-2" aria-hidden="true">language</i>
                            Multi language
                        </div>
                        <p class="text-gray-600 px-6 mb-2">
                            Gloomhaven Storyline is available in English and French. German coming soon.
                        </p>
                        <p class="text-gray-600 px-6">
                            Please
                            <email-me class="link">contact me</email-me>
                            if you like to contribute with translations.
                        </p>
                    </div>
                </div>


                <div class="w-full lg:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
                    <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden">
                        <div class="w-full font-bold text-xl text-gray-800 px-6 flex items-center">
                            <i class="material-icons mr-2" aria-hidden="true">api</i>
                            Virtual Gloomhaven Board
                        </div>
                        <p class="text-gray-800 px-6 mb-2">
                            Hobnobuks Virtual Gloomhaven Board is designed to help people play Gloomhaven remotely,
                            without the need for a physical board.
                            Gloomhaven Storyline features integration with this great tool, allowing you to open the
                            virtual board directly from the scenario view.
                        </p>
                        <p class="text-gray-800 px-6 mb-2">
                            Registered users will join the same room as party members automatically!
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <pricing></pricing>

        <creation></creation>

        <section class="container mx-auto text-center py-6 mb-12">

            <h1 class="w-full my-2 text-4xl lg:text-5xl font-bold leading-tight text-center text-white">Enjoy
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

export default {
    components: {HeroHeader, Pricing, Creation},
    data() {
        return {
            appUrl: process.env.MIX_APP_URL,
        }
    },
    mounted() {
    },
    methods: {}
}
</script>
