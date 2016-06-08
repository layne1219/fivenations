var gulp = require('gulp')
  , gutil = require('gulp-util')
  , del = require('del')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , minifycss = require('gulp-minify-css')
  , minifyhtml = require('gulp-minify-html')
  , processhtml = require('gulp-processhtml')
  , eslint = require('gulp-eslint')
  , uglify = require('gulp-uglify')
  , prettify = require('gulp-jsbeautifier')
  , connect = require('gulp-connect')
  , debug = require('gulp-debug')
  , paths;

paths = {
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

gulp.task('copy-src', ['clean'], function (cb) {
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

gulp.task('finalise-html', ['process-html'], function() {
  return gulp.src(paths.dist + 'index.html')
    .pipe(minifyhtml())
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('lint', function() {
  gulp.src(paths.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', gutil.log);
});

gulp.task('prettify', function() {
gulp.src(paths.js)
    .pipe(prettify())
    .pipe(gulp.dest(paths.js))
    .on('error', gutil.log);
});

gulp.task('html', function(){
  gulp.src('src/*.html')
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

gulp.task('publish', ['build'], function () {
  connect.server({
    root: [__dirname + '/dist'],
    port: 9000,
    livereload: false
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['lint']);
  gulp.watch(['./src/index.html', paths.css, paths.js], ['html']);
});

gulp.task('default', ['connect', 'watch']);
gulp.task('build', ['finalise-html']);
