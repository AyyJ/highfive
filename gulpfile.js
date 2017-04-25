var gulp = require('gulp'),
   jshint = require('gulp-jshint'),
    jsdoc = require('gulp-jsdoc3'),
    mocha = require('gulp-mocha');

/**
* Lint Checker
*/
gulp.task('lint', function () {
   gulp.src('./**/*.js')
      .pipe(jshint())
})

/**
* Run Mocha Tests
*/
gulp.task('mocha', () =>
   gulp.src('test/test.js', {read: false})
      .pipe(mocha({reporter: 'nyan'}))
);

/**
* Overwrite fresh-installed jsdocConfig
*/
gulp.task('overwrite', () =>
gulp.src('./jsdocConfig.json')
  .pipe(gulp.dest('./node_modules/gulp-jsdoc3/dist'))
  .pipe(gulp.dest('./node_modules/gulp-jsdoc3/src'))
);

/**
* Run documentation generator
*/
gulp.task('jsdoc', function (cb) {
    var config = require('./jsdocConfig.json')
    gulp.src(['README.md', './functions/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('default', ['lint', 'mocha', 'overwrite', 'jsdoc']);
