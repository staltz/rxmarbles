var gulp = require('gulp');
var browserify = require('gulp-browserify');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var gutil = require('gulp-util');

// Based on https://github.com/deepak1556/gulp-browserify/issues/7

gulp.task('coffee', function() {
  gutil.log(gutil.colors.yellow("Running CoffeeScript compiler..."));
  return gulp.src(['./src/**/*.coffee'])
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./.tmp/src/js'));
});

gulp.task('browserify', ['coffee'], function() {
  gutil.log(gutil.colors.yellow("Packing with browserify..."));
  return gulp.src(['./.tmp/src/js/**/*.js'])
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest('./.tmp/browserified-js'));
});

gulp.task('uglify', ['browserify'], function() {
  gutil.log(gutil.colors.yellow("Minifying with uglify..."));
  return gulp.src(['./.tmp/browserified-js/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
})

gulp.task('post-clean-up', ['uglify'], function() {
  gutil.log(gutil.colors.yellow("Cleaning up temporary files..."));
  return gulp.src('./.tmp', { read: false })
    .pipe(rimraf());
});

gulp.task('build', ['post-clean-up']);

gulp.task('default', function() {
  gulp.run('build');

  gutil.log("Watching for changes...");
  gulp.watch(['./src/**/*.coffee'], function(event) {
    if (event.path) {
      gutil.log("Change detected in ", gutil.colors.magenta(event.path));
    } else {
      gutil.log("Change in source file detected. Recoffeeifying...");
    }
    gulp.run('coffeeify');
  });
});
