#!/usr/bin/env node

require('machine-as-script')({


  friendlyName: 'kit pkg',


  exits: {

    notAnNpmPackage: {
      description: 'This is not an NPM package.'
    },

    success: {
      example: {}
    }

  },


  fn: function (inputs, exits) {
    var path = require('path');
    var _ = require('lodash');
    var Filesystem = require('machinepack-fs');
    var LocalMachinepacks = require('machinepack-localmachinepacks');
    var NPM = require('machinepack-npm');

    Filesystem.readJson({
      source: path.resolve('package.json'),
      schema: {},
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return exits.error(err);
      },
      // No file exists at the provided `source` path
      doesNotExist: function(err) {
        return exits.notAnNpmPackage(err);
      },
      // Could not parse file as JSON.
      couldNotParse: function(err) {
        return exits.notAnNpmPackage(err);
      },
      // OK.
      success: function(packageMeta) {

        var str = JSON.stringify(packageMeta);

        // Parse metadata for the latest version of the NPM package given a package.json string.
        var npmMetadata = NPM.parsePackageJson({
          json: str,
        }).execSync();

        // Parse machinepack data from the provided JSON string.
        var mpMetadata = {};
        try {
          mpMetadata = LocalMachinepacks.parseMachinepackMetadata({
            json: str,
          }).execSync();
        }
        catch (e){ /* fail silently */ }
        return exits.success(_.merge(npmMetadata, mpMetadata));
      }
    });
  }

}).exec({
  success: function (parsedMetadata){
    var chalk = require('chalk');

    console.log('-----------------------------------------------------------------');

    // Package name  (+machinepack friendly name)
    console.log(chalk.bold(parsedMetadata.name) + (parsedMetadata.friendlyName?'   ('+parsedMetadata.friendlyName+')':''));
    // Description
    if (parsedMetadata.description) {
      console.log(parsedMetadata.description);
    }
    // Version
    console.log('v'+parsedMetadata.version);
    // License
    if (parsedMetadata.license) {
      console.log(chalk.gray(parsedMetadata.license + ' License'));
    }
    else {
      console.log(chalk.gray('No license specified.'));
    }
    console.log();



    // URLs
    if (parsedMetadata.npmUrl) {
      console.log('> '+chalk.underline(parsedMetadata.npmUrl));
    }
    if (parsedMetadata.sourceUrl) {
      console.log('> '+chalk.underline(parsedMetadata.sourceUrl));
    }
    if (parsedMetadata.nodeMachineUrl) {
      console.log('> '+chalk.underline(parsedMetadata.nodeMachineUrl));
    }
    console.log('-----------------------------------------------------------------');
    console.log();

  }
});
