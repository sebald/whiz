'use strcit';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    gif = require('gulp-if'),
    prompt = require('gulp-prompt'),
    shell = require('gulp-shell'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    util = require('gulp-util'),

    browserSync = require('browser-sync'),
    reload = browserSync.reload,

    del = require('del'),
    fs = require('fs'),
    series = require('run-sequence'),
    through = require('through2'),


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
 * Marvel Api Key
 */
 gulp.task('key', function ( done ) {

     function createApiKey () {
         util.log(util.colors.blue('Creating a key!'));
         util.log(util.colors.blue(
             'If you do not have a Marvel API, you can create ony here',
             util.colors.underline('http://developer.marvel.com/signup'),
             '!'
         ));
         return prompt.prompt({
             type: 'input',
             name: 'key',
             message: 'Please enter Marvel API key',
             validate: function ( str ) {
                 // Marvel's API key only consists of lowecase letters and numbers.
                 return /[0-8a-z]+/.test(str);
             }
        }, function ( response ) {
            fs.writeFileSync(config.files.key, response.key)
        });
     }

     fs.stat(config.files.key, function ( err, stat ) {
        var exists = false;

         // Check if key file exists or is empty
         if( err ) {
             util.log(util.colors.red('No file "' + config.files.key + '" found.'));
             fs.writeFileSync(config.files.key, '');   // We have to create an empty file,
                                                // otherwhise Gulp wont run the task.
         } else if ( !stat.size ) {
             util.log(util.colors.red('Key file is empty.'));
         } else {
             exists = true;
         }

         // Stark task
         return gulp.src(config.files.key)
            .pipe(gif(!exists, createApiKey()));
     });
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
        ['clean', 'key'],
        ['tsc', 'copy'],
        done
    );
});