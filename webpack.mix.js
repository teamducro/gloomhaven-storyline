let mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

mix.js('assets/js/app.js', 'public/js/')
    .sass('assets/sass/app.scss', 'public/css/')
    .options({
        processCssUrls: false,
        postCss: [tailwindcss('./tailwind.config.js')],
    })
    .setPublicPath('public')
    .override(config => {
        config.module.rules.find(rule => rule.test.test('.svg')).exclude = /\.svg$/;

        config.module.rules.push({
            test: /\.svg$/,
            use: [{loader: 'html-loader'}]
        })
    });
