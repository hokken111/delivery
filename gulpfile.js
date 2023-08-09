var gulp = require('gulp');
var webpack = require('gulp-webpack');
var minifyHTML = require('gulp-minify-html');
var del = require('del');
var uglify = require('gulp-uglify');

// Clean
gulp.task('clean', function(cb) {
    del(['dist/*'], cb)
});

gulp.task('build', function() {
  // place code for your default task here
  return gulp.src('src/main.js')
    .pipe(webpack(require('./build/webpack.prod.conf.js')))
    .pipe(gulp.dest('dist/static/'));
});

gulp.task('default', function () {
  gulp.start('clean', 'build');
});