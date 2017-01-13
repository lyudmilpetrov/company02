var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var minifyCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var newer = require('gulp-newer');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var closureCompiler = require('google-closure-compiler').gulp({ requireStreamInput: true });
var processhtml = require('gulp-processhtml');
var del = require('del');
////CSS
gulp.task('default', function () {
    return gulp.src(['app.min.js', 'app.min.css'], { read: false })
    .pipe(clean());
});
gulp.task('css',['default'], function () {
    return [
      gulp.src(['css/style.css', 'css/metro.css', 'css/map.css'])
      .pipe(minifyCSS())
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
      .pipe(concat('css/app.min.css'))
      .pipe(gulp.dest(''))
    ];
});
gulp.task('app', ['css'], function ()
{
    return [gulp.src(['models/models.js', 'directives/directives.js', 'factories/factories.js', 'controllers/controllers.js'])
        .pipe(newer('app.min.js'))
        .pipe(closureCompiler({
            compilation_level: 'WHITESPACE_ONLY',
            js_output_file: 'app.min.js'
        }))
        .pipe(gulp.dest('')),
        gulp.src(['models/models.js', 'directives/directives.js', 'factories/factories.js', 'controllers/controllers.js'], { base: '' })
        .pipe(newer('app.min.js'))
        .pipe(closureCompiler({
            compilation_level: 'WHITESPACE_ONLY',
            js_output_file: 'app.min.js'
        }))
        .pipe(gulp.dest(''))
    ];
});
gulp.task('browserSync', ['app'], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
gulp.task('start', function (callback) {
    runSequence(['app'],
        'browserSync');
});

