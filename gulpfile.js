"use strict";

let gulp = require("gulp");
let typings = require("gulp-typings");
let sourcemaps = require("gulp-sourcemaps");
let relative = require("gulp-relative-sourcemaps-source");
let ts = require("gulp-typescript");
let replace = require("gulp-replace");
let mocha = require("gulp-mocha");
let exit = require("gulp-exit");

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

gulp.task("test", () => {
	return gulp.src([ "src/**/*.ts", "test/**/*.ts", "typings/**/*.d.ts" ])
		.pipe(ts(project))
		.pipe(replace("../src/", "./"))
		.pipe(gulp.dest("temp"))
		.pipe(mocha({
			reporter: "spec",
			timeout: 10000
		}))
		.pipe(exit());;
});

gulp.task("default", [ "compile" ]);
