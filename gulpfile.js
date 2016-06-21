var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');
var through = require('through2');
var open = require('open');


var getScripts = require('./gulp-get-scripts');

gulp.task('default', ['html', 'data', 'images', 'fonts']);

var dist = 'dist';
var html = ['app/index.html'];
var template = ['app/tmpl/**/*.html'];
var images = ['app/**/*.ico', 'app/**/*.png'];
var fonts = ['bower_components/bootstrap/dist/fonts/*'];
var data = ['app/**/*.json', 'app/**/*.csv'];
var css = 'app/**/*.css';
var js = 'app/**/*.js';

// Delete the dist directory
gulp.task('clean', function() {
	return del(dist);
});

gulp.task('template', function() {
	return gulp.src(template, {base: 'app'})
		.pipe($.angularTemplatecache({ base: function(file) {
			return file.relative;
		}}))
		.pipe(gulp.dest(dist));
});

gulp.task('images', function() {
	return gulp.src(images)
		.pipe(gulp.dest(dist));
});

gulp.task('fonts', function() {
	return gulp.src(fonts, { base: 'bower_components/bootstrap/dist' })
		.pipe(gulp.dest(dist));
});

gulp.task('data', function() {
	return gulp.src(data)
		.pipe(gulp.dest(dist));
});

gulp.task('css', function() {
	return gulp.src(html)
		.pipe(getScripts('.*<link.*target="app".*rel="stylesheet".*href="(.*?)".*/>'))
		.pipe($.cleanCss())
		.pipe($.concat('css/style.min.css'))
		.pipe(gulp.dest(dist));
});

gulp.task('js', function() {
	return gulp.src(html)
		.pipe(getScripts('.*<script.*target="app".*src="(.*.*?)".*?></script>.*'))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.jscs())
        .pipe($.jscs.reporter())
		.pipe(log('about to uglify'))
		.pipe($.uglify())
		.pipe($.concat('app.min.js'))
		.pipe(gulp.dest(dist));
});

var log = function(message) {
	return through.obj(function(file, encoding, callback) {
		//console.log(message, file.path);
		callback(null, file);
	});
};

gulp.task('vendors:css', function() {
	return gulp.src(html)
		.pipe(getScripts('.*<link.*target="vendors".*rel="stylesheet".*href="((.*bower_component.*?))" />'))
		.pipe($.cleanCss())
		.pipe($.concat('css/vendors.min.css'))
		.pipe(gulp.dest(dist));
});

gulp.task('vendors:js', function() {
	return gulp.src(html)
		.pipe(getScripts('.*<script.*target="vendors".*src="(.*bower_component.*?)".*?></script>.*'))
		.pipe(log('about to uglify'))
		.pipe($.uglify())
		.pipe(log('about to concat'))
		.pipe($.concat('vendors.min.js'))
		.pipe(gulp.dest(dist));
});

gulp.task('html', function() {
	return gulp.src(html)
		.pipe($.htmlReplace({
			js: ['vendors.min.js', 'app.min.js', 'templates.js'],
			css: ['css/vendors.min.css', 'css/style.min.css'],
			base: {
				src: '/dist/',
				tpl: '<base href="%s"/>'
		  }
		}))
		.pipe(gulp.dest(dist));
});

gulp.task('deploy', function() {
	return gulp.src('./dist/**/*')
		.pipe($.ghPages({ cacheDir: '../.publish_boof'}));
});

gulp.task('build', ['data', 'images', 'fonts', 'html', 'css', 'js', 'template'], function() {
	console.log('building build');
});

gulp.task('rebuild', function() {
	runSequence('clean', 'vendors', 'build');
});

gulp.task('vendors', function() {
	runSequence('vendors:css', 'vendors:js');
});

gulp.task('watch', function() {
	var watcher = gulp.watch('app/**/*', ['build']);
	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('start', function() {
	open('http://jlguenego.github.io/boof/');
});