'use strcit';

var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    shell = require('gulp-shell'),

    browserSync = require('browser-sync'),
    reload = browserSync.reload,

    del = require('del'),
    series = require('run-sequence'),


    // Load configuration
    config = require('./gulpfile.config'),
    tsconfig = require('./tsconfig.json');

/**
 * Clean up destination directory
 */
 gulp.task('clean', function (done) {
    del([config.path.dest], done);
});


/**
 * Reload browser (connected with browser sync)
 */
gulp.task('reload', reload );


/**
 * Copy vendor and required SystemJS files
 */
gulp.task('copy', function () {
    gulp.src([
        config.main, // index.html
        'jspm_packages/system.js',
        'jspm.config.js',
        'jspm_packages/**/angular.js'
    ])
        .pipe(flatten())
        .pipe(gulp.dest(config.path.dest));
});


/**
 * Transpile TypeScript
 */
gulp.task('tsc', function () {
    var tsResult;

    tsResult = gulp.src([
        config.path.src + '/**/*.ts',
        config.path.typings + '/tsd.d.ts'
    ])
        .pipe(sourcemaps.init())
        .pipe(ts(tsconfig.compilerOptions))

    tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.path.dest + '/src'));
});


/**
 * Bundle everthing!
 */
gulp.task('bundle', function () {
    gulp.src(config.path.src + '/app/bootstrap.ts', { read: false})
        .pipe(shell([
            'jspm bundle-sfx ' + config.path.dest + '/src/app/bootstrap ' +
                config.path.dest + '/bundle.js'
        ]));
});


/**
 * Start developing (server + livereload)
 */
 gulp.task('start', ['build'], function () {
    gulp.watch(config.path.src + '/**/*.ts', ['tsc', 'reload']);
    gulp.watch(config.main, ['copy', 'reload']);

    browserSync({
        server: {
            baseDir: config.path.dest
        },
        open: true,
        notify: false
    });
});


/**
 * Default: Build everyting
 */
gulp.task('build', function ( done ) {
    series(
        ['clean'],
        ['tsc', 'copy'],
        done
    );
});