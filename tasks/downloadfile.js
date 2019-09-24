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
      dest: './',
      overwriteEverytime: false
    });

    isHttps = (url) => nodeUrl.parse(url).protocol.indexOf('https') !== -1;

    // Create the destination directory
    var fileDir = path.resolve(options.dest || '.');
    grunt.file.mkdir(fileDir);

    var downloadFile = (fileName, url) => new Promise((resolve) => {
      var file = fs.createWriteStream(options.dest + '/' + fileName);

      (isHttps(url) ? https : http).get(url, response => {
        var isRedirect = response.statusCode === 302;
        if (isRedirect) {
          var newUrl = response.headers.location;
          grunt.log.writeln('Redirect '['cyan'] + url + ' to '['cyan'] + newUrl);
          return downloadFile(fileName, newUrl).then(resolve);
        }
        grunt.log.writeln('Downloading '['cyan'] + fileName + ' from '['cyan'] + url);

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

      if (!options.overwriteEverytime) {
        if (fs.existsSync(options.dest + '/' + file)) {
          grunt.log.writeln('File ' + file['cyan'] + ' exists, skipping download');
          return;
        }
      }

      promises.push(downloadFile(file, url));
    });

    Promise
      .all(promises)
      .then(done)
    ;

  });
};