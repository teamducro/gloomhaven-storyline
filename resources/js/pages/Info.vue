<template>
    <div class="pt-12 pb-4 px-4">
        <div class="bg-black2-25 p-4 rounded-lg m-auto mt-4 w-full" style="max-width: 560px;">
            <h1 class="mb-4 text-xl">{{ $t('about us.title') }}</h1>

            <p>{{ $t('about us.text') }}</p>
            <div class="m-4">
                <webp src="/img/minis.jpg" alt="Gloomhaven minis"/>
            </div>

            <h2 class="mt-8 mb-4 text-lg">{{ $t('Open source') }}</h2>
            <a href="https://github.com/teamducro/gloomhaven-storyline">
                <button class="mdc-button mdc-button--raised">
                    <inline-svg src="icons/github.svg" class="mdc-button__icon" :classes="['w-full','h-full']"/>
                    <span class="mdc-button__label">GitHub</span>
                </button>
            </a>


            <h2 class="mt-8 mb-4 text-lg">{{ $t('Credits') }}</h2>
            <p class="mb-2">{{ $t('credits.thanks') }}</p>
            <ul class="list-disc ml-4">
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Gloomhaven assets by') }}
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/Cephalofair">
                            Isaac Childres</a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/thread/1733586/files-creation">
                        Files for creation</a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Chart layout by') }}
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/grimtoothy">
                            Grimtoothy</a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/filepage/177419/scenario-and-storyline-flowchart">
                        Scenario and Storyline Flowchart</a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Scenario summaries by') }}
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/DoctorBandage">
                            DoctorBandage</a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/geeklist/237840/gloomhaven-quest-log">
                        Gloomhaven Quest Log</a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">{{ $t('Map coordinates by') }}
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/Dargalin">
                            Dargalin</a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/thread/1880969/online-tracker-campaign-party-and-characters">
                        Online map & campaign tracker</a>
                </li>
            </ul>

            <p class="my-4">
                {{ $t('credits.license') }} BY-NC-SA 4.0
                (<a class="link"
                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/">https://creativecommons.org/licenses/by-nc-sa/4.0/</a>)
            </p>
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
