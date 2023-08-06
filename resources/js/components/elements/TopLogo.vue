<template>
    <div class="relative logo">
        <webp v-if="game === 'fh'" src="/img/logos/fh.png" alt="Frosthaven" width="250" height="37"></webp>
        <webp v-else-if="game === 'fc'" src="/img/logos/fc.png" alt="Forgotten Circles" width="250" height="51"></webp>
        <webp v-else-if="game === 'jotl'" src="/img/logos/jotl.png" alt="Jaws of the Lion" width="250" height="20"></webp>
        <webp v-else-if="game === 'cs'" src="/img/logos/cs.png" alt="Crimson Scales" width="250" height="35"></webp>
        <webp v-else src="/img/logos/gh.png" alt="Gloomhaven" width="250" height="37"></webp>
        <ribbon v-if="user">Pro</ribbon>
    </div>
</template>

<script>
    import User from "../../apiModels/User";

    export default {
        props: {
            user: {
                type: User
            },
            game: {
                type: String
            }
        }
    }
</script>
