/*
 * grunt-downloadfile
 * https://github.com/mCzolko/grunt-downloadfile
 *
 * Copyright (c) 2013 Michael Czolko
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Connect server just for simulation internet behaviour.
    connect: {
      test: {
        options: {
          port: 9876,
          base: 'test/fixtures'
        }
      }
    },

    // Configuration to be run (and then tested).
    downloadfile: {
      options: {
        dest: 'tmp'
      },
      files: [
        {
          url: 'http://localhost/octopus.png',
          port: 9876,
          name: 'image.png'
        }
      ],
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'connect', 'downloadfile', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
