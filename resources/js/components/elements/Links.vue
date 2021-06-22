<template>
    <div class="w-full" @click="$emit('click')">
        <router-link :to="{name: 'info', params: {contribute: true}}">
            <webp src="/img/character-sheets.png" width="100%"></webp>
        </router-link>
    </div>
</template>

<script>

export default {
    data() {
        return {}
    }
}
</script>
