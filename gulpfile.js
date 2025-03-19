"use strict";

const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const htmlmin = require("gulp-htmlmin");
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
//const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const stylelint = require("gulp-stylelint");
const eslint = require("gulp-eslint");
const babel = require("gulp-babel");
const browserSyncLib = require("browser-sync");

// Destructuring the gulp methods
const browserSync = browserSyncLib.create();


// linting the CSS using Stylelint
function lintCSS() {
    return src("styles/**/*.css").pipe(
    stylelint({
        reporters: [{ formatter: "string", console: true }],
    })
    );
}


// Compile CSS
function compileCSS() {
    return src("styles/main.css")
    .pipe(sass({ outputStyle: "expanded", precision: 10 }).on("error", sass.logError))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// Lint JS (Eslint)
function lintJS() {
    return src("js/**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Transpiling and minifying JS (Babel, uglify)
function compressJS() {
    return src("js/**/*.js") // Select all JS files in js folder
        .pipe(babel({ presets: ["@babel/preset-env"] })) // Transpile to ES5
        .pipe(uglify()) // Minify JS
        .pipe(dest("dist/js"));
    }

// Image Compressor
function compressImages() {
    return src("img/**/*.{png,jpg,jpeg,svg,gif}")
    .pipe(cache(imagemin()))
    .pipe(dest("dist/img"));
}

// HTML Compressor
function compressHTML() {
    return src("*.html").pipe(htmlmin({ collapseWhitespace: true })).pipe(dest("dist"));
}

// Watch files and reload browser automatically
function watchFiles() {
    watch("styles/**/*.scss", series(lintCSS, compileCSS));
    watch("*.html", compressHTML);
    watch("img/**/*", compressImages);
    watch("js/**/*.js", series(lintJS, compressJS));
}

//Serve and auto refresh the browser
function serve() {
    browserSync.init({
    server: {
        baseDir: "./",
    },
    });
    watchFiles();
    watch("*.html").on("change", browserSync.reload);
}


// Default Task: Runs everything in develpment mode

exports.build = series(
    parallel(lintCSS, lintJS),
    parallel(compileCSS, compressJS, compressHTML, compressImages),
    serve
);

exports.compressJS = compressJS;
exports.default = exports.build;
