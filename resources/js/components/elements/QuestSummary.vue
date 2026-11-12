<template>
    <i18n-t :keypath="quest.description" tag="div">
        <template v-for="n in 20" v-slot:[n]>
            <p class="mb-4">
                {{ $t(quest.translationKey() + '.sections.' + n) }}
            </p>
        </template>
    </i18n-t>
</template>

<script>
import Quest from "../../models/Quest";

export default {
    props: {
        quest: {
            type: Quest,
            required: true
        }
    }
}
</script>
