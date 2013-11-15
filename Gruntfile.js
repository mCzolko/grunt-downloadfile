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

    // Configuration to be run (and then tested).
    downloadfile: {
      options: {
        dest: 'temp'
      },
      files: [
        {
          url: 'http://nodejs.org/dist/v0.10.20/node-v0.10.20.tar.gz',
          name: 'newest.tar.gz'
        },
        {
          url: 'http://nodejs.org/dist/v0.10.4/node-v0.10.4.tar.gz',
          name: 'middle.tar.gz'
        },
        {
          url: 'http://nodejs.org/dist/v0.10.2/node-v0.10.2.tar.gz',
          name: 'older.tar.gz'
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

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'downloadfile', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
