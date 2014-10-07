'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9000,
          base: '.',
          keepalive: true
        }
      }
    }
  });

};