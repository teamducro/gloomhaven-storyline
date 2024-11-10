<template>
    <section id="faq" class="bg-white pt-16">
        <div class="container max-w-5xl mx-auto p-4 sm:p-6">
            <h1 class="w-full my-2 text-4xl lg:text-5xl lg:leading-tight font-bold leading-tight text-center text-gray-800">
                Frequently asked questions
            </h1>
            <div class="w-full mb-4">
                <div class="h-2px mx-auto gradient w-32 sm:w-64 opacity-75 my-0 py-0 rounded shadow"></div>
            </div>

            <p class="w-full mt-8 text-center text-gray-500">Can’t find the answer you’re looking for?
                <email-me class="link">Send me an e-mail.</email-me>
                <br>
                For game related questions, check the official
                <a class="link"
                   :href="game === 'fh' ? 'https://cephalofairgames.github.io/frosthaven-faq/' : 'https://www.boardgamegeek.com/thread/1897763/official-faq-game-no-rules-questions-please'">
                    {{ $t(game) }} FAQ
                </a>.
            </p>

            <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-8">
                    <div v-for="item in faq">
                        <dt class="text-lg leading-6 font-medium text-gray-800" v-html="item.q"/>
                        <dd class="mt-2 text-base text-gray-500" v-html="item.a"/>
                    </div>
                </dl>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            appUrl: process.env.MIX_APP_URL,
            game: process.env.MIX_MAIN_GAME,
            faq: []
        }
    },
    mounted() {
        this.faq = [
            {
                q: 'How do I get access to my shared campaign?',
                a: 'After purchasing a license you will receive an e-mail with a link to login. If your need to login ' +
                    'after this link has expired you may use the "Restore Purchase" form on the ' +
                    '<a class="link" href="' + this.appUrl + '/#/campaigns">Campaigns page</a>.'
            },
            {
                q: 'Why was a scenario not unlocked?',
                a: 'Scenarios are only unlocked if they are mentioned in the "New locations" section of the scenario. ' +
                    'The location numbers in the story text are just reminders. They themselves don\'t unlock anything.'
            },
            {
                q: 'I purchased a shared campaign, do I have to send a new share link every time?',
                a: 'No, you only need to send it once. Only if browser data is cleared or you want to use an other device ' +
                    'an other link should be sent.'
            },
            {
                q: 'I am using the free version, do I have to send a new share link every time?',
                a: 'Yes, progress is not shared amongst devices.'
            },
            {
                q: 'Do I need to backup a shared campaign?',
                a: 'No, shared campaigns are backed-up automatically. If your device fails you can always continue where ' +
                    'you left off or even rollback unwanted changes.'
            },
            {
                q: 'How do I backup a free campaign?',
                a: 'You can send a share link to yourself to back it up, it might come in handy in an emergency.'
            },
        ]
    },
    methods: {}
}
</script>
