babel src -d es6;
browserify -e es6/app.js --outfile dist/js/app.js
