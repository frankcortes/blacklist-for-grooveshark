module.exports = function(grunt) {
	grunt.initConfig({
		docco: {
			docs: {
				src: ["src/**/*.js"],
				options: {
					output: "docs/"
				}
			}
		},
		clean: {
			docs: ["docs/**/*.html"],
			prod: ["dist/**/*.*"]
		},
		concat: {
			options: {
				preserveComments: false
			},
			prod: {
				src: ["src/**/*.js"],
				dest: "dist/blacklist-grooveshark.js"
			}
		},
		uglify: {
			prod: {
				src: "dist/blacklist-grooveshark.js",
				dest: "dist/blacklist-grooveshark.min.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-docco");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	//dev
	grunt.registerTask("default", ["clean:docs", "docco:docs"]);
	//prod
	grunt.registerTask("prod", ["clean:prod", "concat", "uglify:prod"]);
};