var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    webserver = require('gulp-webserver'),
    fs = require('fs'),
    less = require('gulp-less'),
    path = require('path'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat');

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css'))
    .pipe(notify('Done!'));
});

gulp.task('webServer', function(){
  gulp.src('./')
      .pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: true
      }));
});

gulp.task('watch', function(){
  gulp.watch('./less/**/*.less', ['less']);
});

gulp.task('default', ['less', 'webServer', 'watch']);
