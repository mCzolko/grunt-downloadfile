# grunt-downloadfile

> Downloading files anywhere from internet world!.
> ![ScreenShot](http://photos-4.dropbox.com/t/0/AAAcYlDi0slRatDnqn_JXSZxaU_C3B9NmiesJhsDYKFC1w/12/22904342/png/1024x768/3/1384794000/0/2/Screenshot%202013-11-14%2015.11.37.png/In7WCHu2FYHpF0lVlhzUlCFfoIWJ3cBVNvneB8pWwv0)

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
    files: [
      'http://nodejs.org/dist/v0.10.20/node-v0.10.20.tar.gz',
      'http://nodejs.org/dist/v0.10.2/node-v0.10.2.tar.gz'
    ]
  },
})
```

### Per file configuration
If you want more configuration.
```js
grunt.initConfig({
  downloadfile: {
      files: [
        {
          url: 'http://localhost/octopus.png',
          port: 9876,
          dest: 'tmp',
          name: 'image.png'
        }
      ]
  },
})
```

### Options

#### options.async
Type: `Boolean`
Default value: `true`

Provides you option to download multiple files asynchronous or file after file.

#### options.dest
Type: `String`
Default value: `'./'`

Destination of downloaded files. If folder doesn't exists, grunt will create it.

#### options.port
Type: `Number`
Default value: `80`

Specifies which port will be used for connecting to host.

#### options.method
Type: `String`
Default value: `'GET'`

HTTP method. Only GET is supported now.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
