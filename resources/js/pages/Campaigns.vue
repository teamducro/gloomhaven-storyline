<template>
    <div class="pt-12 pb-4 px-4">
        <div class="bg-black2-25 p-4 rounded-lg m-auto mt-4 w-full max-w-3xl">
            <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left">
                Campaigns
            </h1>

            <campaign-list></campaign-list>

            <div class="flex flex-col md:flex-row items-center">
                <button type="button" class="mt-4 mdc-button mdc-button--raised">
                    <i class="material-icons mdc-button__icon" aria-hidden="true">add</i>
                    {{ $t('Add shared campaign') }}
                </button>
            </div>

            <div v-if="loggedIn"
                 class="mt-8 max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-3xl lg:flex">
                <div class="bg-white px-6 py-8 lg:flex-shrink-1 lg:p-10 lg:flex-1">
                    <h3 class="text-2xl text-gray-900 sm:text-3xl sm:leading-9">
                        Annual Membership
                    </h3>
                    <p class="mt-6 text-base text-gray-900">
                        Synchronised progress with all party members, all changes made are instantly available for users
                        with access to the shared campaign. By purchasing this license you support this project! *
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
                        </ul>
                        <p class="mt-6 text-sm text-gray-700">
                            When purchasing multiple licenses, you can manage multiple campaigns!
                        </p>
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
                    <div class="mt-6">
                        <div class="rounded-md shadow">
                            <a href="#"
                               class="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                                Get Access
                            </a>
                        </div>
                    </div>
                    <p class="mt-4 text-sm leading-5">
                        <a href="#" class="font-medium text-gray-500 underline">
                            Learn about our membership policy
                        </a>
                    </p>
                </div>
            </div>

            <h2 class="text-xl mt-6 mb-2">Support the project</h2>
            <p class="text-sm">
                * All content is available for free, your local progress can be manually shared via the share button
                in
                the menu. The paid version provides an automatic sync feature, progress doesn't have to be shared
                manually anymore! This covers costs maintaining this app for the community, if you enjoy using the
                storyline tracker, please consider <a class="link">purchasing a licence</a>.
            </p>

            <add-shared-campaign/>
            <request-login-link/>

            <h2 class="text-xl mt-8 mb-2">Synchronise progress</h2>
            <p class="text-lg mb-1">How does it work?</p>
            <ul class="list-disc ml-4 leading-relaxed">
                <li>Click on <span class="link">Add shared campaign</span></li>
                <li>After purchasing a licence you'll receive a link in your email</li>
                <li>Click on the link in the email to add your new shared campaign!</li>
                <li class="mt-3">Click on <span class="link" @click="shareCurrentStory">Share</span>
                    to give access to your party members
                </li>
                <li class="text-lg">All changes made by any party member will be synchronised! 🎉</li>
            </ul>

        </div>
    </div>
</template>

<script>
    import Helpers from "../services/Helpers";
    import StoryRepository from "../repositories/StoryRepository";

    export default {
        data() {
            return {
                loggedIn: Helpers.loggedIn(),
                storyRepository: new StoryRepository
            }
        },
        mounted() {

        },
        destroyed() {

        },
        methods: {
            shareCurrentStory() {
                this.$bus.$emit('open-share-campaign-code-modal', this.storyRepository.current());
            }
        }
    }
</script>
