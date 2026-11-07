<template>
    <div id="integrations" class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
        <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
            <i class="material-icons mr-4" aria-hidden="true">launch</i>
            {{ $t('integrations.title') }}
        </h1>

        <p class="text-base">{{ $t('integrations.text') }}</p>

        <ul>
            <li v-for="(label, code) in integrations">
                <checkbox-with-label :id="code + '-integration'"
                                     :label="$t(label)"
                                     v-model:checked="enabled[code]"
                                     :auto-disable="false"
                                     @change="store"/>
            </li>
        </ul>
    </div>
</template>

<script>
import store from "store/dist/store.modern";

export default {
    data() {
        const stored = store.get('integrations', {});
        const integrations = {'virtual-board': 'Virtual Board', 'ghs': 'ghs-export.button'};

        return {
            integrations,
            // Integrations are enabled unless turned off
            enabled: Object.fromEntries(Object.keys(integrations).map(code => [code, stored[code] !== false])),
        }
    },
    methods: {
        store() {
            store.set('integrations', this.enabled);
        }
    }
}
</script>
