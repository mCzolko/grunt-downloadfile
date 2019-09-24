/*
 * grunt-downloadfile
 * https://github.com/mCzolko/grunt-downloadfile
 *
 * Copyright (c) 2019 Michael Czolko
 * Licensed under the MIT license.
 */
var http = require('http'),
    https = require('https'),
    path = require('path'),
    nodeUrl = require('url'),
    fs = require('fs');

module.exports = function(grunt) {

  grunt.registerMultiTask('downloadfile', 'Download files without stress', function() {
    var done = this.async();
    var options = this.options({
      dest: './'
    });

    isHttps = (url) => nodeUrl.parse(url).protocol.indexOf('https') !== -1;

    // Create the destination directory
    var fileDir = path.resolve(options.dest || '.');
    grunt.file.mkdir(fileDir);

    var downloadFile = (fileName, url) => new Promise((resolve) => {
      var file = fs.createWriteStream(options.dest + '/' + fileName);
      grunt.log.writeln('Downloading '['cyan'] + fileName + ' from '['cyan'] + url);

      (isHttps(url) ? https : http).get(url, response => {
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', err => { // Handle errors
        throw new Error(err);
      });
    });

    var promises = [];
    var files = Object.keys(this.data);

    files.forEach(file => {
      var url = this.data[file];
      promises.push(downloadFile(file, url));
    });

    Promise
      .all(promises)
      .then(done)
    ;

  });
};