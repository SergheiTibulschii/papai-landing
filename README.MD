## Quick start

### Setup

Make sure you have Node v.16 or above installed.

```
npm install
```

Copy `.env.default` to `.env` if it exists.


### Production

To build an optimized version of the application in `/dist/` use command:

```
gulp build:production
```

or just use shortcut:

```
gulp
```

### Development

To build an app and start a local web server with automatic Live Reloading use this command:

```
gulp serve
```

### Basic configuration

Build settings are located in `config.development.js` and `config.production.js`.

Webpack's configuration are located in `webpack.development.js` and `webpack.production.js`.

The locale can be switched using `locale` parameter in the build configuration file and can be overridden by the `FORCE_LOCALE` environment variable.

Configuration files can be switched using the `NODE_ENV` environment variable.

### File structure

```bash
├── /dist/                      # Production directory (minified, optimized and compiled files)
└── /src/                       # The source code of the application
    ├── /icons/                 # SVG icons
    ├── /js/                    # JavaScript source
    ├── /locales/               # JSON localizations strings
    ├── /pug/                   # Pug files
        └── /_includes/         # Pug partials
    ├── /scss/                  # SCSS styles
    ├── /static/                # Root of static files (fonts, images, videos, etc.)
├── /tmp/                       # Temporary served files
├── .env                        # Environment variables
├── .editorconfig               # IDE style configuration
├── babel.config                # Babel config
├── config.development.js       # Development build configuration
├── config.production.js        # Production build configuration
├── webpack.development.js      # Webpack development configuration
├── webpack.production.js       # Webpack production configuration
├── package.json                # Project metadata and dependencies
```

### Gulp tasks

`gulp serve` build an app and start a local web server with automatic Live Reloading

`gulp build` build an app

`gulp build:production` build an optimized app in `/dist/` for production use

`gulp pug` compile Pug files

`gulp sass` compile Sass files

`gulp js` compile JS files

`gulp svgsprites` compile svg sprites from icons located in `/src/icons/`

`gulp copy:static` copy static files from `/src/static/` to `/dist/`

`gulp browsersync` start local web server

`gulp watch` start watching task

`gulp clean` remove temporary files

`gulp clean:dist` clean `/dist/` directory

## Advanced configuration

### HTML

