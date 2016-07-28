module.exports = (grunt) => {
	grunt.initConfig({
		bump: {
			options: {
				files: [ "package.json" ],
				commit: true,
				commitMessage: "Released v%VERSION%.",
				createTag: true,
				tagName: "v%VERSION%",
				tagMessage: "<%= bump.options.tagName %>",
				push: true,
				pushTo: "origin",
				gitDescribeOptions: "--tags"
			}
		}
	});

	grunt.config.set("bump.options.commitFiles", grunt.config.get("bump.options.files"));
	grunt.loadNpmTasks("grunt-bump");
};
