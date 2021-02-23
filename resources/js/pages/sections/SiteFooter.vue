<template>
    <footer class="">
        <hr class="border-b border-gray-100 opacity-25 my-0 py-0">
        <div
            class="w-full container mx-auto mt-0 py-8 flex flex-wrap items-center justify-center md:justify-between md:px-4">
            <div class="text-center md:text-left">
                <a class="text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
                   href="/">
                    <webp class="inline" src="/img/gloomhaven-logo.png" alt="Gloomhaven" width="250" height="37"></webp>
                    <span class="hidden md:inline">Storyline</span>
                </a>
                <p class="text-xs">
                    Gloomhaven and all related properties and assets are owned by
                    <a class="link text-white" target="_blank" href="https://www.cephalofair.com">Cephalofair Games</a>
                </p>
            </div>

            <div class="mt-6 md:-ml-2 md:m-0">
                <ul class="list-reset flex md:flex-col">
                    <li>
                        <a href="/#pricing"
                           class="link text-white p-2">Pricing</a>
                    </li>
                    <li>
                        <a href="https://github.com/teamducro/gloomhaven-storyline"
                           target="_blank"
                           class="link text-white p-2">GitHub</a>
                    </li>
                    <li>
                        <email-me class="link text-white p-2">
                            Contact
                        </email-me>
                    </li>
                    <li>
                        <a :href="appUrl" class="link text-white p-2">App</a>
                    </li>
                </ul>
            </div>

        </div>
    </footer>
</template>

<script>
export default {
    props: {},
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
