"use strict";
var gulp = require('gulp');
var concat = require('gulp-concat');
var webserver = require('gulp-server-livereload');
var stylus = require('gulp-stylus');
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var clean = require('gulp-clean');

var ts = Math.floor(Date.now()/1000);

//Build markup 
gulp.task('html', function() {
  return gulp.src('src/index.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
      locals: {timestamp: ts}
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(''));
});

//Build scripts
gulp.task('js', function() {
  gulp.src('src/js/**/*')
    .pipe(plumber())
    .pipe(concat(
      'script.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('js/'));
});

//Build styles
gulp.task('css', function() {
  gulp.src('src/style/style.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('css/'));
});

//Clean build directory
gulp.task('clean', function() {
  return gulp.src(['js', 'css', 'index.html'], {
    read: false
  }).pipe(clean());
});

//Watch task
gulp.task('watch', function() {
  gulp.watch('src/style/**/*.styl', ['css']);
  gulp.watch('src/index.pug', ['html']);
  gulp.watch('src/js/**/*.js', ['js']);
});

//Run webserver with livereload
gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      fallback: "index.html",
      port: 9090,
      open: true
    }));
});

//Development task
gulp.task('default', ['watch', 'webserver']);

//Build task
gulp.task('build', function() {
  runSequence('clean', ['html', 'css', 'js']);
});