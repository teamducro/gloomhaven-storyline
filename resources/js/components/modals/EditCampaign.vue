<template>
    <modal ref="modal" :titleDivider="true">
        <template v-if="story" v-slot:title>
            <span class="inline-flex w-full">
                {{ story.name }}
                <span class="flex ml-auto items-center space-x-4">
                    <campaign-badge class="hidden sm:block" :story="story"></campaign-badge>
                    <span class="ml-auto material-icons">
                        {{ story.has_expired ? 'cloud_off' : 'cloud_queue' }}
                    </span>
                </span>
            </span>
        </template>
        <template v-if="story" v-slot:content>
            <campaign-badge class="pt-4 flex justify-end sm:hidden" :story="story"></campaign-badge>

            <div>
                <label class="w-full mt-4 mdc-text-field mdc-text-field--filled" ref="campaign-name">
                    <span class="mdc-text-field__ripple"></span>
                    <input class="mdc-text-field__input" :aria-labelledby="'name-label'+story.id"
                           v-model="name" type="text" name="name" @keyup="changeName" @input="changeName">
                    <span class="mdc-floating-label" :id="'name-label'+story.id">Campaign name</span>
                    <span class="mdc-line-ripple"></span>
                </label>
            </div>
        </template>
    </modal>
</template>

<script>
import StoryRepository from "../../apiRepositories/StoryRepository";
import {MDCTextField} from "@material/textfield/component";

export default {
    data() {
        return {
            story: null,
            storyRepository: new StoryRepository,
            nameField: null,
            name: null,
            errors: null,
        }
    },
    mounted() {
        this.$bus.$on('open-edit-campaign-modal', this.open);
    },
    methods: {
        changeName: _.debounce(function () {
            this.errors = null;
            this.story.name = this.name;
            this.storyRepository.update(this.story)
                .then(story => {
                    this.$bus.$emit('load-campaign-data');
                })
                .catch(e => {
                    this.errors = e.response.data;
                });
        }, 500),
        async open(story) {
            this.story = story;
            this.name = this.story.name;
            this.$refs['modal'].open();
            await this.$nextTick();
            this.nameField = new MDCTextField(this.$refs['campaign-name']);
        }
    }
}
</script>
