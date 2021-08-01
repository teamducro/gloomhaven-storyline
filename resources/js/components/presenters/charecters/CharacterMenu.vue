<template>
    <div class="w-40">
        <ul class="space-y-6 mb-4">
            <li v-for="character in sheet.characters" :key="character.id" class="flow-root">
                <a @click.stop.prevent="$emit('select', character.uuid)" href="#"
                   class="-m-3 p-3 flex items-center rounded-md text-base font-medium hover:bg-black2-50 transition ease-in-out duration-150"
                   :class="{'text-white bg-black2-25': selected === character.uuid, 'text-white2-75': selected !== character.uuid}">
                    <character-icon class="w-5 mr-2" :character="character.id"/>
                    <span>{{ character.name }}</span>
                </a>
            </li>
        </ul>

        <template v-if="user && Object.keys(sheet.archivedCharacters).length">
            <collapse :initialOpen="selected in sheet.archivedCharacters">
                <template slot="trigger">
                    <div class="my-3 font-title">{{ $t('Retired') }}</div>
                </template>

                <ul>
                    <li v-for="character in sheet.archivedCharacters" :key="character.id" class="flow-root">
                        <a @click.stop.prevent="$emit('select', character.uuid)" href="#"
                           class="-m-3 p-3 flex items-center rounded-md text-base font-medium hover:bg-black2-50 transition ease-in-out duration-150"
                           :class="{'text-white bg-black2-25': selected === character.uuid, 'text-white2-75': selected !== character.uuid}">
                            <character-icon class="w-5 mr-2" :character="character.id"/>
                            <span>{{ character.name }}</span>
                        </a>
                    </li>
                </ul>
            </collapse>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        selected: String,
        sheet: Object,
        user: Object
    }
}
</script>
