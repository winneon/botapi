"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const typings = require("gulp-typings");
const sourcemaps = require("gulp-sourcemaps");
const relative = require("gulp-relative-sourcemaps-source");
const ts = require("gulp-typescript");
const replace = require("gulp-replace");
const mocha = require("gulp-mocha");
const del = require("del");
const sequence = require("run-sequence");

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

gulp.task("testrun", () => {
	gulp.removeAllListeners("task_err");

	return gulp.src([ "src/**/*.ts", "test/**/*.ts", "typings/**/*.d.ts" ])
		.pipe(ts(project))
		.pipe(replace("../src/", "./"))
		.pipe(gulp.dest("temp"))
		.pipe(mocha({
			reporter: "spec"
		}));
});

gulp.task("testdel", () => {
	return del([ "temp/" ]);
});

gulp.task("test", () => {
	sequence("testrun", "testdel", () => {
		process.exit(0);
	});
});

gulp.task("default", [ "compile" ]);
