browserify -d -u rx -u assert -t babelify \
  test/marble-construction.js \
  --outfile dist/js/test.js
mocha dist/js/test.js
