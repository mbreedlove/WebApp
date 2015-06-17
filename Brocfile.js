var funnel = require('broccoli-funnel');
var browserify = require('broccoli-browserify-cache');
var esTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var compileSass = require('broccoli-sass');
var angularTemplates = require('broccoli-angular-templates-cache');
var concat = require('broccoli-concat');

var appRoot = 'src';

function buildAppJs() {
    var appJs = funnel(appRoot, {
        srcDir: 'app/',
        include: ['**/*.es6']
    });

    var templates = funnel(appRoot, {
        srcDir: '/app',
        include: ['**/*.html']
    });

    templates = angularTemplates(templates, {
        srcDir: './',
        destDir: './',
        strip: new RegExp(/.*\/funnel-output_path.*.tmp\//),
        minify: {
            collapseWhitespace: true
        },
        fileName:'templates.js',
        moduleName:'app'
    });

    var app = mergeTrees([appJs, templates]);

    appJs = concat(app, {
        inputFiles: [
            './require.es6',
            './app.es6',
            '**/*Module.es6',
            '**/*Controller.es6',

            './templates.js'
        ],
        outputFile: '/app.js',
        separator: '\n', // (optional, defaults to \n)
        header: '/** Copyright Acme Inc. 2014 **/' // (optional)
    });

    appJs = browserify(appJs, {
        entries: ['./app.js'],
        outputFile: 'app-js.js'
    });

    appJs = esTranspiler(appJs);

    return appJs;
}


function buildAppCss() {
    var appCss = funnel(appRoot, {
        srcDir: '/',
        include: ['**/*.sass', '**/*.css']
    });

    return compileSass(['src/app'], 'app.scss', 'app.css');
}

function buildIndexHtml() {
    var indexHtml = funnel(appRoot, {
        srcDir: '/',
        include: ['index.html']
    });

    return indexHtml;
}


var indexHtml = buildIndexHtml();
var appJs = buildAppJs();
var appCss = buildAppCss();

module.exports = mergeTrees([indexHtml, appJs, appCss]);