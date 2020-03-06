let mix = require('laravel-mix');
require('laravel-mix-purgecss');
const rootPath = Mix.paths.root.bind(Mix.paths);
const tailwindcss = require('tailwindcss');
const md5File = require('md5-file/promise');
const replace = require('replace-in-file');


mix.js('resources/js/app.js', 'public/js/')
    .sass('resources/sass/app.scss', 'public/css/')
    .sass('resources/sass/theme.scss', 'public/css/', {
        sassOptions: {
            includePaths: ['./node_modules']
        }
    })
    .purgeCss({
        content: [
            rootPath('public/index.html'),
            rootPath('resources/**/*.js'),
            rootPath('resources/**/*.vue')
        ],
        whitelistPatterns: [/^mdc-/, /-active$/, /-enter$/, /-leave-to$/]
    })
    .copy('resources/img', 'public/img')
    .copy('resources/fonts', 'public/fonts')
    .options({
        processCssUrls: false,
        postCss: [tailwindcss('./tailwind.config.js')]
    })
    .setPublicPath('public')
    .override(config => {
        config.module.rules.find(rule => rule.test.test('.svg')).exclude = /\.svg$/;

        config.module.rules.push({
            test: /\.svg$/,
            use: [{loader: 'html-loader'}]
        })
    })
    .then(() => {
        versionFile('public/js/app.js');
        versionFile('public/css/app.css');
        versionFile('public/css/theme.css');
    });

function versionFile(path) {
    const file = path.split('/').pop();
    const pattern = new RegExp(file.replace('.', '\\.') + '\\?v=[a-f0-9]{32}', 'g');
    md5File(path).then(hash => {
        replace({
            files: 'public/index.html',
            from: pattern,
            to: file + '?v=' + hash,
        });
    });
}
