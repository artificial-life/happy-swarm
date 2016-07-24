'use strict'

let gulp = require("gulp");
let sourcemaps = require("gulp-sourcemaps");
let babel = require("gulp-babel");
let watch = require('gulp-watch');
let changed = require('gulp-changed');
let nodemon = require('gulp-nodemon');
let plumber = require('gulp-plumber');
let mocha = require('gulp-mocha');
let path = require('path');
let bsync = require('browser-sync');
let demon;


gulp.task("default", ['es6']);

gulp.task("sourcemaps", function() {
	return gulp.src("src/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest("build"));
});

gulp.task("es6-js", function() {
	return gulp.src(["src/**/*.js", "tests/**/*.js"])
		.pipe(changed("build"))
		.pipe(plumber({
			errorHandler: function(e) {
				console.log('error', e);
			}
		}))
		.pipe(babel({
			"presets": ["es2015"]
		}))
		.pipe(gulp.dest("build"))
		.on('end', function() {
			console.log('end build');
		});
});

gulp.task("json", function() {
	return gulp.src(["src/**/*.json"])
		.pipe(gulp.dest("build"));
});

gulp.task('es6', ['es6-js', 'json']);



gulp.task('test', ['es6', 'start-test'], function() {
	gulp.watch(["src/**/*.js", "tests/**/*.js"], ['es6']);
});


gulp.task('serve', ['start-serve'], function() {
	gulp.watch(["src/**/*.js"], ['es6']);
});

gulp.task('start-test', function() {
	demon = nodemon({
		script: 'build/run.js',
		watch: ['build/'],
		execMap: {
			"js": "node  --harmony --harmony_proxies"
		},
		env: {
			'NODE_ENV': 'development'
		}
	});
});

gulp.task('start-serve', ['es6'], function() {
	demon = nodemon({
		script: 'build/server.js',
		watch: ['build/'],
		execMap: {
			"js": "node  --harmony --harmony_proxies"
		},
		env: {
			'NODE_ENV': 'development'
		}
	});

	var bs = bsync.create();

	bs.init({
		proxy: "localhost:3000",
		startPath: '/',
		files: ['www/**/*.html'],
		reloadDelay: 1000
	});

});
