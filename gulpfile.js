/*!
 * Cuberto Gulp Builder
 * https://cuberto.com/
 *
 * @version 9.3.0
 * @author Cuberto, Artem Dordzhiev (Draft)
 */

const fs = require('fs');
const sass = require('sass');
const del = require('del');
const glob = require('glob');
const path = require('path');
const dotenv = require('dotenv');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gulpPlumber = require('gulp-plumber');
const gulpPug = require('gulp-pug');
const gulpRename = require('gulp-rename');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpRtlCss = require('gulp-rtlcss');
const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpSass = require('gulp-sass')(sass);
const gulpCleanCss = require('gulp-clean-css');
const gulpSvgSprite = require('gulp-svg-sprite');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackCache = {};
const i18n = require('i18next');

/* Init environment */
dotenv.config();

/* Helpers */
function getNodeEnv() {
    return process.env.NODE_ENV || 'development';
}

function getConfig(section) {
    const config = require(`./config.${getNodeEnv()}.js`);
    return section ? (config[section] ? config[section] : {}) : config;
}

function getPkg() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
}

function getLocale(locale) {
    const result = {};
    const files = glob.sync(`./src/locales/*.json`);
    files.forEach((file) => {
        const name = path.parse(file).name;
        const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
        if (name === 'index') {
            Object.assign(result, json);
        } else {
            result[name] = json;
        }
    });

    return result;
}

function flushModule(path) {
    return (callback) => {
        delete require.cache[require.resolve(path)];
        callback();
    };
}

/* Primary tasks */
gulp.task('default', (done) => {
    gulp.series('build:production')(done);
});

gulp.task('serve', (done) => {
    gulp.series('clean', gulp.parallel('svgsprites', 'sass', 'js'), 'pug', 'browsersync', 'watch')(done);
});

gulp.task('build', (done) => {
    gulp.series('clean:dist', gulp.parallel('svgsprites', 'sass', 'js', 'copy:static'), 'pug')(done);
});

gulp.task('build:production', (done) => {
    process.env.NODE_ENV = 'production';
    gulp.series('clean:dist', gulp.parallel('svgsprites', 'sass', 'js', 'copy:static'), 'pug')(done);
});

/* Pug task */
const getPugTask = (cached) => {
    return async () => {
        const config = getConfig('pug');
        const locale = process.env.FORCE_LOCALE || config.locale;
        const localeData = getLocale(locale);
        const pugOptions = Object.assign(
            {
                locals: {},
            },
            config.pugOptions
        );
        const streams = [];

        Object.assign(pugOptions.locals, {
            fs: fs,
            ENV: process.env,
            NODE_ENV: getNodeEnv(),
            PACKAGE: getPkg(),
            LOCALE: locale,
            __: localeData,
        });

        if (config.fetch) pugOptions.locals.$$ = await config.fetch(pugOptions.locals, config);

        streams.push(
            new Promise((resolve) => {
                return gulp.src(config.src, {since: cached ? gulp.lastRun('pug') : undefined})
                    .pipe(gulpPlumber())
                    .pipe(gulpPug(pugOptions))
                    .pipe(gulpIf(!!config.ext, gulpRename({extname: config.ext})))
                    .pipe(gulp.dest(config.dest))
                    .on('end', resolve);
            })
        );

        if (config.templates) {
            config.templates.forEach((template) => {
                const target = template.target;
                const inheritPugOptions = Object.assign({}, pugOptions, template.pugOptions);

                let arr = target.split('.').reduce((p, i) => p[i], inheritPugOptions.locals);
                if (!Array.isArray(arr)) arr = Object.keys(arr);

                arr.map((item) => {
                    const key = template.key ? item[template.key] : item;
                    const dirname = template.dirname.replace('$', key);
                    const filename = template.filename ? template.filename.replace('$', key) : 'index';

                    inheritPugOptions.locals.$ = key;

                    streams.push(
                        new Promise((resolve) => {
                            return gulp.src(template.src, {since: cached ? gulp.lastRun('pug') : undefined})
                                .pipe(gulpPlumber())
                                .pipe(gulpPug(inheritPugOptions))
                                .pipe(gulpRename({basename: filename, dirname}))
                                .pipe(gulpIf(!!config.ext, gulpRename({extname: config.ext})))
                                .pipe(gulp.dest(config.dest))
                                .on('end', resolve);
                        })
                    );
                });
            });
        }

        await Promise.all(streams);
        browserSync.reload();
    };
};

gulp.task('pug', getPugTask());
gulp.task('pug:cached', getPugTask(true));

/* Sass task */
gulp.task('sass', () => {
    const config = getConfig('sass');

    return gulp.src(config.src)
        .pipe(gulpIf(config.maps, gulpSourcemaps.init()))
        .pipe(gulpSass(config.sassOptions))
        .pipe(gulpIf(config.autoprefixer, gulpAutoprefixer(config.autoprefixerOptions)))
        .pipe(gulpIf(config.rtl, gulpRtlCss()))
        .pipe(gulpIf(config.cleanCss, gulpCleanCss(config.cleanCssOptions)))
        .pipe(gulpIf(config.maps, gulpSourcemaps.write('.')))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.stream());
});

/* JS (webpack) task */
gulp.task('js', async () => {
    const config = getConfig('js');
    webpackCache.config = webpackCache.config || require(`./webpack.${getNodeEnv()}.js`);
    webpackCache.compiler = webpackCache.compiler || webpack(webpackCache.config);

    return new Promise((resolve, reject) => {
        webpackCache.compiler.run((err, stats) => {
            if (err) return reject(new Error(err));
            if (stats.hasErrors()) {
                const error = new Error(stats.toString(config.stats));
                error.showStack = false;
                return reject(error);
            } else {
                console.log(stats.toString(config.stats));
                resolve();
            }
        });
    });
});

/* Icons task */
gulp.task('svgsprites', () => {
    const config = getConfig('svgsprites');

    return gulp.src(config.src)
        .pipe(gulpSvgSprite(config.svgSpriteOptions))
        .pipe(gulp.dest(config.dest));
});

/* Browsersync task */
gulp.task('browsersync', async () => {
    const config = getConfig('browsersync');

    browserSync.init(config);
});

/* Watcher task */
gulp.task('watch', () => {
    const config = getConfig('watch');
    // A double star (glob) in the path incrementally increase rebuild time on Windows. Use polling instead.
    // https://github.com/gulpjs/gulp/issues/1878
    const options = {usePolling: process.platform === 'win32', interval: 70};

    if (config.sass) gulp.watch(config.sass, options, gulp.series('sass'));
    if (config.js) gulp.watch(config.js, options, gulp.series('js'));
    if (config.pug) gulp.watch(config.pug, options, gulp.series('pug'));
    if (config.pugCached) gulp.watch(config.pugCached, options, gulp.series('pug:cached'));
    if (config.svgsprites) gulp.watch(config.svgsprites, gulp.series('svgsprites'));
    if (config.watchConfig) {
        gulp.watch(
            `./config.${getNodeEnv()}.js`,
            gulp.series(flushModule(`./config.${getNodeEnv()}.js`), 'js', 'pug')
        );
    }
});

/* FS tasks */
gulp.task('clean', () => {
    return del(['./tmp/**/*'], {dot: true});
});

gulp.task('clean:dist', () => {
    return del(['./dist/**/*'], {dot: true});
});

gulp.task('copy:static', () => {
    return gulp.src(['./src/static/**/*'], {dot: true}).pipe(gulp.dest('./dist/'));
});
