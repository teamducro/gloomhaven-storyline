<template>
    <div>
        <div class="pt-20">
            <div class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                <!--Left Col-->
                <div class="flex flex-col w-full md:w-1/2 justify-center items-start text-center md:text-left">
                    <p class="uppercase tracking-loose w-full">Find the right scenario to play</p>
                    <h1 class="my-4 text-5xl font-bold leading-tight">Gloomhaven Storyline Tracker!</h1>
                    <p class="leading-normal text-2xl mb-8">Keep track of your progress of completed and unlocked
                        scenarios!</p>

                    <div class="flex">
                        <purchase class="mr-2">
                            <a class="block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                                Buy shared campaign
                            </a>
                        </purchase>
                        <a :href="this.appUrl"
                           class="block text-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 leading-none font-medium text-white hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150">
                            Open storyline
                        </a>
                    </div>
                </div>
                <!--Right Col-->
                <div class="w-full md:w-1/2 py-6 text-center">
                    <webp class="w-full z-50" src="img/gloomhaven-cover.png" alt="Gloomhaven starter characters"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
