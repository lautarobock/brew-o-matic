//Grunt is just JavaScript running in node, after all...
module.exports = function(grunt) {

	// All upfront config goes in a massive nested object.
 	grunt.initConfig({
	    // You can set arbitrary key-value pairs.
	    distFolder: 'dist',
	    // You can also set the value of a key as parsed JSON.
	    // Allows us to reference properties we declared in package.json.
	    pkg: grunt.file.readJSON('package.json'),
	    // Grunt tasks are associated with specific properties.
	    // these names generally match their npm package name.
	    concat: {
	      // Specify some options, usually specific to each plugin.
			options: {
				// Specifies string to be inserted between concatenated files.
				separator: ';'
			},
			// 'dist' is what is called a "target."
			// It's a way of specifying different sub-tasks or modes.
			dist: {
				// The files to concatenate:
				// Notice the wildcard, which is automatically expanded.
				src: ['js/**/*.js'],
				// The destination file:
				// Notice the angle-bracketed ERB-like templating,
				// which allows you to reference other properties.
				// This is equivalent to 'dist/main.js'.
				dest: '<%= distFolder %>/lautarobock-ng-util.js'
				// You can reference any grunt config property you want.
				// Ex: '<%= concat.options.separator %>' instead of ';'
			}
	    },
	    uglify: {
		    options: {
		    	mangle: false
		    },
		    my_target: {
				files: {
					'dist/lautarobock-ng-util.min.js': ['dist/lautarobock-ng-util.js']
				}
		    }
		},
		ngtemplates: {
			'gt.listview.tpls': {
				cwd: 'html',
				src: 'listview/*.html',
				dest: 'js/templates.js',
				options:{
					bootstrap:  function(module, script) {
						return '' +
							' 	angular.module("gt.listview.tpls", []).run(["$templateCache", function($templateCache) { ' + 
							script + 
							'	}]);';
					}
				}
			}
		},
		karma: {
			unit: {
				configFile: 'client_test/karma.conf.js'
			},
			cont: {
				configFile: 'client_test/karma.conf.js',
				singleRun: true
			}
		}
  	}); // The end of grunt.initConfig

	// We've set up each task's configuration.
	// Now actually load the tasks.
	// This will do a lookup similar to node's require() function.
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.loadNpmTasks('grunt-contrib-uglify');

	//for angular template concatenation
	grunt.loadNpmTasks('grunt-angular-templates');

	grunt.loadNpmTasks('grunt-karma');

	// Register our own custom task alias.
	grunt.registerTask('build', ['ngtemplates','concat','uglify']);

	grunt.registerTask('test', ['karma:cont']);
};