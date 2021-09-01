let mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');
const md5File = require('md5-file/promise');
const replace = require('replace-in-file');
const dayjs = require('dayjs');

mix.extend('i18n', new class {
        webpackRules() {
            return [
                {
                    resourceQuery: /blockType=i18n/,
                    type: 'javascript/auto',
                    loader: '@kazupon/vue-i18n-loader',
                },
            ];
        }
    }(),
);


mix.i18n()
    .js('resources/js/app.js', 'js')
    .js('resources/js/gtm.js', 'js')
    .js('resources/js/website.js', 'js')
    .sass('resources/sass/app.scss', 'css')
    .sass('resources/sass/website.scss', 'css')
    .sass('resources/sass/theme.scss', 'css', {
        sassOptions: {
            includePaths: ['./node_modules']
        }
    })
    .copy('resources/public', 'public')
    .copy('resources/img', 'public/img')
    .copy('resources/fonts', 'public/fonts')
    .options({
        processCssUrls: false,
        postCss: [tailwindcss('./tailwind.config.js')],
        autoprefixer: {remove: false}
    })
    .setPublicPath('public')
    .override(config => {
        config.module.rules.find(rule => rule.test.test('.svg')).exclude = /\.svg$/;

        config.module.rules.push({
            test: /\.svg$/,
            use: [{loader: 'html-loader'}]
        })
    })
    .then(async () => {
        await versionFile('public/js/website.js', mix.inProduction());
        await versionFile('public/js/app.js', mix.inProduction());
        await versionFile('public/js/gtm.js', mix.inProduction());
        await versionFile('public/css/app.css', mix.inProduction());
        await versionFile('public/css/website.css', mix.inProduction());
        await versionFile('public/css/theme.css', mix.inProduction());

        // set date in sitemap
        for (let i = 0; i < 20; i++) {
            await replace({files: 'public/sitemap.xml', from: /release-date/, to: dayjs().format('YYYY-MM-DD')});
        }
    });

async function versionFile(path, applyVersion) {
    const file = path.split('/').pop();
    const pattern = new RegExp(file.replace('.', '\\.') + '(\\?v=[a-f0-9]{32})?', 'g');
    let to = applyVersion
        ? file + '?v=' + await md5File(path)
        : file;

    return replace({files: ['public/index.html', 'public/tracker/index.html'], from: pattern, to: to});
}
