let mix = require('laravel-mix');
const glob = require('glob-all');
const tailwindcss = require('tailwindcss');
const md5File = require('md5-file/promise');
const replace = require('replace-in-file');

if (process.env.theme) {
    mix.sass('assets/sass/theme.scss', 'public/css/', {
        sassOptions: {
            includePaths: ['./node_modules']
        }
    })
        .setPublicPath('public')
        .then(() => {
            versionFile('public/css/theme.css');
        })
} else {
    mix.js('assets/js/app.js', 'public/js/')
        .sass('assets/sass/app.scss', 'public/css/')
        .copy('assets/img', 'public/img')
        .copy('assets/fonts', 'public/fonts')
        .options({
            processCssUrls: false,
            postCss: [tailwindcss('./tailwind.config.js')],
            purifyCss: {
                paths: glob.sync([
                    path.join(__dirname, 'assets/js/**/*.vue'),
                    path.join(__dirname, 'public/index.html')
                ])
            }
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
        });
}

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
