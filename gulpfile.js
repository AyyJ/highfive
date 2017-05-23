var gulp = require('gulp'),
jshint = require('gulp-jshint'),
jsdoc = require('gulp-jsdoc3'),
mocha = require('gulp-mocha'),
istanbul = require('gulp-istanbul');

/**
* Lint Checker
*/
gulp.task('lint', function () {
  gulp.src('./**/*.js')
  .pipe(jshint())
});

/**
* Istanbul + Mocha tests
*/
gulp.task('test', function () {
  gulp.src('./server/test/test.js')
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

gulp.task('pre-test', function () {
  return gulp.src(['./server/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['./server/test/test.js'])
    .pipe(mocha({reporter: 'spec'}))
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports({
      dir: './public/coverage',
      reporters: [ 'lcov' ],
      reportOpts: { dir: './public/coverage'}
    }))
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
