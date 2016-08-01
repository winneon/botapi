"use strict";

let gulp = require("gulp");
let typings = require("gulp-typings");
let sourcemaps = require("gulp-sourcemaps");
let relative = require("gulp-relative-sourcemaps-source");
let ts = require("gulp-typescript");
let merge = require("merge2");
let istanbul = require("gulp-istanbul");
let mocha = require("gulp-mocha");
let exit = require("gulp-exit");
let remap = require("remap-istanbul/lib/gulpRemapIstanbul");

let project = ts.createProject("tsconfig.json");
require("gulp-grunt")(gulp);

gulp.task("typings", () => {
	return gulp.src("typings.json")
		.pipe(typings());
});

gulp.task("compile", () => {
	let dest = "lib";

	let result = gulp.src([ "./src/**/*.ts", "./test/**/*.ts", "./typings/**/*.d.ts" ], {
		base: "."
	}).pipe(sourcemaps.init()).pipe(ts(project));

	return merge([
		result.js.pipe(relative({
			dest: "lib"
		}))
		.pipe(sourcemaps.write(".", {
			includeContent: false,
			sourceRoot: "."
		}))
		.pipe(gulp.dest(dest)),
		result.dts.pipe(gulp.dest(dest))
	]);
});

gulp.task("pretest", [ "compile" ], () => {
	return gulp.src([ "lib/**/*.js", "!lib/test/*" ])
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
			.pipe(istanbul())
			.pipe(istanbul.hookRequire())
		.pipe(sourcemaps.write());
});

gulp.task("dotest", [ "pretest" ], () => {
	return gulp.src([ "./lib/test/**/*.js" ])
		.pipe(mocha({
			reporter: "spec",
			timeout: 10000
		}))
		.pipe(istanbul.writeReports({
			dir: "./reports",
			reporters: [ "json" ]
		}));
});

gulp.task("posttest", [ "dotest" ], () => {
	return gulp.src("reports/coverage-final.json")
		.pipe(remap({
			reports: {
				"json": "reports/coverage-final.json",
				"html": "reports/html"
			}
		}))
		.pipe(exit());
});

gulp.task("test", [ "pretest", "dotest", "posttest" ])
gulp.task("default", [ "compile" ]);
