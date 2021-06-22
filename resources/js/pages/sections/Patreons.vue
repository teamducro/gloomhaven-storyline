<template>
    <section id="patreons" class="bg-white pt-16">
        <div class="container max-w-3xl mx-auto p-4 sm:p-6">
            <h1 class="w-full my-2 text-4xl lg:text-5xl font-bold leading-tight text-center text-gray-800">
                Patreon
            </h1>
            <div class="w-full mb-4">
                <div class="h-2px mx-auto gradient w-32 sm:w-64 opacity-75 my-0 py-0 rounded shadow"></div>
            </div>

            <p class="w-full mt-8 text-center text-gray-600">
                Support the project by joining the Patreon. You'll earn my deepest gratitude.
                You make it possible for me to maintain the tracker and keep the new features coming.
            </p>
            <p class="w-full mt-2 text-center text-gray-600">
                Patrons can create unlimited shared campaigns. In addition they can vote on new features and are
                notified when new features roll out!
            </p>

            <becomePatronButton class="mt-8 flex justify-center"></becomePatronButton>

            <p class="w-full mt-8 text-center text-gray-600">
                Our community works when we support one another. Special thanks to our patrons.
            </p>

            <div v-if="patrons.length" class="flow-root mt-6">
                <ul class="-my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <li v-for="patron in filteredPatrons" class="py-4 border-b border-gray-300 relative">
                        <div class="flex items-center px-4">
                            <span v-if="patron.is_gold" class="absolute top-0 left-0">
                                <span class="text-patreon material-icons">star</span>
                            </span>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">
                                    {{ patron.name }}
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="mt-8" v-if="patrons.length > limitedCount">
                <a href="#" @click.prevent="viewAll = !viewAll"
                   class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    {{ viewAll ? 'View less' : 'View all' }}
                </a>
            </div>
        </div>
    </section>
</template>

<script>
import PatronRepository from "../../apiRepositories/PatronRepository";

export default {
    data() {
        return {
            patronRepository: new PatronRepository,
            patrons: [],
            viewAll: false,
            limitedCount: 8
        }
    },
    computed: {
        filteredPatrons() {
            return this.viewAll ? this.patrons : this.patrons.slice(0, this.limitedCount);
        }
    },
    async mounted() {
        this.patrons = await this.patronRepository.list();
    },
    methods: {}
}
</script>
