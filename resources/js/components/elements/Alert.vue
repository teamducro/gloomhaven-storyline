<template>
    <div class="rounded-md mt-4 py-2 pr-4 pl-3"
         :class="{'bg-green-50': type === 'success', 'bg-red-50': type === 'error', 'bg-yellow-50': type === 'warning'}">
        <div class="flex">
            <div class="flex-shrink-0">
                <inline-svg v-if="type === 'success'" src="icons/check"></inline-svg>
                <inline-svg v-else src="icons/alert"></inline-svg>
            </div>
            <div class="ml-3">
                <div class="text-sm leading-5">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'success' // success,error,warning
        }
    }
}
</script>
