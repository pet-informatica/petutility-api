const gulp = require('gulp'),
	babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	path = require('path'),
	sass = require('gulp-sass'),
	pumbler = require('gulp-plumber'),
	templateCache = require('gulp-angular-templatecache');

gulp
	.task('default', ['vendor', 'html2js', 'watchHtml2js', 'bundle', 'sass', 'watchBundle']);
gulp
	.task('production', ['vendor', 'html2js', 'bundle', 'sass']);

gulp
	.task('vendor', function() {
		gulp
			.src(
				[
					path.join(__dirname, 'bower_components', 'jquery', 'dist', 'jquery.js'),
					path.join(__dirname, 'public', 'materialize', 'materialize.js'),
					path.join(__dirname, 'bower_components', 'moment', 'moment.js'),
					path.join(__dirname, 'bower_components', 'fullcalendar','dist', 'fullcalendar.js'),
					path.join(__dirname, 'bower_components', 'fullcalendar','dist', 'gcal.js'),
					path.join(__dirname, 'bower_components', 'angular', 'angular.js'),
					path.join(__dirname, 'bower_components', 'angular-resource', 'angular-resource.js'),
					path.join(__dirname, 'bower_components', 'angular-ui-router', 'release', 'angular-ui-router.js'),
					path.join(__dirname, 'bower_components', 'angular-cookies', 'angular-cookies.js'),
					path.join(__dirname, 'bower_components', 'angular-ui-calendar','src', 'calendar.js'),
					path.join(__dirname, 'bower_components', 'ng-file-upload', 'ng-file-upload.js'),
					path.join(__dirname, 'bower_components', 'ng-file-upload-shim', 'ng-file-upload-shim.js'),
					path.join(__dirname, 'bower_components', 'jquery-timepicker-jt', 'jquery.timepicker.js'),
					path.join(__dirname, 'public', 'materialize', 'materialize.js')
				]
			)
			.pipe(pumbler())
			.pipe(sourcemaps.init())
			.pipe(concat('vendor.min.js'))
			.pipe(babel({minified: true, comments: false}))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(path.join(__dirname, 'public', 'bin')));
	});

gulp
	.task('bundle', function() {
		gulp
			.src(path.join(path.join(__dirname, 'public', 'js', '**', '*.js')))
			.pipe(pumbler())
			.pipe(sourcemaps.init())
			.pipe(babel({presets: ['es2015'], comments: false}))
			.pipe(concat('bundle.min.js'))
			.pipe(babel({minified: true}))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(path.join(__dirname, 'public', 'bin')));
	});

gulp
	.task('watchBundle', function() {
		gulp
			.watch(path.join(path.join(__dirname, 'public', 'js', '**', '*.js')), ['bundle']);
	});

gulp
	.task('sass', function() {
		gulp
			.src([
				path.join(__dirname, 'public', 'materialize', 'scss', 'materialize.scss'),
				path.join(__dirname, 'bower_components', 'fullcalendar', 'dist', 'fullcalendar.css'),
				path.join(__dirname, 'bower_components', 'jquery-timepicker-jt', 'jquery.timepicker.css')
				])
			.pipe(pumbler())
			.pipe(sourcemaps.init())
				.pipe(sass({outputStyle: 'compressed'}))
				.pipe(concat('vendor.css'))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(path.join(__dirname, 'public', 'bin')));
	});

gulp
	.task('html2js', function() {
		gulp
			.src(path.join(__dirname, 'public', 'templates', '**', '*.html'))
			.pipe(templateCache('templates.js', {transformUrl: (url) => {return 'public/templates/' + url;}}))
			.pipe(gulp.dest(path.join(__dirname, 'public', 'js')));
	});

gulp
	.task('watchHtml2js', function() {
		gulp
			.watch(path.join(__dirname, 'public', 'templates', '**', '*.html'), ['html2js']);
	});
