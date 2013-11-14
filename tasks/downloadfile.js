/*
 * grunt-downloadfile
 * https://github.com/mCzolko/grunt-downloadfile
 *
 * Copyright (c) 2013 Michael Czolko
 * Licensed under the MIT license.
 */
var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");


module.exports = function(grunt) {

  grunt.registerMultiTask('downloadfile', 'The best Grunt plugin ever.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      dest: './',
      port: 80,
      method: 'GET'
    });

    var done = this.async();

    var createRequestParams = function(fileUrl) {
      return {
        port: options.port,
        method: options.method,
        host: url.parse(fileUrl).hostname,
        path: url.parse(fileUrl).pathname
      };
    };

    var files = [];

    var downloadNext = function() {
      var file = files.shift();
      if (file) {
        file.end();
      } else {
        done();
      }
    };

    var chunkedResponse = function(filename, response) {
      var downloadfile = fs.createWriteStream(filename, {'flags': 'a'});
      var size = response.headers['content-length'];
      var dlprogress = 0;

      grunt.log.write(
        "Downloading file: " +
        filename.cyan +
        " (" +
        Math.ceil(response.headers['content-length'] / 1000) +
        " Kb)\n\n");

      response.on('data', function (chunk) {
        dlprogress += chunk.length;
        downloadfile.write(chunk);

        var prc = Math.floor(dlprogress * 100 / size);
        var pprc = prc / 2.5;
        var strprc = "";
        for (var i = 0; i < 40; i++) {
            if (pprc > i) {
                strprc += "=".red;
            } else {
                strprc += " ";
            }
        }

        sys.puts("\033[<1>A[" + strprc + "]  " + prc.toString().green + "%".green);
      });

      response.on("end", function() {
        downloadfile.end();
        downloadNext();
      });
    };


    var createRequest = function(fileUrl) {
      return http.request(createRequestParams(fileUrl), function (response) {
        chunkedResponse(getFileName(fileUrl), response);
      });
    };

    var downloadFile = function(fileUrl) {
      files.push(createRequest(fileUrl));
    };

    var getFileName = function(fileUrl) {
      return url.parse(fileUrl).pathname.split("/").pop();
    };

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      f.orig.src.map(function(fileUrl) {
        downloadFile(fileUrl);
      });
    });

    downloadNext();

  });
};