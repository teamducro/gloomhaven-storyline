<template>
    <span>
        <template v-if="editing">
            <label class="mdc-text-field mdc-text-field--filled" ref="name">
                <span class="mdc-text-field__ripple"></span>
                <input class="mdc-text-field__input" :aria-labelledby="'name-label'+story.id"
                       v-model="name" type="text" name="name" @keyup="changeName" @input="changeName">
                <span class="mdc-floating-label" :id="'name-label'+story.id">Campaign name</span>
                <span class="mdc-line-ripple"></span>
            </label>
        </template>
        <template v-else>
            {{ name || story.name }}
        </template>
    </span>
</template>

<script>
    import Story from "../../../apiModels/Story";
    import StoryRepository from "../../../apiRepositories/StoryRepository";
    import {MDCTextField} from "@material/textfield/component";

    export default {
        props: {
            story: {
                type: Object,
                default: false
            },
            editing: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                storyRepository: new StoryRepository,
                nameField: null,
                name: null
            }
        },
        mounted() {
            if (this.editing) {
                this.onOpen();
            }
        },
        destroyed() {
            this.onClose();
        },
        watch: {
            editing(editing) {
                if (editing) {
                    this.onOpen();
                } else {
                    this.onClose();
                }
            }
        },
        methods: {
            changeName: _.debounce(async function () {
                this.story.name = this.name;
                await this.storyRepository.update(this.story);
                this.$bus.$emit('load-campaign-data');
            }, 500),
            async onOpen() {
                this.name = this.story.name;
                await this.$nextTick();
                this.nameField = new MDCTextField(this.$refs['name']);
            },
            onClose() {
                if (this.nameField) {
                    this.nameField.destroy();
                }
            },
        }
    }
</script>
