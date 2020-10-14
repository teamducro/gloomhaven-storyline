<template>
    <a :href="mailto" @click="setMailto" @touchstart="setMailto" class="link">
        <slot/>
    </a>
</template>

<script>
export default {
    data() {
        return {
            mailto: ''
        }
    },
    mounted() {
    },
    methods: {
        setMailto() {
            if (!this.mailto) {
                this.mailto = 'mailto:' + this.generateEmail();
            }
        },
        generateEmail() {
            const coded = "Gt33Z9T@efZZpDh6vF-GTZ9rfYFv.dZp";
            const key = "bHMO7kgGvwAKXFPuxTWd1hfSrZBYmj3UEqNRIsez650nL28tQc4alDyo9iCVpJ";
            const shift = coded.length;
            let link = "";

            for (let i = 0; i < coded.length; i++) {
                if (key.indexOf(coded.charAt(i)) === -1) {
                    let ltr = coded.charAt(i);
                    link += (ltr);
                } else {
                    let ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length;
                    link += (key.charAt(ltr));
                }
            }

            return link;
        }
    }
}
</script>
