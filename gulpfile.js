var gulp = require('gulp'); 
var gutil = require('gulp-util');
var del = require('del');
var minifyhtml = require('gulp-minify-html');
var processhtml = require('gulp-processhtml');
var eslint = require('gulp-eslint');
var prettify = require('gulp-jsbeautifier');
var connect = require('gulp-connect');
var git = require('gulp-git');

var paths = {
    src: 'src/**/*',
    assets: 'src/assets/**/*',
    css:    'src/css/*.css',
    libs:   [
        'src/bower_components/phaser-official/build/phaser.min.js',
        'src/bower_components/requirejs/require.js'
    ],
    js:     ['src/js/**/*.js'],
    dist:   './dist/'
};

gulp.task('clean', function () {
    return del([paths.dist]);
});

gulp.task('pull', function (cb) {
    var branch = 'master';
    git.pull('origin', branch, function(err) {
        if (err) throw err;
        cb();
    });
});

gulp.task('copy-src', ['pull', 'clean'], function (cb) {
    return gulp.src(paths.src)
      .pipe(gulp.dest(paths.dist))
      .on('error', gutil.log);
});

gulp.task('process-html', ['copy-src'], function() {
    return gulp.src(paths.dist + 'index.html')
      .pipe(processhtml({}))
      .pipe(gulp.dest(paths.dist))
      .on('error', gutil.log);
});

gulp.task('build-html', ['process-html'], function() {
    return gulp.src(paths.dist + 'index.html')
      .pipe(minifyhtml())
      .pipe(gulp.dest(paths.dist))
      .on('error', gutil.log);
});

gulp.task('lint', function() {
    return gulp.src(paths.js)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
});

gulp.task('prettify', function() {
    return gulp.src(paths.js)
      .pipe(prettify())
      .pipe(gulp.dest('src/js/'))
      .on('error', gutil.log);
});

gulp.task('html', function(){
    return gulp.src('src/*.html')
      .pipe(connect.reload())
      .on('error', gutil.log);
});

gulp.task('connect', function () {
    connect.server({
        root: [__dirname + '/src'],
        port: 9000,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.js, ['lint']);
    gulp.watch(['./src/index.html', paths.css, paths.js], ['html']);
});

gulp.task('default', ['connect', 'watch']);
gulp.task('build', ['lint', 'build-html']);
