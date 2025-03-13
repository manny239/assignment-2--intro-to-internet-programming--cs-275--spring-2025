const { src, dest, watch, series, parallel } = require(`gulp`);
const sass = require(`gulp-sass`)(require(`sass`));
const sourcemaps = require(`gulp-sourcemaps`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const cleanCSS = require(`gulp-clean-css`);
const terser = require(`gulp-terser`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-styleint`);

/**
 * Lint SCSS files using Stylelint
 */
let lintStyles = () => {
    return src(`src/scss/**/*.scss`)
        .pipe(
            stylelint({
                reporters: [{formatter: `string`, console: true}],
            })
        );
};
exports.lintStyles=lintStyles;

/**
 * Lint JavaScript files using ESLint
 */
let lintScripts = ()=> {
    return src(`src/js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};
exports.lintScripts=lintScripts;

/**
 * Compile SCSS → CSS (development mode, with sourcemaps)
 */
let stylesDev = () => {
    return src(`src/scss/**/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on(`error`, sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write(`.`))
        .pipe(dest(`dist/css`));
};
exports.stylesDev = stylesDev;

/**
 * Copy JS (development mode, no minification, with sourcemaps)
 */
let scriptsDev = () => {
    return src(`scr/js/**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write(`.`))
        .pipe(dest(`dist/js`));
};
exports.scriptsDev=scriptsDev;

/**
 * Compile & minify SCSS for production
 */
let stylesProd = () => {
    return src(`src/scss/**/*.scss`)
        .pipe(sass.sync().on(`error`, sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(dest(`dist/css`));
};
exports.stylesProd = stylesProd;

/**
   * Lint & minify JavaScript for production
   */
let scriptsProd = () => {
    return src(`src/js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(terser())
        .pipe(dest(`dist/js`));
};
exports.scriptsProd = scriptsProd;

/**
   * Watch for changes in SCSS/JS, re-run lint + dev tasks
   */
let watchFiles = () => {
    watch(`src/scss/**/*.scss`, series(lintStyles, stylesDev));
    watch(`src/js/**/*.js`, series(lintScripts, scriptsDev));
};
exports.watchFiles = watchFiles;

/**
   * Development Task:
   *  1) Lint styles/scripts
   *  2) Compile dev files
   *  3) Watch for changes
   */
let dev = series(
    parallel(lintStyles, lintScripts),
    parallel(stylesDev, scriptsDev),
    watchFiles
);
exports.dev = dev;

/**
   * Production Task:
   *  1) Lint styles/scripts
   *  2) Compile & minify
   */
let build = series(
    parallel(lintStyles, lintScripts),
    parallel(stylesProd, scriptsProd)
);

exports.build = build;

/**
   * Default Task:
   *  - Runs the dev task when you type `gulp`
   */
exports.default = dev;
