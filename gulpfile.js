var gulp = require('gulp'),
jshint = require('gulp-jshint'),
jsdoc = require('gulp-jsdoc3'),
mocha = require('gulp-mocha');
instanbul = require('gulp-instanbul')

/**
* Lint Checker
*/
gulp.task('lint', function () {
  gulp.src('./**/*.js')
  .pipe(jshint())
})

/**
* Instanbul + Mocha tests
*/
gulp.task('test', function () {
  return gulp.src('./server/routes/*.js')
  // Right there
  .pipe(istanbul({includeUntested: true}))
  .on('finish', function () {
    gulp.src('./server/test/test.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports({
      dir: './public/coverage',
      reporters: [ 'lcov' ],
      reportOpts: { dir: './public/coverage'}
    }));
  });
});

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
  gulp.src(['README.md', './routes/*.js'], {read: false})
  .pipe(jsdoc(config, cb));
});

gulp.task('default', ['lint', 'test', 'overwrite', 'jsdoc']);
