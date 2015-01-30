var gulp = require('gulp');
var less = require('gulp-less');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var gutil = require('gulp-util');
var path = require('path');

// Based on https://github.com/deepak1556/gulp-browserify/issues/7

gulp.task('less', function() {
  gutil.log(gutil.colors.yellow("Compiling LESS styles..."));
  gulp.src('./styles/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'styles', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('dev-browserify', [], function() {
  gutil.log(gutil.colors.yellow("Packing with browserify..."));
  return gulp.src(['./src/**/*.js'])
    .pipe(browserify({
      transform: ['6to5ify'],
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest('./build/browserified-js'));
});

gulp.task('browserify', [], function() {
  gutil.log(gutil.colors.yellow("Packing with browserify..."));
  return gulp.src(['./src/**/*.js'])
    .pipe(browserify({
      transform: ['6to5ify'],
      insertGlobals: false,
      debug: false,
      detectGlobals: false
    }))
    .pipe(gulp.dest('./build/browserified-js'));
});

gulp.task('uglify', ['browserify'], function() {
  gutil.log(gutil.colors.yellow("Minifying with uglify..."));
  return gulp.src(['./build/browserified-js/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
})

// Useless for now
gulp.task('post-clean-up', ['uglify'], function() {
  gutil.log(gutil.colors.yellow("Cleaning up temporary files..."));
  return gulp.src(
      [__dirname+'/build/browserified-js/**/*'],
      {read: false}
    )
    .pipe(rimraf());
});

gulp.task('build', ['less', 'uglify']);

gulp.task('dev-build', ['less', 'dev-browserify'], function() {
  return gulp.src(['./build/browserified-js/*.js'])
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('default', function() {
  gulp.run('dev-build');

  gutil.log("Watching for changes...");
  gulp.watch(['./src/**/*.js', './styles/**/*.less'], function(event) {
    if (event.path) {
      gutil.log("Change detected in ", gutil.colors.magenta(event.path));
    } else {
      gutil.log("Change in source file detected.");
    }
    gulp.run('dev-build');
  });
});
