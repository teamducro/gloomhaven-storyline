<template>
    <webp v-if="thumbnail" :src="thumbnail" alt=""
          class="monster-icon w-8 h-8 rounded-full object-cover shrink-0"/>
    <span v-else class="monster-icon w-8 h-8 rounded-full shrink-0 inline-flex items-center justify-center bg-white2-10 text-sm"
          aria-hidden="true"></span>
</template>

<script>
import MonsterImages from "../../services/MonsterImages";

export default {
    props: {
        game: {type: String},
        monster: {type: String},
    },
    computed: {
        thumbnail() {
            return MonsterImages.thumbnail(this.game, this.monster);
        }
    }
}
</script>
