var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var jasmine = require('gulp-jasmine');

// For js minifying pipeline
var gp_concat     = require('gulp-concat'),
    gp_rename     = require('gulp-rename'),
    gp_uglify     = require('gulp-uglify');
    gp_sourcemaps = require('gulp-sourcemaps');

gulp.task('lint', function() {
    return gulp.src('./lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('jasmine-backend', function () {
    return gulp.src('./spec/backend/**/*-spec.js')
        .pipe(jasmine());
});

// Marking the front end tests as dependant on the backend tests
// prevents an issue that jasmine has with running two lots in
//  parallel
gulp.task('jasmine-frontend', ['jasmine-backend'], function () {
    return gulp.src('./spec/frontend/**/*-spec.js')
        .pipe(jasmine());
});

gulp.task('squish-client-js', function(){
    return gulp.src('./www/scripts/**/*.js')
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('concat.js'))
        .pipe(gulp.dest('build-temp'))
        .pipe(gp_rename('all.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('www'));
});

// Squish client js needs to be run first so that the
// smushed together js will be available
gulp.task('serve', ['squish-client-js'], function() {
    var server = require("./lib/app");
    var port = process.env.PORT || 8001;
    server.listen(port);
    console.log('listening on: ' + port);
});

gulp.task('default', ['lint', 'jasmine-backend']);
gulp.task('everything', ['lint', 'jasmine-backend', 'jasmine-frontend']);