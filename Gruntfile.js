module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.initConfig({
		ts: {
			// A specific target
			build: {
				// The source TypeScript files, http://gruntjs.com/configuring-tasks#files
				src: ["src/*.ts"],
				// The source html files, https://github.com/grunt-ts/grunt-ts#html-2-typescript-support
				html: false,
				// If specified, generate this file that to can use for reference management
				reference: false,  
				// If specified, generate an out.js file which is the merged js file
				out: 'out/oscar.js',
				// If specified, the generate JavaScript files are placed here. Only works if out is not specified
				outDir: false,
				// If specified, watches this directory for changes, and re-runs the current target
				watch: false,
				// Use to override the default options, http://gruntjs.com/configuring-tasks#options
				options: {
					// 'es3' (default) | 'es5'
					target: 'es3',
					// 'amd' (default) | 'commonjs'
					module: 'commonjs',
					// true (default) | false
					sourceMap: false,
					// true | false (default)
					declaration: false,
					// true (default) | false
					removeComments: true
				}
			},
			testing: {
				src: ["src/*.ts", "testing/*.ts"],
				html: false,
				reference: false,  
				out: 'out/testing.js',
				outDir: false,
				watch: false,
				options: {
					target: 'es3',
					module: 'commonjs',
					sourceMap: false,
					declaration: false,
					removeComments: true
				}
			}
		},
		watch : {
			builder : {
				files : ["src/*.ts", "src/**/*.ts"],
				tasks : ["ts:build"],
				options : {
					interrupt : true,
					atBegin : true
				}
			},
			tester : {
				files : ["src/*.ts", "src/**/*.ts", "testing/*.ts", "testing/**/*.ts"],
				tasks : ["ts:testing"],
				options : {
					interrupt : true,
					atBegin : true
				}
			}
		}
	});

	grunt.registerTask('build', ['watch:builder']);
	grunt.registerTask('testing', ['watch:tester']);
};