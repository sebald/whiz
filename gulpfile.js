'use strcit';

var gulp = require('gulp'),
    change = require('gulp-change'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    run = require('gulp-run'),
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
 gulp.task('clean', function ( done ) {
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
             util.log(util.colors.blue(
                 'If you do not have a Marvel API, you can create one here:',
                 util.colors.underline('http://developer.marvel.com/signup'),
                 '!'
             ));
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
                     fs.writeFileSync(config.files.key, [
                        'var MARVEL_API_KEY = "' + result.key.trim() + '"',
                        'exports.default = MARVEL_API_KEY;'
                     ].join('\n'));
                     done();
                 }
             })
         } else {
             done();
         }
     }
});


/**
 * Copy all
 */
 gulp.task('copy', function ( done ) {
     series(
         ['copy:key', 'copy:vendors', 'copy:system'],
         done
     );
 });


/**
 * Copy Marvel developer key
 */
gulp.task('copy:key', function () {
    gulp.src(config.files.key)
        .pipe(gulp.dest(config.path.dest_src));
});


/**
 * Copy vendors
 */
gulp.task('copy:vendors', function () {
    gulp.src([
        'jspm_packages/**/angular/*.js',
        'jspm_packages/**/angular.js'
    ])
        .pipe(gulp.dest(config.path.dest_src + '/jspm_packages'));
});


/**
 * Copy SystemJS + configuration + index.html
 */
gulp.task('copy:system', function () {
    gulp.src([
        config.main, // index.html
        'jspm_packages/system.js',
        'jspm.config.js',
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
        .pipe(gulp.dest(config.path.dest_src));
});


/**
 * Bundle everthing!
 */
gulp.task('bundle', function ( done ) {
    run(
        'jspm bundle-sfx ' + config.path.dest_src + '/bootstrap ' +
        config.path.dest + '/bundle.js'
    ).exec(done);
});

/**
 * Start developing (server + livereload)
 */
 gulp.task('start', ['build'], function () {
    gulp.watch(config.path.src + '/**/*.ts', ['tsc', 'reload']);

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
        ['tsc', 'copy'],
        done
    );
});