<template>
    <section class="bg-gray-900" id="pricing">
        <div class="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
            <div class="text-center">
                <h1 class="w-full my-2 text-4xl lg:text-5xl lg:leading-tight font-bold leading-tight text-center text-gray-200">
                    Contribute</h1>
                <p class="mt-3 max-w-4xl mx-auto text-xl leading-7 text-gray-200 sm:mt-5 sm:text-2xl sm:leading-8">
                    All content is available for free, donations cover the costs maintaining this app for the
                    community. If you enjoy using the storyline tracker, please consider a donation.<br/>
                    You'll get some nice perks!
                </p>

                <becomePatronButton class="mt-8 flex justify-center"></becomePatronButton>
            </div>
        </div>

        <div class="mt-8 bg-gray-900 pb-12 lg:mt-12">
            <div class="relative z-0">
                <div class="absolute inset-0 h-5/6 bg-gray-900 lg:h-2/3"></div>
                <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="relative lg:grid">
                        <div
                            class="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3 shadow-md">
                            <div
                                class="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg">
                                <div class="flex-1 flex flex-col">
                                    <div class="bg-white px-6 py-10">
                                        <div>
                                            <h3 class="text-center text-2xl leading-8 font-medium text-gray-900 lg:mt-7"
                                                id="tier-free">
                                                Free
                                            </h3>
                                            <div class="font-title mt-4 flex items-center justify-center">
                                                <span
                                                    class="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900">
                                                    <span class="mt-2 mr-2 text-4xl font-medium">€</span>
                                                    <span class="font-extrabold">0,00</span>
                                                </span>
                                                <span class="text-xl leading-7 font-medium text-gray-400"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray-800 flex-1 flex flex-col justify-between border-t-2 border-gray-50 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                                        <ul class="-mt-4">
                                            <li v-for="(isPro, feature) in features.free" class="mt-4 flex items-start">
                                                <div class="flex-shrink-0">
                                                    <inline-svg src="icons/checkmark"></inline-svg>
                                                </div>
                                                <p class="ml-3 text-base leading-6 font-medium text-gray-400">
                                                    {{ feature }}
                                                </p>
                                            </li>
                                        </ul>
                                        <div class="mt-8">
                                            <div class="rounded-lg shadow-md">
                                                <a :href="appUrl"
                                                   class="block w-full text-center rounded-lg border border-transparent bg-white px-6 py-3 text-base leading-6 font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring transition ease-in-out duration-150"
                                                   aria-describedby="tier-free">
                                                    Open storyline
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4 shadow-2xl">
                            <div class="relative z-10 rounded-lg shadow-xl">
                                <div
                                    class="pointer-events-none absolute inset-0 rounded-lg border-2 border-blue-600"></div>
                                <div class="absolute inset-x-0 top-0 transform translate-y-px">
                                    <div class="flex justify-center transform -translate-y-1/2">
                                        <span
                                            class="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white">
                                            Most popular
                                        </span>
                                    </div>
                                </div>
                                <div class="bg-white rounded-t-lg px-6 pt-12 pb-10">
                                    <div>
                                        <h3 class="flex items-center flex-col text-center text-3xl leading-9 font-semibold text-gray-900 sm:-mx-6"
                                            id="tier-gloomhaven">
                                            <webp class="" src="/img/gloomhaven-logo.png" alt="Gloomhaven logo"
                                                  width="250" height="37"></webp>
                                            Pro
                                        </h3>
                                        <div class="font-title mt-4 flex items-center justify-center">
                                            <span
                                                class="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900 sm:text-6xl sm:leading-none">
                                                <span class="mt-2 mr-2 text-4xl font-medium">€</span>
                                                <span class="font-extrabold">4,99</span>
                                            </span>
                                            <span class="text-2xl leading-8 font-medium text-gray-400">/ year</span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="bg-gray-900 border-t-2 border-gray-50 rounded-b-lg pt-10 pb-8 px-6 bg-gray-50 sm:px-10 sm:py-10">
                                    <ul class="-mt-4">
                                        <li v-for="(isPro, feature) in features.gloomhaven"
                                            class="mt-4 flex items-start">
                                            <div class="flex-shrink-0">
                                                <inline-svg src="icons/checkmark"></inline-svg>
                                            </div>
                                            <p class="ml-3 text-base leading-6 font-medium"
                                               :class="{'text-white': isPro, 'text-gray-400': !isPro}">
                                                {{ feature }}
                                            </p>
                                        </li>
                                    </ul>
                                    <div class="mt-10">
                                        <div class="rounded-lg shadow-md">
                                            <purchase preselect="gh">
                                                <a href="#"
                                                   class="block w-full text-center rounded-lg border border-transparent bg-blue-600 px-6 py-4 text-xl leading-6 font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-700 transition ease-in-out duration-150"
                                                   aria-describedby="tier-gloomhaven">
                                                    Buy shared campaign
                                                </a>
                                            </purchase>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3 shadow-md">
                            <div
                                class="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-r-lg">
                                <div class="flex-1 flex flex-col">
                                    <div class="bg-white px-6 py-10">
                                        <div>
                                            <h3 class="flex items-center flex-col text-center text-2xl leading-8 font-medium text-gray-900"
                                                id="tier-frosthaven">
                                                <webp class="" src="/img/frosthaven-logo.png" alt="Frosthaven logo"
                                                      width="250" height="37"></webp>
                                                <span>Pro <span class="text-xs">(Beta)</span></span>
                                            </h3>
                                            <div class="font-title mt-4 flex items-center justify-center">
                                                <span
                                                    class="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900">
                                                    <span class="mt-2 mr-2 text-4xl font-medium">€</span>
                                                    <span class="font-extrabold">4,99</span>
                                                </span>
                                                <span class="text-xl leading-7 font-medium text-gray-400">/ year</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray-800 flex-1 flex flex-col justify-between border-t-2 border-gray-50 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                                        <ul class="-mt-4">
                                            <li v-for="(isPro, feature) in features.frosthaven"
                                                class="mt-4 flex items-start">
                                                <div class="flex-shrink-0">
                                                    <inline-svg src="icons/checkmark"></inline-svg>
                                                </div>
                                                <p class="ml-3 text-base leading-6 font-medium"
                                                   :class="{'text-white': isPro, 'text-gray-400': !isPro}">
                                                    {{ feature }}
                                                </p>
                                            </li>
                                        </ul>
                                        <div class="mt-8">
                                            <div class="rounded-lg shadow-md">
                                                <purchase preselect="fh">
                                                    <a href="#"
                                                       class="block w-full text-center rounded-lg border border-transparent bg-blue-600 px-6 py-4 text-xl leading-6 font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-700 transition ease-in-out duration-150"
                                                       aria-describedby="tier-frosthaven">
                                                        Buy shared campaign
                                                    </a>
                                                </purchase>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-4 sm:px-6 lg:px-8 pb-16">
            <div class="text-center">
                <p class="mt-3 max-w-4xl mx-auto text-base leading-7 text-gray-200 sm:mt-5 sm:text-lg sm:leading-8">
                    When donating multiple times, you can manage multiple campaigns!<br>
                    Licenses aren't renewed automatically.
                </p>

                <p class="mt-3 max-w-4xl mx-auto text-base leading-7 text-gray-200 sm:mt-5 sm:text-lg sm:leading-8">
                    <a :href="appUrl+'?received-a-campaign-code#/campaigns'" class="underline">
                        Received a campaign code? Click here!
                    </a>
                </p>
            </div>
        </div>

    </section>
