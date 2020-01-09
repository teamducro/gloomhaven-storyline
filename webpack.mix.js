let mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

mix.js('assets/js/app.js', 'public/js/')
    .sass('assets/sass/app.scss', 'public/css/')
    .options({
        processCssUrls: false,
        postCss: [tailwindcss('./tailwind.config.js')],
    })
    .setPublicPath('public');
