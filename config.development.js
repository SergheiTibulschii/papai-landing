module.exports = {
    pug: {
        src: ['./src/pug/**/*.pug', '!./src/pug/_includes/**/*'],
        dest: './tmp/',
        locale: 'en',
        ext: false,
        pugOptions: {
            basedir: './src/pug/',
            pretty: false
        }
    },
    sass: {
        src: './src/scss/*.scss',
        dest: './tmp/assets/css/',
        maps: true,
        autoprefixer: true,
        rtl: false,
        cleanCss: false,
        sassOptions: {
            includePaths: 'node_modules',
        },
    },
    js: {
        stats: {
            colors: true,
            modules: false,
            timings: false,
            errorDetails: false,
        }
    },
    svgsprites: {
        src: './src/icons/*.svg',
        dest: './tmp/assets/sprites/',
        svgSpriteOptions: {
            mode: {
                symbol: {
                    dest: '',
                    sprite: 'svgsprites.svg',
                },
            },
        },
    },
    browsersync: {
        server: ['./tmp', './src/static'],
        notify: false,
        ui: false,
        online: false,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false,
        },
    },
    watch: {
        sass: ['./src/scss/**/*.scss'],
        js: ['./src/js/**/*.*'],
        pug: ['./src/pug/_includes/**/*', './src/locales/**/*.json'],
        pugCached: ['./src/pug/**/*.pug', '!./src/pug/_includes/**/*'],
        svgsprites: ['./src/icons/*.svg'],
        watchConfig: true,
    },
};