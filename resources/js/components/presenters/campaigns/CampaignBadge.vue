<template>
    <div>
        <bedge v-if="story.has_expired" expired>
            {{ $t('Expired') }}
            {{ story.expires_at.format("ll") }}
        </bedge>
        <bedge v-else-if="story.expires_soon" class="opacity-75 white">
            {{ $t('Expires soon') }}
            {{ story.expires_at.format("ll") }}
        </bedge>
        <bedge v-else-if="!story.is_shared" class="opacity-75 white">
            {{ $t('Expires') }}
            {{ story.expires_at.fromNow() }}
        </bedge>
    </div>
</template>

<script>

export default {
    props: {
        story: {
            type: Object
        }
    },
    data() {
        return {}
    }
}
</script>
