<template>
    <div class="sm:w-30">
        <!-- Mobile menu -->
        <div class="relative sm:hidden pb-2 mb-4 border-b border-white2-25">
            <select id="mobile-character-menu" name="mobile-character-menu" @change="mobileSelect"
                    class="block w-full absolute opacity-0 font-title text-md -ml-1">
                <option value="party">
                    {{ $t('Party sheet') }}
                </option>
                <optgroup :label="$t('Characters')">
                    <option v-for="characters in sheet.characters"
                            :selected="selected === characters.uuid"
                            :value="characters.uuid">
                        {{ characters.name }}
                    </option>
                </optgroup>
                <optgroup v-if="!isLocalCampaign && Object.keys(sheet.archivedCharacters).length"
                          :label="$t('Retired')">
                    <option v-for="characters in sheet.archivedCharacters"
                            :selected="selected === characters.uuid"
                            :value="characters.uuid">
                        {{ characters.name }}
                    </option>
                </optgroup>
                <option value="items">
                    {{ $t('Items') }}
                </option>
            </select>
            <label v-if="selectedCharacter" for="mobile-character-menu" class="flex items-center">
                <character-icon class="flex-shrink-0 w-5 mr-2" :character="selectedCharacter.id"/>
                <span class="font-title">{{ selectedCharacter.name }}</span>
                <span class="ml-auto material-icons">keyboard_arrow_down</span>
            </label>
        </div>

        <!-- Desktop menu -->
        <div class="hidden sm:block">
            <ul class="space-y-6 mb-4">
                <li v-for="character in sheet.characters" :key="character.uuid" class="flow-root">
                    <a @click.stop.prevent="select(character.uuid)" href="#"
                       class="-m-3 p-3 flex items-center rounded-md text-base font-medium hover:bg-black2-50 transition ease-in-out duration-150"
                       :class="{'text-white bg-black2-25': selected === character.uuid, 'text-white2-75': selected !== character.uuid}">
                        <character-icon class="flex-shrink-0 w-5 mr-2" :character="character.id"/>
                        <span class="overflow-hidden">{{ character.name }}</span>
                    </a>
                </li>
            </ul>

            <template v-if="!isLocalCampaign && Object.keys(sheet.archivedCharacters).length">
                <collapse :initialOpen="selected in sheet.archivedCharacters">
                    <template slot="trigger">
                        <div class="my-3 font-title">{{ $t('Retired') }}</div>
                    </template>

                    <ul class="space-y-6 mb-4">
                        <li v-for="character in sheet.archivedCharacters" :key="character.uuid" class="flow-root">
                            <a @click.stop.prevent="select(character.uuid)" href="#"
                               class="-m-3 p-3 flex items-center rounded-md text-base font-medium hover:bg-black2-50 transition ease-in-out duration-150"
                               :class="{'text-white bg-black2-25': selected === character.uuid, 'text-white2-75': selected !== character.uuid}">
                                <character-icon class="flex-shrink-0 w-5 mr-2" :character="character.id"/>
                                <span>{{ character.name }}</span>
                            </a>
                        </li>
                    </ul>
                </collapse>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        selected: String,
        sheet: Object,
        isLocalCampaign: Boolean
    },
    data() {
        return {}
    },
    computed: {
        selectedCharacter() {
            if (!this.selected) {
                return;
            }
            return this.sheet.characters[this.selected] || this.sheet.archivedCharacters[this.selected];
        }
    },
    methods: {
        select(uuid) {
            if (this.selected === uuid) {
                return;
            }

            if (uuid.length < 36) {
                this.$router.push(uuid);
            } else {
                this.$emit('select', uuid)
            }
        },
        mobileSelect(e) {
            this.select(e.target.value);
        }
    }
}
</script>
