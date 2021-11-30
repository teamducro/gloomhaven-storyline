<template>
    <div v-if="show"
         class="fixed z-10 bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
        <transition name="fade" @after-leave="show = false">
            <div v-if="isOpen" @click="close" class="fixed inset-0 transition-opacity">
                <div class="absolute inset-0 bg-gray-400 opacity-75"></div>
            </div>
        </transition>

        <transition name="modal">
            <div v-if="isOpen"
                 class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full sm:p-6"
                 role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div>
                    <div class="mx-auto flex items-center justify-center w-full">
                        <webp src="/img/donations-banner.jpg" alt="Gloomhaven donations banner"/>
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                            {{ $t('donations.' + paragraph + '.title') }}
                        </h3>
                        <div class="mt-2 text-sm leading-5 text-gray-400">
                            <p class="mb-2">
                                {{ $t('donations.' + paragraph + '.1') }}<br>{{ $t('donations.' + paragraph + '.2') }}
                            </p>
                            <p>
                                {{ $t('donations.' + paragraph + '.3') }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6">
                      <span class="flex flex-col w-full rounded-md shadow-sm">
                          <router-link to="/campaigns">
                              <button type="submit" @click="close"
                                      class="w-full rounded-md border border-transparent p-2 bg-blue-600 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                              {{ $t('Read more') }}
                              </button>
                          </router-link>
                          <span @click="close" class="text-sm text-gray-400 text-center mt-4 cursor-pointer">
                              {{ $t('donations.close') }}
                          </span>
                      </span>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import store from "store/dist/store.modern";
import Helpers from "../../services/Helpers";

export default {
    data() {
        return {
            show: false,
            isOpen: false,
            timesWithoutDonations: 4,
            paragraph: Math.ceil(Math.random() * 2),
            loggedIn: Helpers.loggedIn(),
        }
    },
    mounted() {
        this.$bus.$on('open-donations', this.open);
        this.$bus.$on('close-donations', this.close);
    },
    methods: {
        async open() {
            if (this.shouldOpen()) {
                this.show = true;
                await this.$nextTick();
                this.isOpen = true;
            }
        },
        close() {
            this.isOpen = false;
        },
        shouldOpen() {
            // Only show the Donations modal in production and hasn't purchased a licence
            if (process.env.NODE_ENV !== 'production' || this.loggedIn) {
                return false;
            }

            let count = store.get('donations') || 0;
            if (count > this.timesWithoutDonations) {
                count = 0;
            }
            store.set('donations', count + 1);

            return (count === this.timesWithoutDonations);
        }
    }
}
</script>
