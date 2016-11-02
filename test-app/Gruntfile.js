module.exports = function(grunt) {

	grunt.initConfig({
		requirejs : {
			compile : {
				options : {
					paths: {
						can      : 'bower_components/canjs/amd/can',
						jquery   : 'bower_components/jquery/dist/jquery',
						mustache : 'node_modules/require-can-renderers/lib/mustache',
						stache   : 'node_modules/require-can-renderers/lib/stache',
						ejs      : 'node_modules/require-can-renderers/lib/ejs'
					},
					name : 'test_app',
					out : 'production.js'
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 9001,
					base: '.',
					keepalive : true
				}
			}
		},
 		less: {
 			development: {
 				options: {
 					paths: ["style"],
 					relativeUrls: true,
 					rootPath: "style/"
 				},
 				files: {
 					"style/style.css": "style/style.less"
 				}
 			}
 		},
 		watch: {
			scripts: {
				files: '**/*.less',
				tasks: ['less:development'],
				options: {
					debounceDelay: 250,
					interrupt: true,
				}
			}
		}
	});


	grunt.registerTask('build', function(){
		grunt.task.run(
			'requirejs:compile'
		);
	});

	grunt.loadNpmTasks('can-compile');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', 'build');
};