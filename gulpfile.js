const { series } = require(`gulp`);

// Import tasks from the build-tools folder
const compileCSS = require(`./build-tools/compile-css`).compileCSS;
const compressHTML = require(`./build-tools/compress-html`).compressHTML;
const compressImages = require(`./build-tools/compress-images`).compressImages;
const validateHTML = require(`./build-tools/validate-html`).validateHTML;
const lintJS = require(`./build-tools/lint-js`).lintJS;

//Defining the build task
let build = series(compileCSS, compressHTML, compressImages, validateHTML, lintJS);

// Define Gulp tasks
exports.build = build;
exports.default = build;
