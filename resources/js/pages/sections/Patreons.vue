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
            <p class="w-full mt-8 text-center text-gray-600">
                Patrons can vote on new features and are notified when new features roll out!
                In addition they can Create unlimited shared campaigns.
            </p>

            <becomePatronButton class="mt-8 flex justify-center"></becomePatronButton>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            patreons: []
        }
    },
    mounted() {

    },
    methods: {}
}
</script>
