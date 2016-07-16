"use strict";

let gulp = require("gulp");
let typings = require("gulp-typings");
let sourcemaps = require("gulp-sourcemaps");
let relative = require("gulp-relative-sourcemaps-source");
let ts = require("gulp-typescript");
let istanbul = require("gulp-istanbul");
let replace = require("gulp-replace");
let mocha = require("gulp-mocha");

let project = ts.createProject("tsconfig.json");

gulp.task("typings", () => {
	return gulp.src("typings.json")
		.pipe(typings());
});

gulp.task("compile", () => {
	return gulp.src([ "src/**/*.ts", "typings/**/*.d.ts" ])
		.pipe(sourcemaps.init())
			.pipe(ts(project))
			.pipe(relative({
				dest: "lib"
			}))
		.pipe(sourcemaps.write(".", {
			includeContent: false,
			sourceRoot: "."
		}))
		.pipe(gulp.dest("lib"));
});

gulp.task("pretest", [ "compile" ], () => {
	return gulp.src([ "lib/**/*.js" ])
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
			.pipe(istanbul())
			.pipe(istanbul.hookRequire())
		.pipe(sourcemaps.write());
});

gulp.task("test", [ "pretest" ], () => {
	return gulp.src([ "./test/**/*.ts", "./typings/**/*.d.ts" ])
		.pipe(ts(project))
		.pipe(replace("../src/", "../lib/"))
		.pipe(gulp.dest("temp"))
		.pipe(mocha({
			reporter: "spec",
			timeout: 10000
		}))
		.pipe(istanbul.writeReports({
			dir: "./reports",
			reporters: [ "json" ]
		}));
});

gulp.task("default", [ "compile" ]);
