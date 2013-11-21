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
      async: true,
      dest: './',
      port: 80,
      method: 'GET'
    });


    var done = this.async();
    var files = [];
    var running = false;


    var complete = function() {
      sys.puts("\033[<" + (files.length * 2) + ">B");
      done();
    };


    var downloadNextSync = function() {
      var file = false;
      files.forEach(function (fileObject) {
        if (!fileObject.downloaded && !fileObject.downloading) {
          file = fileObject;
        }
      });
      if (file) {
        file['request'] = createRequest(file);
        file.request.end();
      } else {
        complete();
      }
    };


    var isItDone = function() {
      var downloded = files.filter(function (file) {
       return !file.downloaded;
      });
      return !downloded.length;
    };


    var downloadNext = function() {
      if (options.async) {
        if (isItDone()) {
          complete();
        } else {
          if (!running) {
            running = true;
            files.forEach(function (file) {
              file['request'] = createRequest(file);
              file.request.end();
            });
          }
        }
      } else {
        downloadNextSync();
      }
    };

    var notifyOne = function(file) {
      grunt.log.write(
        "Downloading file: " +
        file.filePath.cyan +
        " (" +
        Math.ceil(file.size / 1000) +
        " Kb)\n");

      var prc = Math.floor(file.dlprogress * 100 / file.size);
      var pprc = prc / 2.5;
      var strprc = "";
      for (var i = 0; i < 40; i++) {
        if (pprc > i) {
          strprc += "=".green;
        } else {
          strprc += " ";
        }
      }

      if (file.size === 0) {
        prc = 0;
      }

      sys.puts("\033[K["+ strprc +"]  " + prc.toString() + "%");

    };


    var notify = function() {
      files.forEach(notifyOne);
      sys.puts("\033[<" + (files.length * 2 + 1) + ">A");
    };


    var chunkedResponse = function (file, response) {
      file.downloading = true;
      var downloadfile = fs.createWriteStream(file.tmpPath, {'flags': 'w'});

      file['size'] = response.headers['content-length'];

      response.on('end', function () {
        downloadfile.end(function () {
          fs.renameSync(file.tmpPath, file.filePath);
          file.downloaded = true;
          file.downloading = false;
          downloadNext();
        });
      });
      response.pipe(downloadfile);
    };


    var createRequest = function(file) {
      file['host'] = url.parse(file.url).hostname;
      file['path'] = url.parse(file.url).pathname;

      if (fs.existsSync(file.filePath)) {
        grunt.log.writeln('skip download: file exists ' + file.filePath);

        return {
          'end':function() {
            file.downloaded = true;
            file.downloading = false;
            downloadNext();
        }};
      }

      if (fs.existsSync(file.tmpPath)) {
        fs.unlinkSync(file.tmpPath);
      }

      return http.request(file, function (response) {
        chunkedResponse(file, response);
      });
    };


    var downloadFile = function(file) {
      if (typeof file === 'string') {
        var fileUrl = file;
        file = {
          url: fileUrl
        };
      }

      if (!file.dest) {
        file['dest'] = options.dest;
      }
      if (!file.port) {
        file['port'] = options.port;
      }
      if (!file.method) {
        file['method'] = options.method;
      }
      if (!file.method) {
        file['method'] = options.method;
      }
      if (!file.name) {
        file['name'] = url.parse(file.url).pathname.split("/").pop();
      }

      file['downloaded'] = false;
      file['downloading'] = false;
      file['dlprogress'] = 0;
      file['size'] = 0;
      file['filePath'] = path.join(file.dest, file.name);
      file['tmpPath'] = path.join(file.dest,'.' + file.name);

      // Create the destination directory
      var fileDir = path.dirname(file.filePath);
      grunt.file.mkdir(fileDir);

      files.push(file);
    };


    this.files.forEach(function(f) {
      f.orig.src.map(function(file) {
        downloadFile(file);
      });
    });


    downloadNext();

  });
};