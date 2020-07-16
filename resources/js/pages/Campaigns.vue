<template>
    <div class="pt-12 pb-4 px-4">

        <div v-if="paymentSuccess"
             class="w-full max-w-lg bg-white px-6 py-8 mt-8 mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-3xl lg:p-10">
            <h3 class="text-2xl text-gray-900 sm:text-3xl sm:leading-9">
                Payment Successful!
            </h3>
            <p class="mt-6 text-base text-gray-900">
                Thanks for purchasing, please check your email to enable your shared campaign!
            </p>
            <meme class="m-auto mt-4 max-w-full"/>

            <p class="mt-6 mb-2 text-base text-gray-900">
                Please spread the word and share this tracker with the community!
            </p>
            <share-icons :url="url" :black="true"/>
        </div>

        <template v-if="!loggedIn && !paymentSuccess">
            <div class="mt-8 max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-3xl lg:flex">
                <div class="bg-white px-6 py-8 lg:flex-shrink-1 lg:p-10 lg:flex-1">
                    <h3 class="text-2xl text-gray-900 sm:text-3xl sm:leading-9">
                        1 year license
                    </h3>
                    <p class="mt-6 text-base text-gray-900">
                        Synchronised progress with all party members, all changes made are instantly available for
                        users with access to the shared campaign. By purchasing this license you support this
                        project! *
                    </p>
                    <div class="mt-8">
                        <div class="flex items-center">
                            <h4 class="flex-shrink-0 pr-4 bg-white text-sm leading-5 tracking-wider font-semibold uppercase text-indigo-600">
                                What's included
                            </h4>
                            <div class="flex-1 border-t-2 border-gray-200"></div>
                        </div>
                        <ul class="mt-8 lg:grid lg:grid-cols-2 lg:col-gap-5 lg:row-gap-5">
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
                                    Supports all modern devices
                                </p>
                            </li>
                            <li class="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                                <div class="flex-shrink-0">
                                    <inline-svg src="icons/check"/>
                                </div>
                                <p class="ml-3 text-sm leading-5 text-gray-700">
                                    Support the project
                                </p>
                            </li>
                            <li class="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                                <div class="flex-shrink-0">
                                    <inline-svg src="icons/check"/>
                                </div>
                                <p class="ml-3 text-sm leading-5 text-gray-700">
                                    1 year license
                                </p>
                            </li>
                        </ul>
                        <p class="mt-6 text-sm text-gray-700">
                            When purchasing multiple licenses, you can manage multiple campaigns!<br>
                            Licenses aren't renewed automatically.
                        </p>
                    </div>
                </div>
                <div class="py-8 px-6 text-center bg-gray-200 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                    <div class="font-title mt-4 flex items-center justify-center text-5xl leading-none text-gray-900">
                      <span>
                        €4.99
                      </span>
                        <span class="ml-3 text-xl leading-7 font-medium text-gray-500">
                        EUR
                      </span>
                    </div>
                    <div class="mt-6">
                        <purchase>
                            <div class="rounded-md shadow">
                                <a href="#"
                                   class="flex items-center justify-center uppercase px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                                    {{ $t('Buy shared campaign') }}
                                </a>
                            </div>
                        </purchase>
                    </div>
                    <p class="mt-4 text-sm leading-5 hidden">
                        <a href="#" class="font-medium text-gray-500 underline">
                            Learn about our membership policy
                        </a>
                    </p>
                </div>
            </div>
        </template>

        <div class="bg-black2-25 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
            <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left">
                Campaigns
            </h1>

            <campaign-list></campaign-list>

            <div class="flex items-center">
                <purchase>
                    <button type="button" class="mt-4 mdc-button mdc-button--raised">
                        {{ $t('Buy shared campaign') }}
                    </button>
                </purchase>
            </div>
        </div>

        <div class="m-auto w-full max-w-3xl lg:flex">
            <div class="bg-black2-25 p-4 rounded-lg mt-8 lg:mr-4 lg:flex-1">
                <add-shared-campaign :init-code="initCode"/>
            </div>

            <div class="bg-black2-25 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl lg:ml-4 lg:flex-1">
                <request-login-link/>
            </div>
        </div>

        <div class="bg-black2-25 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
            <h2 class="text-xl">How does it work?</h2>
            <ul class="list-disc ml-4 leading-relaxed">
                <li>Click on
                    <purchase class="inline link">
                        Add shared campaign
                    </purchase>
                </li>
                <li>After purchasing a license you'll receive a link in your email</li>
                <li>Click on the link in the email to add your new shared campaign!</li>
                <li class="mt-3">Click on <span class="link" @click="shareCurrentStory">Share</span>
                    to give access to your party members
                </li>
                <li>All changes made by any party member will be synchronised! 🎉</li>
            </ul>
        </div>

        <div class="bg-black2-25 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
            <h2 class="text-xl">Support the project</h2>
            <p class="text-base">
                {{ !loggedIn ? '* ' : '' }}
                All content is available for free, your local progress can be manually shared via the share button. The
                paid version provides an automatic sync feature, progress doesn't have to be shared manually anymore!
                This covers the costs maintaining this app for the community, if you enjoy using the storyline tracker,
                please consider
                <purchase class="inline link">purchasing a license.</purchase>
            </p>
        </div>
    </div>
</template>

<script>
    import Helpers from "../services/Helpers";
    import StoryRepository from "../repositories/StoryRepository";

    const queryString = require('query-string');

    export default {
        data() {
            return {
                loggedIn: Helpers.loggedIn(),
                paymentSuccess: false,
                initCode: '',
                url: process.env.MIX_APP_URL,
                storyRepository: new StoryRepository
            }
        },
        beforeMount() {
            this.paymentSuccess = this.isPaymentSuccess();
            this.applyShareCode();
        },
        mounted() {
            Helpers.removeQueryString();
        },
        destroyed() {

        },
        methods: {
            isPaymentSuccess() {
                return location.search.includes('payment_success');
            },
            applyShareCode() {
                let parsed = queryString.parse(location.search);

                if (typeof parsed.code !== 'undefined') {
                    this.initCode = parsed.code
                }
            },
            shareCurrentStory() {
                this.$bus.$emit('open-share-campaign-code-modal', this.storyRepository.current());
            }
        }
    }
</script>
