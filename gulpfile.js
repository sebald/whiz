'use strcit';

var gulp = require('gulp'),
    change = require('gulp-change'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    rename = require('gulp-rename'),
    shell = require('gulp-shell'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    util = require('gulp-util'),

    browserSync = require('browser-sync'),
    reload = browserSync.reload,

    del = require('del'),
    fs = require('fs'),
    prompt = require('prompt'),
    series = require('run-sequence'),


    // Load configuration
    config = require('./gulpfile.config'),
    tsconfig = require('./tsconfig.json');

    prompt.message = util.colors.blue('>>');


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
 * Marvel Api Key
 */
 gulp.task('key', function ( done ) {
     var contents,
         exists;

     try {
         contents = fs.readFileSync(config.files.key, 'utf-8');
         exists = !!contents.length;
         if( !exists ) {
             util.log(util.colors.red('Key file is empty.'));
         }
     }
     catch (e) {
         exists = false;
         util.log(util.colors.red('No file "' + config.files.key + '" found.'));
     }
     finally {
         if( !exists ) {
             util.log(util.colors.green('Creating new Marvel API key!'));
             prompt.start();
             prompt.get({
                 properties: {
                     key: {
                         description: 'Please enter Marvel API key',
                         pattern: /[0-8a-z]+/,
                         required: true,
                         message: 'Marvel\'s API key only consists of lowecase letters and numbers'
                     }
                 }
             }, function ( err, result ) {
                 if( result && result.key ) {
                     fs.writeFileSync(config.files.key, result.key);
                     done();
                 }
             })
         } else {
             done();
         }
     }
});


/**
 * Copy Marvel developer key
 */
gulp.task('copy_key', function () {
    gulp.src(config.files.key)
        .pipe(rename('key.js'))
        .pipe(change(function ( contents ) {
            return 'var MARVEL_API_KEY = "' + contents + '";'
        }))
        .pipe(gulp.dest(config.path.dest));
});


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
        ['key'],
        ['tsc', 'copy', 'copy_key'],
        done
    );
});