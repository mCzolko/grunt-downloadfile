# grunt-downloadfile

## Getting Started

This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-downloadfile --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-downloadfile');
```

## The "downloadfile" task

### Overview

In your project's Gruntfile, add a section named `downloadfile` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  downloadfile: {
    options: {
      dest: './node-versions',
      overwriteEverytime: false
    },
    files: {
      'node-v0.10.20.tar.gz': 'http://nodejs.org/dist/v0.10.20/node-v0.10.20.tar.gz',
      'node-v0.10.2.tar.gz': 'http://nodejs.org/dist/v0.10.2/node-v0.10.2.tar.gz'
    }
  }
})
```

### Options

#### options.dest

Type: `String`
Default value: `'./'`

Destination of downloaded files. If the folder doesn't exists grunt will create it.

#### options.overwriteEverytime

Type: `Boolean`
Default value: `false`

In case the download file is already present skip downloading. In case you want to overwrite file everytime pass `true`

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

v2 - New API, simplier configuration

## Author

Michael Czolko

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/N4N3145WR)
