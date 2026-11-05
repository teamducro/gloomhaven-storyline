import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import crypto from 'crypto';
import fs from 'fs';
import dayjs from 'dayjs';

// Two separate builds (BUNDLE=app|website) so each gets exactly one css file and no shared chunks.
export default defineConfig(({mode}) => {
    const env = {...loadEnv(mode, process.cwd(), 'MIX_'), ...process.env};
    const mainGame = env.MIX_MAIN_GAME || 'gh';
    const bundle = process.env.BUNDLE || 'app';
    const inProduction = mode === 'production';

    return {
        base: '/',
        envPrefix: 'MIX_',
        publicDir: false,
        plugins: [
            vue({
                template: {
                    transformAssetUrls: {includeAbsolute: false},
                    // Vue 2 kept the whitespace between inline elements; Vue 3 condenses it by default.
                    compilerOptions: {whitespace: 'preserve'},
                },
            }),
            postBuild(bundle, mainGame, inProduction),
        ],
        resolve: {
            extensions: ['.mjs', '.js', '.json', '.vue'],
            alias: [
                // In-DOM root templates in index.html need the runtime compiler.
                {find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js'},
                {find: /^~(.*)$/, replacement: '$1'},
            ],
        },
        css: {
            postcss: {plugins: [tailwindcss('./tailwind.config.js'), autoprefixer({remove: false})]},
            preprocessorOptions: {
                scss: {
                    loadPaths: ['node_modules'],
                    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div'],
                    quietDeps: true,
                },
            },
        },
        define: {
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        },
        build: {
            outDir: 'public',
            emptyOutDir: false,
            cssCodeSplit: false,
            minify: inProduction,
            sourcemap: !inProduction,
            chunkSizeWarningLimit: 5000,
            rollupOptions: {
                input: {[bundle]: `resources/js/${bundle}.js`},
                output: {
                    // Hashed in production instead of ?v=: lazy chunks import the entry by file name, and a
                    // query string would make the browser load (and mount) the app twice.
                    entryFileNames: inProduction ? 'js/[name]-[hash].js' : 'js/[name].js',
                    chunkFileNames: 'js/[name]-[hash].js',
                    assetFileNames: asset => asset.names?.[0]?.endsWith('.css')
                        ? `css/${bundle}.css`
                        : 'assets/[name]-[hash][extname]',
                },
            },
        },
    };
});

// Port of the old webpack.mix.js post-build steps.
function postBuild(bundle, mainGame, inProduction) {
    let buildFiles = [];
    let entryFile;

    return {
        name: 'post-build',
        apply: 'build',
        async buildStart() {
            // Hashed chunks would pile up otherwise; the app build runs first, so it cleans for both.
            if (bundle === 'app' && !this.meta.watchMode) {
                for (const dir of ['public/js', 'public/css', 'public/assets']) {
                    await fs.promises.rm(dir, {recursive: true, force: true});
                }
            }
        },
        generateBundle(options, output) {
            entryFile = Object.values(output).find(file => file.type === 'chunk' && file.isEntry).fileName;
            // Lazy language chunks are left out, as before.
            buildFiles = Object.values(output)
                .filter(file => file.type === 'chunk' && !file.moduleIds.every(id => id.includes('/resources/js/lang/')))
                .map(file => '/' + file.fileName)
                .concat(`/css/${bundle}.css`);
        },
        async closeBundle() {
            if (bundle === 'app') {
                for (const dir of [`resources/public-${mainGame}`, 'resources/img', 'resources/svg', 'resources/fonts']) {
                    await fs.promises.cp(dir, dir.startsWith('resources/public-') ? 'public' : dir.replace('resources', 'public'),
                        {recursive: true, preserveTimestamps: true, filter: isChanged});
                }

                await replace('public/sitemap.xml', /release-date/g, dayjs().format('YYYY-MM-DD'));
                await replace('public/service-worker.js', /cache-version/g, md5(`public/${entryFile}`));
                await replace('public/service-worker.js', /'build-files',/, buildFiles.map(file => `'${file}',`).join('\n    '));
            }

            await replaceInHtml(new RegExp(`/js/${bundle}(-[\\w-]+)?\\.js`, 'g'), `/${entryFile}`);
            await versionFile(`public/css/${bundle}.css`, inProduction);
        },
    };
}

async function versionFile(path, applyVersion) {
    const file = path.split('/').pop();
    const pattern = new RegExp(file.replace('.', '\\.') + '(\\?v=[a-f0-9]{32})?', 'g');
    const to = applyVersion ? file + '?v=' + md5(path) : file;

    await replaceInHtml(pattern, to);
}

async function replaceInHtml(from, to) {
    for (const html of ['public/index.html', 'public/tracker/index.html']) {
        await replace(html, from, to);
    }
}

// resources/img is ~800MB: only copy files that are new or differ from the previous build's copy.
async function isChanged(src, dest) {
    const [from, to] = await Promise.all([fs.promises.stat(src), fs.promises.stat(dest).catch(() => null)]);

    return from.isDirectory() || !to || from.size !== to.size || from.mtimeMs !== to.mtimeMs;
}

function md5(path) {
    return crypto.createHash('md5').update(fs.readFileSync(path)).digest('hex');
}

async function replace(file, from, to) {
    const content = await fs.promises.readFile(file, 'utf8');
    await fs.promises.writeFile(file, content.replace(from, to));
}