Cuberto Gulp Builder uses [Pug](https://pugjs.org/) as an HTML preprocessor.

The following options are available in the build configuration:

| parameter | type | description |
| :--- | :---: | :--- |
| `locale` | `string` | default locale |
| `ext` | `string` | extension of `.html` files  |
| `pugOptions` | `object` | [compiler options](https://pugjs.org/api/reference.html) |
| `fetch` | `function` | callable to fetch external data |
| `templates` | `array` | templates map |

The following constants are available in each Pug file:

| variable | type | description |
| :--- | :---: | :--- |
| `__` | `object` | current locale data |
| `$$` | `object` | fetched data (only if use fetch) |
| `ENV` | `object` | environment variables |
| `NODE_ENV` | `string` | current `NODE_ENV` |
| `PACKAGE` | `object` | `package.json` contents |
| `LOCALE` | `string` | current locale |
| `$` | `string` | current page key (only in templates) |

#### Locales

All locales should be stored in `./src/locales/{LANG}/*.json`.

Cuberto Gulp Builder merges all `.json` files from current locale directory into one object, and you can access it from `__` constant in each template.

The locale can be switched using `locale` parameter in the build configuration file and can be overridden by the `FORCE_LOCALE` environment variable.

#### Fetch

Cuberto Gulp Builder can receive additional dynamic data (e.g. from backend) to generate pages using the `fetch` configuration parameter. It may help to implement a simple SSG/JamStack solution.

Callable function can be async.

The received data will be available in the `$$` constant in each Pug file.

**Example config**:

```javascript
const axios = require('axios');

const fetchBackendData = async(locals, config) => {
    const response = await axios.get(`https://api.example.com/posts/`);
    return response.data;
};

module.exports = {
    // ..... //
    pug: {
        src: ['./src/pug/**/*.pug', '!./src/pug/_includes/**/*'],
        dest: './tmp/',
        locale: 'en',
        ext: false,
        fetch: fetchBackendData
    }
    // .... //
}
```

#### Dynamic templates

Cuberto Gulp Builder can dynamically generate HTML pages based on any object (locales, fetched data or any array).

| variable | type | description |
| :--- | :---: | :--- |
| `src` | `string` | template path |
| `target` | `any` | iterable target |
| `key` | `string` | iterable target key (optional) |
| `dirname` | `string` | destination directory (`$` - replaced with a current key) |
| `basename` | `string` | destination filename (`$` - replaced with a current key) |

**Example config**:

```javascript
module.exports = {
    // ..... //
    pug: {
        src: ['./src/pug/**/*.pug', '!./src/pug/_includes/**/*'],
        dest: './tmp/',
        locale: 'en',
        ext: false,
        // Generate posts from array
        templates: [
            {
                src: './src/pug/_includes/templates/post.pug',
                target: [
                    {
                        'id': 1,
                        'title': 'Post #1'
                    },
                    {
                        'id': 2,
                        'title': 'Post #2'
                    }
                ],
                key: 'id',
                dirname: 'posts/$',
                basename: 'index'
            }
        ]
    }
    // .... //
}
```

```javascript
module.exports = {
    // ..... //
    pug: {
        src: ['./src/pug/**/*.pug', '!./src/pug/_includes/**/*'],
        dest: './tmp/',
        locale: 'en',
        ext: false,
        // Generate posts from locales
        templates: [
            {
                src: './src/pug/_includes/templates/post.pug',
                target: '__.posts',
                key: 'id',
                dirname: 'posts/$',
                basename: 'index'
            }
        ]
    }
    // .... //
}
```

```javascript
const axios = require('axios');

const fetchBackendData = async(locals, config) => {
    const response = await axios.get(`https://api.example.com/posts/`);
    return response.data;
};

module.exports = {
    // ..... //
    pug: {
        src: ['./src/pug/**/*.pug', '!./src/pug/_includes/**/*'],
        dest: './tmp/',
        locale: 'en',
        ext: false,
        // Generate posts from fetched data
        fetch: fetchBackendData,
        templates: [
            {
                src: './src/pug/_includes/templates/post.pug',
                target: '$$.posts',
                key: 'id',
                dirname: 'posts/$',
                basename: 'index'
            }
        ]
    }
    // .... //
}
```

```javascript
module.exports = {
    // ..... //
    pug: {
        src: ['./src/pug/**/*.pug', '!./src/pug/_includes/**/*'],
        dest: './tmp/',
        locale: 'en',
        ext: false,
        // Generate posts from array
        templates: [
            {
                src: './src/pug/_includes/templates/post.pug',
                target: [1,3,4,5],
                dirname: 'tutorials',
                basename: '$'
            }
        ]
    }
    // .... //
}
```

### Styles

Cuberto Gulp Builder uses [Sass](https://sass-lang.com/) as a CSS preprocessor.

[Autoprefixer](https://github.com/postcss/autoprefixer), [clean-css](https://github.com/jakubpawlowicz/clean-css) and [RTLCSS](https://github.com/MohammadYounes/rtlcss) is also included. Clean-css and RTLCSS disabled by default in the development environment to increase assembly speed.

There are several default entry points: `./src/scss/*.scss`, but usually only `main.scss` is used. Component files must be located in subdirectories.

The following options are available in the build configuration:

| parameter | type | description |
| :--- | :---: | :--- |
| `maps` | `boolean` | use [Sourcemap](https://www.npmjs.com/package/gulp-sourcemaps) |
| `autoprefixer` | `boolean` | use [Autoprefixer](https://github.com/postcss/autoprefixer)  |
| `rtl` | `boolean` | use [RTLCSS](https://github.com/MohammadYounes/rtlcss) |
| `cleanCss` | `boolean` | use [clean-css](https://github.com/jakubpawlowicz/clean-css) |
| `sassOptions` | `object` | [node-sass options](https://github.com/sass/node-sass#options) |
| `cleanCssOptions` | `object` | [clean-css options](https://github.com/jakubpawlowicz/clean-css#constructor-options) |
| `autoprefixerOptions` | `object` | [Autoprefixer options](https://github.com/postcss/autoprefixer#options) |

### SVG sprites

All svg icons should be stored in `./src/icons/`.

Make sure the color of all shapes is set to `currentColor`, so that you can dynamically change it using CSS.

Use this command to compile icons without running a full build:

```
gulp svgsprite
```

By default, spritesheet located in:

`{WORKDIR}/assets/sprites/svgsprites.svg`.

Use this mixin in Pug to insert an icon:

```jade
+svgicon("ICON_NAME", [insertinline = true | false])
```

### JS

All javascript proceeds by [webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/).

Webpack config localed in `./webpack.{NODE_ENV}.js`.

Babel config located in `./babel.config.js`.

Entrypoint, by default: `./src/js/app.js`.

Use this command to compile JS without running a full build:

```
gulp js
```

[Read webpack docs](https://webpack.js.org/concepts/).

[Read Babel docs](https://babeljs.io/docs/en/).

### Browsersync

Browsersync creates a small server for local development with live reloading. If Browsersync detects changes in code, it makes a local rebuild and reloads the page (complete or partial).

To build an app and start a local web server with automatic Live Reloading use this command:

```
gulp serve
```

To start a local web server without running a full build, use the command:

```
gulp browsersync
```

In build configuration you can configure browsersync options.

[See Browsersync options](https://browsersync.io/docs).
