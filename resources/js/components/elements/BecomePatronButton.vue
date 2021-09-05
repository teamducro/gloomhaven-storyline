<template>
    <div :class="{'theme-transparent': transparent}">
        <div class="flex justify-center">
            <a class="sc-fubCfw iyzAZC" color="primary" tabindex="0" type="button"
               :href="'https://www.patreon.com/bePatron?u=28660319&redirect_uri='+href+'&utm_medium=widget'"
               role="button" target="_blank" rel="noopener noreferrer">
                <div class="sc-jSgupP igehoY">
                    <div class="sc-gsTCUz ifOjUa">
                        <span class="sc-bdfBwQ jYrJuV">
                            <svg viewBox="0 0 569 546"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <circle cx="362.589996" cy="204.589996" fill="white"
                                            r="204.589996"></circle>
                                    <rect height="545.799988" width="100" x="0"
                                          y="0" fill="white"></rect>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <div class="sc-iBPRYJ dJjbTG"></div>
                    {{ text }}
                </div>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: "Become a patron"
        },
        transparent: {
            type: Boolean,
            default: false
        }
    },
    data: () => {
        return {
            href: location.href
        }
    }
}
</script>

<style scoped lang="scss">

.theme-transparent .iyzAZC {
    background-color: transparent;
    border: 1px solid white;
}

.theme-large .iyzAZC {
    font-size: 1.1rem;
}

.iyzAZC {
    -webkit-appearance: none;
    -webkit-box-align: center;
    align-items: center;
    backface-visibility: hidden;
    background-color: rgb(255, 66, 77);
    border-radius: 9999px;
    border: 1px solid rgb(255, 66, 77);
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    font-weight: 500;
    height: unset;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 0.3rem 1rem;
    position: relative;
    pointer-events: unset;
    text-align: center;
    text-decoration: none;
    text-transform: none;
    transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1) 0s;
    user-select: none;
    white-space: unset;
    width: 100%;
    color: rgb(255, 255, 255);
    font-size: 0.875rem;
}

.haKoEY {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 2000;
    flex-direction: column;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    display: none;
}

.igehoY {
    -webkit-box-align: center;
    align-items: center;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    visibility: visible;
}

.ifOjUa {
    align-self: center;
    -webkit-box-align: center;
    align-items: center;
    display: inline-flex;
    filter: none;
    cursor: unset;
    vertical-align: unset;
    height: unset;
    width: unset;
}

.dJjbTG {
    height: 1px;
    width: 0.5rem;
}

.jYrJuV, .jYrJuV svg {
    height: 1rem;
    width: 1rem;
}

.jYrJuV svg {
    align-self: center;
    fill: transparent;
    stroke-width: 1.2px;
}
</style>