</template>

<script>
export default {
    data() {
        return {
            appUrl: process.env.MIX_APP_URL,
            features: {
                free: {
                    'Manual sharing': false,
                    'Spoiler free scenario tracking': false,
                    'Scenario summaries': false,
                    'Tracked Achievements': false,
                    'Map view': false,
                    'Items': false,
                    'Party and Character sheets': false,
                    'All modern devices': false,
                    'Multi language': false,
                },
                gloomhaven: {
                    'Automatic sharing': true,
                    'Spoiler free scenario tracking': false,
                    'Scenario summaries': false,
                    'Tracked Achievements': false,
                    'Map view': false,
                    'Items': false,
                    'Party and Character sheets': false,
                    'All modern devices': false,
                    'Multi language': false,
                    'Automatic snapshots': true,
                    'Support the project': true,
                },
                frosthaven: {
                    'Automatic sharing': true,
                    'Spoiler free scenario tracking': false,
                    'Scenario summaries': false,
                    'Tracked Achievements': false,
                    'Map view': false,
                    'Items': false,
                    'Party and Character sheets': false,
                    'All modern devices': false,
                    'Multi language': false,
                    'Automatic snapshots': true,
                    'Support the project': true,
                }
            }
        }
    },
    mounted() {
    },
    methods: {}
}
</script>
