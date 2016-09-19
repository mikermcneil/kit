#!/usr/bin/env node
require('machine-as-script')({


  friendlyName: 'kit deps',


  extendedDescription: 'This only works with NPM 2.x (see [this issue](https://github.com/npm/npm/issues/10361) for more info).',


  inputs: {

    verifiedReleases: {
      description: 'A dictionary mapping package names of common dependencies to the version string of a verified release.',
      extendedDescription:
      'On the Sails.js team, we prefer to pin the versions of 3rd party dependencies \n'+
      'from outside of the project, just because we\'ve been burned on more than one occasion \n'+
      'by patch or minor releases breaking functionality.  But while pinning depenency versions \n'+
      'is great for maintainability, security, and stability, it does have the effect of defeating \n'+
      'a powerful, built-in download size optimization in NPM. \n'+
      '\n'+
      'So, for certain *common* dependencies, like async and lodash, we\'re moving towards \n'+
      'standardizing the pinned version number across all of our modules.  This reduces overall \n'+
      '`npm install` time, makes for a more optimized bundle when browserifying, and, in general, \n'+
      'makes packages easier to understand and troubleshoot. \n'+
      '\n'+
      'This is a dictionary of those "verified" versions for *common deps*. \n'+
      '',
      example: {},
      defaultsTo: {
        'async': '2.0.1',
        'lodash': '3.10.1',
        'debug': '2.1.2',
        'chalk': '1.1.3',

        'commander': '2.8.1',
        'knex': '0.11.9',

        'bcryptjs': '2.3.0',
        'connect-redis': '3.1.0',

        'ejs': '2.3.4',
        'grunt': '1.0.1',
        'grunt-cli': '1.2.0',
        'grunt-contrib-clean': '1.0.0',
        'grunt-contrib-coffee': '1.0.0',
        'grunt-contrib-concat': '1.0.1',
        'grunt-contrib-copy': '1.0.0',
        'grunt-contrib-cssmin': '1.0.1',
        'grunt-contrib-jst': '1.0.0',
        'grunt-contrib-less': '1.3.0',
        'grunt-contrib-uglify': '1.0.1',
        'grunt-contrib-watch': '1.0.0',
        'grunt-hash': '0.5.0',
        'grunt-sails-linker': '0.10.1',
        'grunt-sync': '0.5.2',
        'rc': '1.0.1',
        // This is not a complete list.
        // (TODO: add to this list over time)
      }
    },

    trustedReleases: {
      description: 'A set of trusted releases of internal packages. Loose semver ranges will be tolerated as long as they match the specified semver range.',
      extendedDescription:
      'There are also certain dependencies which our team directly maintains.\n'+
      '\n'+
      'Since we have the direct ability to publish patches, we are ultimately responsible for\n'+
      'ensuring that those dependencies use proper semantic versioning.  In an effort to keep\n'+
      'us honest and make sure that we only break features on major version bumps, we use loose\n'+
      'semver ranges for our internal dependencies as much as possible.\n'+
      '\n'+
      'This is not by any means a complete list-- it just has a few of the most commonly-used\n'+
      'packages that we maintain.  It will be expanded over time.\n'+
      '',
      example: {},
      defaultsTo: {
        'sails': '*',

        'waterline': '*',
        'sails-disk': '*',
        'sails-postgresql': '0.11.4',

        'skipper': '*',
        'skipper-disk': '*',

        'sails-stdlib': '*',
        'stdlib': '*',
        'machinepack-ifthen': '*',
        'machinepack-strings': '*',
        'machinepack-numbers': '*',
        'machinepack-booleans': '*',
        'machinepack-dictionaries': '*',
        'machinepack-arrays': '*',
        'machinepack-json': '*',
        'machinepack-datetime': '*',
        'machinepack-math': '*',
        'machinepack-paths': '*',
        'machinepack-urls': '*',
        'machinepack-emailaddresses': '*',
        'machinepack-fs': '*',
        'machinepack-http': '*',
        'machinepack-process': '*',
        'machinepack-console': '*',
        'machinepack-util': '*',
        'machinepack-waterline': '*',
        'machinepack-sockets': '*',
        'machinepack-reqres': '*',
        'machinepack-sessionauth': '*',
        'machinepack-passwords': '*',
        'machinepack-mailgun': '*',
        'machinepack-gravatar': '*',
        'machinepack-sails': '*',

        'anchor': '*',
        'machine': '*',
        'rttc': '*',
        'aim-error-at': '*',

        'browserify-transform-machinepack': '*',
        'test-machinepack-mocha': '*',
        'test-machinepack': '*',

        // This is not a complete list
        // (TODO: add to this list and expand ranges as it makes sense, over time)
      }
    }

  },


  exits: {

    notAnNpmPackage: {
      description: 'This is not an NPM package.'
    }

  },


  fn: function (inputs, exits) {
    var path = require('path');
    var fs = require('fs');
    var _ = require('lodash');
    var chalk = require('chalk');
    var stripAnsi = require('strip-ansi');
    var async = require('async');
    var Filesystem = require('machinepack-fs');
    var Process = require('machinepack-process');
    var LocalMachinepacks = require('machinepack-localmachinepacks');
    var NPM = require('machinepack-npm');
    var getHumanReadableSize = require('../helpers/get-human-readable-size');
    var getHumanReadableDuration = require('../helpers/get-human-readable-duration');


    // A dictionary mapping the package names of common dependencies to the version number of a verified release.
    var VERIFIED_RELEASES_OF_COMMON_DEPS = inputs.verifiedReleases;


    // A set of trusted package names.
    // (loose semver ranges will be tolerated, as long as they are compatible with the specified semver range.)
    var TRUSTED_RELEASES_OF_CORE_DEPS = inputs.trustedReleases;



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
        try {

          // Build dictionary of info about each dependency.
          // (`devDependencies` and `optionalDependencies` are ignored)
          var depInfos = {};

          // Get info about dependencies.
          //
          // > Simultaneously iterate over every item in this array.
          async.each(_.keys(packageMeta.dependencies), function (packageName, next) {
            // ›···Each dep declared in the package.json file···‹



            //  ┌─┐┌─┐┬  ┌─┐┬ ┬┬  ┌─┐┌┬┐┌─┐  ┬ ┬┌─┐┬ ┬  ┌┐ ┬┌─┐
            //  │  ├─┤│  │  │ ││  ├─┤ │ ├┤   ├─┤│ ││││  ├┴┐││ ┬
            //  └─┘┴ ┴┴─┘└─┘└─┘┴─┘┴ ┴ ┴ └─┘  ┴ ┴└─┘└┴┘  └─┘┴└─┘
            //  ┌─    ┬─┐┌─┐┌─┐┬ ┬┬─┐┌─┐┬┬  ┬┌─┐    ─┐
            //  │───  ├┬┘├┤ │  │ │├┬┘└─┐│└┐┌┘├┤   ───│
            //  └─    ┴└─└─┘└─┘└─┘┴└─└─┘┴ └┘ └─┘    ─┘
            var absPathToDep = path.resolve('node_modules/', packageName);

            // Look it up on disk and figure out how big.
            //
            // > Note:  Could have done `Process.executeCommand({ command: 'du -h '+absPathToDep }).exec(...)`
            // > except that it doesn't work on windows.  So instead, I modified a quick hack from
            // > StackOverflow (see http://stackoverflow.com/a/7550430/486547).
            (
              // ‹ƒ·∞› | Define self-calling recursive iteratee.
              function _recurse(item, proceed) {
                // ›···On directory···‹

                fs.lstat(item, function (err, stats) {
                  if (err) { return proceed(err); }

                  // If this is not a directory...
                  if (!stats.isDirectory()) {
                    // console.log('• `'+item+'` is '+stats.size+' bytes');
                    return proceed(undefined, stats.size);
                  }// –•  Otherwise...

                  var totalDirSize = 0;
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  // ^
                  // Note that we don't include the built-in size of directories (i.e. we don't do `var totalDirSize = stats.size`)
                  // We're not calculating the "size on disk" here -- just the raw size.
                  // In other words, doing it this way makes it match the first "size" displayed in Finder--
                  // but not the "size on disk" (the part in parentheses).  Similarly, this doesn't give you the same results
                  // as `du -h`, since that shows size on disk too.
                  //
                  // Anyway, all that's fine-- the point of this is to have a frame of reference of how big things are, and how
                  // the total size of your package/app changes (%) as you make changes to your dependencies or package.json file.
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


                  fs.readdir(item, function (err, dirContents) {
                    if (err) { return proceed(err); }

                    // Sum the sizes of each file/folder in this directory.
                    async.each(
                      dirContents,
                      function iteratee(dirItem, next) {
                        // ›···Each item in this subdirectory···‹


                        var dirItemPath = path.join(item, dirItem);

                        // Compute the size of each item in this subdirectory all of this  contents.
                        //
                        // > ƒ(…) | Make recursive call.
                        _recurse(dirItemPath, function (err, size) {
                          if (err) { return next(err); }
                          totalDirSize += size;
                          // console.log('                    .–¬˛ `'+item+'` dir now has a total of '+totalDirSize+' bytes');
                          return next(err);
                        });//</made recusive call>

                      },//···‹Each item in this subdirectory›···

                      // ~∞%°  after async.each…
                      function afterwards(err) {
                        if (err) { return proceed(err); }

                        // console.log('.–¬˛ `'+item+'` is '+totalDirSize+' bytes');
                        return proceed(undefined, totalDirSize);

                      }
                    );//</async.each() to get sum of all file/subdirectory sizes, recursively>

                  });//</fs.readdir()>

                });//</fs.lstat()>

              }//···‹On directory›···
            )
            // ƒ(…) | Kick off recursion.
            (absPathToDep,

            // ~∞%°  after recursion…
            function afterwards(err, total){
              if (err) { return next(err); }

              // Now read this dependency's package.json file.
              Filesystem.readJson({
                source: path.resolve(absPathToDep, 'package.json'),
                schema: {}
              }).exec(function (err, dependencyPkgMD) {
                if (err) { return next(err); }

                // Finally build the depInfo dictionary for this dependency.
                depInfos[packageName] = {
                  semverRange: packageMeta.dependencies[packageName],
                  installedVersion: dependencyPkgMD.version,

                  isCommon: !_.isUndefined(VERIFIED_RELEASES_OF_COMMON_DEPS[packageName]),
                  verifiedReleaseVersion: VERIFIED_RELEASES_OF_COMMON_DEPS[packageName] || '',
                  isInstalledVersionVerified:
                    !_.isUndefined(VERIFIED_RELEASES_OF_COMMON_DEPS[packageName]) ?
                      VERIFIED_RELEASES_OF_COMMON_DEPS[packageName] === dependencyPkgMD.version :
                      false,

                  isCore: !_.isUndefined(TRUSTED_RELEASES_OF_CORE_DEPS[packageName]),
                  trustedSemverRange: TRUSTED_RELEASES_OF_CORE_DEPS[packageName],
                  isInstalledVersionTrusted:
                    !_.isUndefined(TRUSTED_RELEASES_OF_CORE_DEPS[packageName]) ?
                      NPM.isVersionCompatible({ version: dependencyPkgMD.version, semverRange: TRUSTED_RELEASES_OF_CORE_DEPS[packageName] }).execSync() :
                      false,

                  size: total,
                };

                return next();

              });//</Filesystem.readJson() :: read dependency's package.json file)>
            });//</recursion (to figure out how big dependency is, as far as bytes)>
          },//</‹···Each dep declared in the package.json file···›

          // ~∞%°  after async.each…
          function afterwards(err) {
            if (err) { return exits.error(err); }


            //  ┬─┐┌─┐┬  ┬    ┬ ┬┌─┐  ┬┌┐┌┌─┐┌─┐
            //  ├┬┘│ ││  │    │ │├─┘  ││││├┤ │ │
            //  ┴└─└─┘┴─┘┴─┘  └─┘┴    ┴┘└┘└  └─┘
            //  ┌─    ┌─┐┌┐ ┌─┐┬ ┬┌┬┐  ╔═╗╦  ╦    ╔╦╗╔═╗╔═╗╔═╗    ─┐
            //  │───  ├─┤├┴┐│ ││ │ │   ╠═╣║  ║     ║║║╣ ╠═╝╚═╗  ───│
            //  └─    ┴ ┴└─┘└─┘└─┘ ┴   ╩ ╩╩═╝╩═╝  ═╩╝╚═╝╩  ╚═╝    ─┘

            // Calculate total size of all dependencies.
            var totalSize = 0;
            _.each(depInfos, function (depInfo, packageName) {
              totalSize += depInfo.size;
            });


            // Used for coffee shop download time calculations below.
            var COFFEE_SHOP_MEGABYTES_PER_SEC = 2;


            // Used for padding below.
            var COLUMN_1_MAX_WIDTH = 75;
            var COLUMN_2_MAX_WIDTH = 15;


            // Used for storing output that will be logged below.
            var outputTable = [];

            // Build and print output.
            _.each(depInfos, function (depInfo, packageName) {

              // Figure out some facts about the installed version vs. semver range.
              var isDefinitelyNotPinned = (depInfo.semverRange[0]==='^' || depInfo.semverRange[0]==='~');
              var isSameVersion = (depInfo.semverRange === depInfo.installedVersion);
              var isMinVersion;
              if (isDefinitelyNotPinned) {
                isMinVersion = depInfo.semverRange.slice(1) === depInfo.installedVersion;
              }
              else {
                isMinVersion = true;
              }
              var isDifferentEnoughToMaybeMatter = !isSameVersion && !isMinVersion;



              var column1 = '';


              // Package name
              if (depInfo.isCore) {
                column1 += chalk.bold.green(packageName);
              }
              else {
                column1 += chalk.bold(packageName);
              }


              // Installed version & semver range
              // ========================================================================
              // Core deps
              if (depInfo.isInstalledVersionTrusted) {
                // Installed version is a trusted release of a core dependency!
                column1 += chalk.green('@'+depInfo.installedVersion);
              }
              // Common deps
              else if (depInfo.isCommon) {
                if (depInfo.isInstalledVersionVerified) {
                  // Installed version is the verified/recommended one!
                  column1 += chalk.green('@'+depInfo.installedVersion);
                }
                else {
                  // Installed version is NOT the verified/recommended one.
                  column1 += chalk.yellow('@'+depInfo.installedVersion);
                }
              }
              // Misc deps
              else {
                // Installed version might or might not be ok...
                //
                // If this is DEFINITELY not a pinned dependency (meaning it is a loose semver range...)
                if (isDefinitelyNotPinned) {
                  column1 += '@'+depInfo.installedVersion;
                }
                // Otherwise, it's probably a pinned dependency version, which means it's probably fine.
                else {
                  column1 += '@'+depInfo.installedVersion;
                }
              }

              // >-
              column1 += '  ';

              // Draw semver range, but only if it's different enough from the actual
              // installed version to maybe matter.
              //
              // > If version is definitely not pinned, we mention that.
              // > (it might be fine-- if it's a dep you trust- but you still need to know)
              if (isDifferentEnoughToMaybeMatter) {

                // If this is a core dependency, and the installed version is in the
                // trusted semver range, even though the installed version is different
                // from the range, draw the range subtly.
                if (depInfo.isInstalledVersionTrusted) {
                  column1 += chalk.green.dim('('+depInfo.semverRange+')')+'   ';
                }
                // If this is a common dependency...
                else if (depInfo.isCommon) {
                  // Even if installed version is verified, since semver range is not pinned,
                  // draw it kind of angry.
                  if (depInfo.isInstalledVersionVerified) {
                    column1 += chalk.yellow('('+depInfo.semverRange+')')+'   ';
                  }
                  // If installed version is NOT verified, draw it even more angry!
                  else if (depInfo.isCommon && !depInfo.isInstalledVersionVerified) {
                    column1 += chalk.red('('+depInfo.semverRange+')')+'   ';
                  }
                }
                // Otherwise, draw it kind of angry.
                else {
                  column1 += chalk.yellow('('+depInfo.semverRange+')')+'   ';
                }
              }// >-




              var column2 = (

                // Size of installed dep in the appropriate unit
                getHumanReadableSize(depInfo.size)
              );



              // Calculate coffee shop seconds for this particular dep
              var coffeeShopSeconds = Math.floor(( (depInfo.size/1000000) / COFFEE_SHOP_MEGABYTES_PER_SEC )*1000)/1000;

              // Column 3
              var column3 = (
                // Time to download this dep on coffee shop internet
                getHumanReadableDuration(coffeeShopSeconds)
              );

              outputTable.push([
                column1,
                column2,
                column3
              ]);


            });//</_.each() :: depInfos>


            var maxCol1Width = Math.min(COLUMN_1_MAX_WIDTH, _.max(_.map(outputTable, function eachRow(columns){ return stripAnsi(columns[0]).length; })));
            var maxCol2Width = Math.min(COLUMN_2_MAX_WIDTH, _.max(_.map(outputTable, function eachRow(columns){ return stripAnsi(columns[1]).length; })));
            var MIN_PADDING = 2;
            // console.log('maxCol1Width',maxCol1Width);
            // console.log('maxCol2Width',maxCol2Width);

            _.each(outputTable, function eachRow(columns){

              // Padding for readability
              var padding1 = (function (){
                var padding = '';
                var numPaddingChars = maxCol1Width - stripAnsi(columns[0]).length + MIN_PADDING;
                // If we end up with a number <= 0, (i.e. because it's too long),
                // then just act like it's empty string.  (Lodash does this automatically.)
                padding = _.repeat(' ', numPaddingChars);
                return padding;
              })();

              var padding2 = (function (){
                var padding = '';
                var numPaddingChars = maxCol2Width - stripAnsi(columns[1]).length + MIN_PADDING;
                // If we end up with a number <= 0, (i.e. because it's too long),
                // then just act like it's empty string.  (Lodash does this automatically.)
                padding = _.repeat(' ', numPaddingChars);
                return padding;
              })();

              console.log(
                columns[0] +
                padding1 +
                columns[1] +
                padding2 +
                columns[2]+
                ''
              );

            });


            console.log();
            console.log('Altogether, dependencies weigh in at ' + getHumanReadableSize(totalSize));
            // Calculate total coffee shop seconds
            var totalCoffeeShopSeconds = Math.floor(( (totalSize/1000000) / COFFEE_SHOP_MEGABYTES_PER_SEC )*100)/100;
            console.log('(that will take an average of '+getHumanReadableDuration(totalCoffeeShopSeconds)+' on coffee shop internet)');
            console.log();
            console.log(chalk.dim(' (Note that `devDependencies` and `optionalDependencies` were NOT included above.)'));
            console.log();

            // Done!
            return exits.success();

          });//</async.each() :: get info about dependencies>

        } catch (e) { return exits.error(e); }
      }//—————— on success —————¬
    });//</Filesystem.readJson()>
  }

}).exec();
