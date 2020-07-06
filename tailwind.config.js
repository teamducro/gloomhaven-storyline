const plugin = require('tailwindcss/plugin');
const {colors} = require('tailwindcss/defaultTheme');

module.exports = {
    purge: [
        './resources/**/*.html',
        './resources/**/*.vue',
        './resources/**/*.js',
        './resources/**/*.cvs'
    ],
    theme: {
        extend: {
            fontFamily: {
                default: ['Nyala', 'sans-serif'],
                title: ['Pirata One', 'Nyala', 'sans-serif'],
            },
            inset: {
                'area-inset-top': 'env(safe-area-inset-top, 0)',
                'area-inset-right': 'env(safe-area-inset-right, 0)',
                'area-inset-bottom': 'env(safe-area-inset-bottom, 0)',
                'area-inset-left': 'env(safe-area-inset-left, 0)'
            },
            spacing: {
                '.5': '0.125rem',
                28: '7rem',
                'area-inset-top': 'env(safe-area-inset-top, 0)',
                'area-inset-right': 'env(safe-area-inset-right, 0)',
                'area-inset-bottom': 'env(safe-area-inset-bottom, 0)',
                'area-inset-left': 'env(safe-area-inset-left, 0)'
            },
            screens: {
                xs: '400px',
                lgh: {'raw': '(min-height: 600px)'}
            },
            zIndex: {
                1: '1',
                5: '5'
            },
            lineHeight: {
                '12': '3rem',
            },
            colors: {
                primary: '#3771E0',
                secondary: '#018786',
                background: '#000',
                surface: '#111',
                complete: '#3B8585',
                incomplete: '#A13C2F',
                required: '#E9A678',
                gold: '#E2A246',
                'light-gray': '#E0E0E0',
                black2: {
                    25: 'rgba(0, 0, 0, .25)',
                    50: 'rgba(0, 0, 0, .50)',
                    75: 'rgba(0, 0, 0, .75)'
                },
                white2: {
                    25: 'rgba(255, 255, 255, .25)',
                    50: 'rgba(255, 255, 255, .50)',
                    75: 'rgba(255, 255, 255, .75)',
                    87: 'rgba(255, 255, 255, .75)'
                },
                red: {
                    ...colors.red,
                    50: 'rgba(255, 100, 100, .50)'
                },
                green: {
                    ...colors.green,
                    50: 'rgba(100, 255, 100, .50)'
                }
            }
        }
    },
    variants: {
        // accessibility: ['important', 'responsive', 'focus'],
        // alignContent: ['important', 'responsive'],
        // alignItems: ['important', 'responsive'],
        // alignSelf: ['important', 'responsive'],
        // appearance: ['important', 'responsive'],
        // backgroundAttachment: ['important', 'responsive'],
        backgroundColor: ['important', 'responsive', 'hover', 'focus'],
        // backgroundPosition: ['important', 'responsive'],
        // backgroundRepeat: ['important', 'responsive'],
        // backgroundSize: ['important', 'responsive'],
        // borderCollapse: ['important', 'responsive'],
        // borderColor: ['important', 'responsive', 'hover', 'focus'],
        // borderRadius: ['important', 'responsive'],
        // borderStyle: ['important', 'responsive'],
        // borderWidth: ['important', 'responsive'],
        // boxShadow: ['important', 'responsive', 'hover', 'focus'],
        // boxSizing: ['important', 'responsive'],
        // cursor: ['important', 'responsive'],
        // display: ['important', 'responsive'],
        // fill: ['important', 'responsive'],
        // flex: ['important', 'responsive'],
        // flexDirection: ['important', 'responsive'],
        // flexGrow: ['important', 'responsive'],
        // flexShrink: ['important', 'responsive'],
        // flexWrap: ['important', 'responsive'],
        // float: ['important', 'responsive'],
        // clear: ['important', 'responsive'],
        // fontFamily: ['important', 'responsive'],
        // fontSize: ['important', 'responsive'],
        // fontSmoothing: ['important', 'responsive'],
        // fontStyle: ['important', 'responsive'],
        // fontWeight: ['important', 'responsive', 'hover', 'focus'],
        // height: ['important', 'responsive'],
        // inset: ['important', 'responsive'],
        // justifyContent: ['important', 'responsive'],
        // letterSpacing: ['important', 'responsive'],
        // lineHeight: ['important', 'responsive'],
        // listStylePosition: ['important', 'responsive'],
        // listStyleType: ['important', 'responsive'],
        margin: ['important', 'responsive'],
        // maxHeight: ['important', 'responsive'],
        // maxWidth: ['important', 'responsive'],
        // minHeight: ['important', 'responsive'],
        // minWidth: ['important', 'responsive'],
        // objectFit: ['important', 'responsive'],
        // objectPosition: ['important', 'responsive'],
        // opacity: ['important', 'responsive', 'hover', 'focus'],
        // order: ['important', 'responsive'],
        // outline: ['important', 'responsive', 'focus'],
        // overflow: ['important', 'responsive'],
        // padding: ['important', 'responsive'],
        // placeholderColor: ['important', 'responsive', 'focus'],
        // pointerEvents: ['important', 'responsive'],
        // position: ['important', 'responsive'],
        // resize: ['important', 'responsive'],
        // stroke: ['important', 'responsive'],
        // strokeWidth: ['important', 'responsive'],
        // tableLayout: ['important', 'responsive'],
        // textAlign: ['important', 'responsive'],
        // textColor: ['important', 'responsive', 'hover', 'focus'],
        // textDecoration: ['important', 'responsive', 'hover', 'focus'],
        // textTransform: ['important', 'responsive'],
        // userSelect: ['important', 'responsive'],
        // verticalAlign: ['important', 'responsive'],
        // visibility: ['important', 'responsive'],
        // whitespace: ['important', 'responsive'],
        // width: ['important', 'responsive'],
        // wordBreak: ['important', 'responsive'],
        // zIndex: ['important', 'responsive'],
        // gap: ['important', 'responsive'],
        // gridAutoFlow: ['important', 'responsive'],
        // gridTemplateColumns: ['important', 'responsive'],
        // gridColumn: ['important', 'responsive'],
        // gridColumnStart: ['important', 'responsive'],
        // gridColumnEnd: ['important', 'responsive'],
        // gridTemplateRows: ['important', 'responsive'],
        // gridRow: ['important', 'responsive'],
        // gridRowStart: ['important', 'responsive'],
        // gridRowEnd: ['important', 'responsive'],
        // transform: ['important', 'responsive'],
        // transformOrigin: ['important', 'responsive'],
        // scale: ['important', 'responsive', 'hover', 'focus'],
        // rotate: ['important', 'responsive', 'hover', 'focus'],
        // translate: ['important', 'responsive', 'hover', 'focus'],
        // skew: ['important', 'responsive', 'hover', 'focus'],
        // transitionProperty: ['important', 'responsive'],
        // transitionTimingFunction: ['important', 'responsive'],
        // transitionDuration: ['important', 'responsive'],
    },
    plugins: [
        plugin(function ({addVariant}) {
            addVariant('important', ({container}) => {
                container.walkRules(rule => {
                    rule.selector = `.i-${rule.selector.slice(1)}`;
                    rule.walkDecls(decl => {
                        decl.important = true;
                    })
                })
            })
        })
    ]
};
