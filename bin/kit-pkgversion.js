#!/usr/bin/env node

require('machine-as-script')({
  machine: {


    exits: {

      notAnNpmPackage: {
        description: 'This is not an NPM package.'
      },

      success: {
        example: '0.0.0'
      }

    },


    fn: function (inputs, exits) {
      var path = require('path');
      var Filesystem = require('machinepack-fs');

      Filesystem.readJson({
        source: path.resolve('package.json'),
        schema: {},
      }).exec({
        // An unexpected error occurred.
        error: function(err) {
          return exits.error(err);
        },
        // No file exists at the provided `source` path
        doesNotExist: function() {
          return exits.notAnNpmPackage(err);
        },
        // Could not parse file as JSON.
        couldNotParse: function() {
          return exits.notAnNpmPackage(err);
        },
        // OK.
        success: function(packageMeta) {
          return exits.success(packageMeta.version);
        }
      });
    }
  }
}).exec();
