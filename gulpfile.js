var gulp = require('gulp');
var del = require('del');
var config = require('./gulp.config')();
var args = require('yargs').argv;

var $ = require('gulp-load-plugins')({ lazy: true });

gulp.task('vet', () => {
    log('Analyzing source with JSHint and JSCS');
    return gulp.src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'))
        ;
});

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling less to css');
    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp))
})

gulp.task('clean-styles', function () {
    var files = config.temp + '**/*.css';
    return clean(files);
})

gulp.task('less-watcher', function () {
    return gulp
        .watch([config.less], ['styles']);
})

/**
 * helper functions
 */

function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path)
        .catch(error => log('Error While Cleaning: ' + $.util.colors.red(error)));
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}