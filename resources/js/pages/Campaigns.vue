<template>
    <div class="pt-12 pb-4 px-4">
        <div class="bg-black2-25 p-4 rounded-lg m-auto mt-4 w-full max-w-3xl">
            <h1 class="text-2xl sm:text-3xl mb-4">
                Campaigns
            </h1>

            <ul class="mdc-list">
                <li class="mdc-list-item" tabindex="0">
                    <span class="inline-block w-full flex flex-col md:flex-row items-center justify-between mdc-list-item__text">
                        local campaign
                    </span>
                </li>
                <li class="mdc-list-item h-auto" tabindex="0">
                    <span class="inline-block w-full flex flex-col md:flex-row items-center justify-between mdc-list-item__text">
                        <span>info@danield.nl</span>
                        <span class="mt-2 md:mt-0">
                            <span v-if="true" class="bedge mr-4">March 14, 2021</span>
                            <span v-else class="bedge expire mr-4">{{ $t('Expired') }}</span>
                            <button v-if="false" class="mr-4 mdc-button mdc-button--raised">
                                <i class="material-icons mdc-button__icon" aria-hidden="true">replay</i>
                                {{ $t('Renew') }}
                            </button>
                            <button class="mdc-button mdc-button--raised">
                                <i class="material-icons mdc-button__icon" aria-hidden="true">share</i>
                                {{ $t('Share') }}
                            </button>
                        </span>
                    </span>
                </li>
            </ul>

            <button class="mt-4 mdc-button mdc-button--raised">
                <i class="material-icons mdc-button__icon" aria-hidden="true">add</i>
                {{ $t('Add shared campaign') }}
            </button>


            <div v-if="false" class="mt-8 max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-3xl lg:flex">
                <div class="bg-white px-6 py-8 lg:flex-shrink-1 lg:p-10 lg:flex-1">
                    <h3 class="text-2xl leading-8 text-gray-900 sm:text-3xl sm:leading-9">
                        Annual Membership
                    </h3>
                    <p class="mt-6 text-base leading-6 text-gray-900">
                        Synchronised progress with all party members.<br/>
                        Experience the app without ads on all devices.<br/>
                        Support the project, this helps maintaining the app.
                    </p>
                    <div class="mt-8">
                        <div class="flex items-center">
                            <h4 class="flex-shrink-0 pr-4 bg-white text-sm leading-5 tracking-wider font-semibold uppercase text-indigo-600">
                                What's included
                            </h4>
                            <div class="flex-1 border-t-2 border-gray-200"></div>
                        </div>
                        <ul class="mt-8 lg:grid lg:grid-cols-2 lg:col-gap-8 lg:row-gap-5">
                            <li class="flex items-start lg:col-span-1">
                                <div class="flex-shrink-0">
                                    <inline-svg src="icons/check"/>
                                </div>
                                <p class="ml-3 text-sm leading-5 text-gray-700">
                                    Synchronised progress
                                </p>
                            </li>
                            <li class="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                                <div class="flex-shrink-0">
                                    <inline-svg src="icons/check"/>
                                </div>
                                <p class="ml-3 text-sm leading-5 text-gray-700">
                                    Remove ads
                                </p>
                            </li>
                            <li class="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                                <div class="flex-shrink-0">
                                    <inline-svg src="icons/check"/>
                                </div>
                                <p class="ml-3 text-sm leading-5 text-gray-700">
                                    Supports all modern devices
                                </p>
                            </li>
                            <li class="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                                <div class="flex-shrink-0">
                                    <inline-svg src="icons/check"/>
                                </div>
                                <p class="ml-3 text-sm leading-5 text-gray-700">
                                    Supports the project
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="py-8 px-6 text-center bg-gray-200 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                    <div class="font-title mt-4 flex items-center justify-center text-5xl leading-none text-gray-900">
                      <span>
                        $3.99
                      </span>
                        <span class="ml-3 text-xl leading-7 font-medium text-gray-500">
                        USD
                      </span>
                    </div>
                    <p class="mt-4 text-sm leading-5">
                        <a href="#" class="font-medium text-gray-500 underline">
                            Learn about our membership policy
                        </a>
                    </p>
                    <div class="mt-6">
                        <div class="rounded-md shadow">
                            <a href="#"
                               class="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                                Get Access
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <h2 class="text-xl mt-8 mb-4">Synchronised progress</h2>
            <p class="text-lg mb-1">How does it work?</p>
            <ul class="list-disc ml-4 leading-relaxed">
                <li>Click on <span class="link">Add shared campaign</span></li>
                <li>After purchasing a licence you'll receive a link in your email</li>
                <li>Click on the link in the email to add your new shared campaign!</li>
                <li class="mt-3">Click on <span class="link">Share</span> to give access to your party members</li>
                <li class="text-lg">All changes made by any party member will be synchronised! 🎉</li>
            </ul>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        mounted() {

        },
        methods: {}
    }
</script>
