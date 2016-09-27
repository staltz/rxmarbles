var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var server = require('gulp-server-livereload');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

var bundler = watchify(browserify('./src/app.js', { debug: true }).transform(babel));

function rebundle() {
  console.log('-> bundling...');
  return bundler.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source('dist/js/app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .on('end', function() { console.log("-> bundling done"); });
}

function compile(watch) {
  if (watch) {
    rebundle();
    return bundler.on('update', function() {
      rebundle();
    });
  }

  return rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('rebundle', rebundle);
gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('default', ['watch', 'server'])

gulp.task('server', function() {
  gulp.src('./')
    .pipe(server({
      defaultFile: 'index.html',
      livereload: {
        enable: true,
        filter: function (filename, cb) {
          cb(/\/(dist\/.*\.js|index.html)$/.test(filename))
        } 
      },
      log: 'debug'
    }));
});
