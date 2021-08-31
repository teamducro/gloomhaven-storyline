const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

module.exports = {
    mode: 'jit',
    purge: ['./resources/**/*.html', './resources/**/*.vue', './resources/**/*.js', './resources/**/*.svg'],
    theme: {
        extend: {
            fontFamily: {default: ['Nyala', 'sans-serif'], title: ['Pirata One', 'Nyala', 'sans-serif']},
            inset: {
                '1/2': '50%',
                'area-inset-top': 'env(safe-area-inset-top, 0)',
                'area-inset-right': 'env(safe-area-inset-right, 0)',
                'area-inset-bottom': 'env(safe-area-inset-bottom, 0)',
                'area-inset-left': 'env(safe-area-inset-left, 0)',
            },
            spacing: {
                '.5': '0.125rem',
                11: '2.75rem',
                14: '3.5rem',
                28: '7rem',
                30: '7.5rem',
                32: '8rem',
                36: '9rem',
                '1/2': '50%',
                '1/4': '25%',
                'area-inset-top': 'env(safe-area-inset-top, 0)',
                'area-inset-right': 'env(safe-area-inset-right, 0)',
                'area-inset-bottom': 'env(safe-area-inset-bottom, 0)',
                'area-inset-left': 'env(safe-area-inset-left, 0)',
            },
            height: {
                '1/2': '50%',
                '2px': '2px'
            },
            maxWidth: {
                'party': '1041px'
            },
            screens: {
                xs: '430px',
                'sheet-break-lg': '872px',
                lgh: {'raw': '(min-height: 600px)'}
            },
            zIndex: {
                1: '1',
                5: '5'
            },
            lineHeight: {
                '12': '3rem',
            },
            fontSize: {
                xxs: ['0.5rem', '0.75rem'],
            },
            colors: {
                primary: '#3771E0',
                'primary-dark': '#2356b7',
                secondary: '#018786',
                patreon: '#ff424d',
                background: '#000',
                surface: '#111',
                'dark-background': '#1b1b1b',
                complete: '#3B8585',
                incomplete: '#A13C2F',
                required: '#E9A678',
                gold: '#E2A246',
                'light-gray': '#E0E0E0',
                black2: {
                    10: 'rgba(0, 0, 0, .10)',
                    25: 'rgba(0, 0, 0, .25)',
                    50: 'rgba(0, 0, 0, .50)',
                    75: 'rgba(0, 0, 0, .75)',
                },
                white2: {
                    25: 'rgba(255, 255, 255, .25)',
                    50: 'rgba(255, 255, 255, .50)',
                    60: 'rgba(255, 255, 255, .60)',
                    75: 'rgba(255, 255, 255, .75)',
                    87: 'rgba(255, 255, 255, .87)',
                },
                red: {...colors.red, 50: 'rgba(255, 100, 100, .5)'},
                green: {...colors.green, 50: 'rgba(100, 255, 100, .5)'},
                yellow: {...colors.yellow, 50: 'rgba(236, 202, 75, .5)'},
                gray: colors.coolGray,
            },
            boxShadow: {
                'slight-white': '0px 0px 20px 5px rgba(255,255,255,0.1)',
                white: '0px 0px 20px 5px rgba(255,255,255,0.2)',
            },
            margin: {
                7: '1.75rem',
                18: '4.5rem'
            },
            rotate: {
                '270': '270deg',
            }
        },
        order: {
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
            9: '9',
            10: '10',
            11: '11',
            12: '12',
            13: '13',
            14: '14',
            15: '15',
            16: '16',
            17: '17',
            18: '18',
            19: '19',
            20: '20'
        }
    }
}
