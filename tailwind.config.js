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
        colors: {
            transparent: 'transparent',
            current: 'currentColor',

            black: '#000',
            white: '#fff',

            gray: colors.trueGray,
            red: {
                100: '#fff5f5',
                200: '#fed7d7',
                300: '#feb2b2',
                400: '#fc8181',
                500: '#f56565',
                600: '#e53e3e',
                700: '#c53030',
                800: '#9b2c2c',
                900: '#742a2a',
            },
            orange: {
                100: '#fffaf0',
                200: '#feebc8',
                300: '#fbd38d',
                400: '#f6ad55',
                500: '#ed8936',
                600: '#dd6b20',
                700: '#c05621',
                800: '#9c4221',
                900: '#7b341e',
            },
            yellow: {
                100: '#fffff0',
                200: '#fefcbf',
                300: '#faf089',
                400: '#f6e05e',
                500: '#ecc94b',
                600: '#d69e2e',
                700: '#b7791f',
                800: '#975a16',
                900: '#744210',
            },
            green: {
                100: '#f0fff4',
                200: '#c6f6d5',
                300: '#9ae6b4',
                400: '#68d391',
                500: '#48bb78',
                600: '#38a169',
                700: '#2f855a',
                800: '#276749',
                900: '#22543d',
            },
            teal: {
                100: '#e6fffa',
                200: '#b2f5ea',
                300: '#81e6d9',
                400: '#4fd1c5',
                500: '#38b2ac',
                600: '#319795',
                700: '#2c7a7b',
                800: '#285e61',
                900: '#234e52',
            },
            blue: {
                100: '#ebf8ff',
                200: '#bee3f8',
                300: '#90cdf4',
                400: '#63b3ed',
                500: '#4299e1',
                600: '#3182ce',
                700: '#2b6cb0',
                800: '#2c5282',
                900: '#2a4365',
            },
            indigo: {
                100: '#ebf4ff',
                200: '#c3dafe',
                300: '#a3bffa',
                400: '#7f9cf5',
                500: '#667eea',
                600: '#5a67d8',
                700: '#4c51bf',
                800: '#434190',
                900: '#3c366b',
            },
            purple: {
                100: '#faf5ff',
                200: '#e9d8fd',
                300: '#d6bcfa',
                400: '#b794f4',
                500: '#9f7aea',
                600: '#805ad5',
                700: '#6b46c1',
                800: '#553c9a',
                900: '#44337a',
            },
            pink: {
                100: '#fff5f7',
                200: '#fed7e2',
                300: '#fbb6ce',
                400: '#f687b3',
                500: '#ed64a6',
                600: '#d53f8c',
                700: '#b83280',
                800: '#97266d',
                900: '#702459',
            },
        }
    }
}
