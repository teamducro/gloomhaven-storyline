<template>
    <div id="code-progress"
         class="circle-loader" :class="percentage < 20 ? 'low' : ''">
        <div class="circle-loader-inner">
            <div class="circle-loader-half">
                <div class="circle-loader-rotate">
                    <div class="circle-loader-circle"></div>
                </div>
            </div>
            <div class="circle-loader-half">
                <div class="circle-loader-rotate">
                    <div class="circle-loader-circle"></div>
                </div>
            </div>
        </div>
        <span class="label">
            <span v-for="letter in label">{{ letter }}</span>
        </span>
    </div>
</template>

<script>
    export default {
        props: {
            label: {
                type: String
            },
            percentage: {
                type: Number
            }
        },
        watch: {
            percentage(percentage) {
                this.update(percentage);
            }
        },
        mounted() {
            this.update(this.percentage);
        },
        methods: {
            update(percentage) {
                const angle = (percentage / 100) * 360;
                let angle1 = ((angle > 180) ? 180 : angle % 180) - 180;
                let angle2 = ((angle > 180) ? angle % 180 : 0) - 180;
                if (angle === 360) {
                    angle2 = 0;
                }
                if (angle === 180) {
                    angle1 = 0;
                }
                const angle1_inner = -angle1;
                const angle2_inner = -180 - angle2;
                const circle_rotate = $('#code-progress .circle-loader-rotate');
                const circle_inner = $('#code-progress .circle-loader-circle');
                circle_rotate[0].style.transform = 'rotate(' + Math.floor(angle1).toString() + 'deg)';
                circle_rotate[1].style.transform = 'rotate(' + Math.floor(angle2).toString() + 'deg)';
                circle_inner[0].style.transform = 'rotate(' + Math.floor(angle1_inner).toString() + 'deg)';
                circle_inner[1].style.transform = 'rotate(' + Math.floor(angle2_inner).toString() + 'deg)';
            }
        }
    }
</script>

<style scoped lang="scss">

    .circle-loader {
        width: 150px;
        height: 150px;
        position: relative;

        .label {
            display: block;
            width: 76%;
            height: 76%;
            background: #222;
            border-radius: 100%;
            position: absolute;
            top: 12%;
            left: 12%;
            text-align: center;
            font-size: 1.3rem;
            line-height: 0;
            padding-top: 38%;
            color: white;

            > span:nth-child(3) {
                letter-spacing: .5rem;
            }

        }
    }

    .circle-loader-inner {
        width: 84%;
        height: 84%;
        position: absolute;
        top: 8%;
        left: 8%;
        border-radius: 100%;
    }

    .circle-loader-half {
        width: 50%;
        height: 100%;
        position: absolute;
        left: 50%;
        top: 0;
        overflow: hidden;
        background: #333;
        border-radius: 0 100% 100% 0/0 50% 50% 0;
    }

    .circle-loader-half:last-child {
        transform-origin: 0 50%;
        transform: rotate(-180deg);
    }

    .circle-loader-rotate {
        width: 100%;
        height: 100%;
        transform-origin: 0 50%;
        transform: rotate(-180deg);
        overflow: hidden;
        position: absolute;
    }

    .circle-loader-half:first-child .circle-loader-rotate {
        transform: rotate(-0deg);
    }

    .circle-loader-half:last-child .circle-loader-rotate {
        transform: rotate(-180deg);
    }

    .circle-loader-circle {
        width: 200%;
        height: 100%;
        position: absolute;
        top: 0;
        left: -100%;
        border-radius: 100%;
        background: linear-gradient(to bottom, #5da7a7, theme('colors.complete'));
        box-shadow: inset 0 1px 0px rgba(255, 255, 255, .5);
    }

    .circle-loader.low .circle-loader-circle {
        background: linear-gradient(to bottom, #c1584a, theme('colors.incomplete'));
    }

    .circle-loader-half:first-child .circle-loader-circle {
        transform: rotate(-0deg);
    }

    .circle-loader-half:last-child .circle-loader-circle {
        transform: rotate(-0deg);
    }
</style>
