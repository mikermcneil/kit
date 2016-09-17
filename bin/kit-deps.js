#!/usr/bin/env node
require('machine-as-script')({


  friendlyName: 'kit deps',


  extendedDescription: 'This only works with NPM 2.x.',


  exits: {

    notAnNpmPackage: {
      description: 'This is not an NPM package.'
    },

    success: {
      outputFriendlyName: 'Dep. infos',
      outputDescription: 'A dictionary containing information about each dependency.',
      outputExample: {},
      extendedDescription:
      'Each key in this result is a dep\'s package name, and each value is another dictionary consisting of:\n'+
      ' - the userland package\'s declared semver range (`semverRange`), indicating which versions of this dependency are supported\n'+
      ' - the actual installed version (`installedVersion`)\n'+
      ' - the size of the installed dependency on disk (`size`)'
    }

  },


  fn: function (inputs, exits) {
    var path = require('path');
    var fs = require('fs');
    var _ = require('lodash');
    var async = require('async');
    var Filesystem = require('machinepack-fs');
    var Process = require('machinepack-process');
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
      doesNotExist: function() {
        return exits.notAnNpmPackage(err);
      },
      // Could not parse file as JSON.
      couldNotParse: function() {
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
                    return proceed(undefined, stats.size);
                  }// –•  Otherwise...

                  var totalDirSize = stats.size;

                  fs.readdir(item, function (err, dirContents) {
                    if (err) return proceed(err);

                    // Sum the sizes of each file/folder in this directory.
                    async.each(
                      dirContents,
                      function iteratee(dirItem, next) {
                        // ›···Each item in this subdirectory···‹

                        // Compute the size of each item in this subdirectory all of this  contents.
                        //
                        // > ƒ(…) | Make recursive call.
                        _recurse(path.join(item, dirItem), function (err, size) {
                          if (err) { return next(err); }
                          totalDirSize += size;
                          return next(err);
                        });//</made recusive call>

                      },//···‹Each item in this subdirectory›···

                      // ~∞%°  after async.each…
                      function afterwards(err) {
                        if (err) { return proceed(err); }

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
                  size: total
                };

                return next();

              });//</Filesystem.readJson() :: read dependency's package.json file)>
            });//</recursion (to figure out how big dependency is on disk)>
          },//</‹···Each dep declared in the package.json file···›

          // ~∞%°  after async.each…
          function afterwards(err) {
            if (err) { return exits.error(err); }

            return exits.success(depInfos);

          });//</async.each() :: get info about dependencies>

        } catch (e) { return exits.error(e); }
      }//—————— on success —————¬
    });//</Filesystem.readJson()>
  }

}).exec({
  success: function (depInfos){
    var _ = require('lodash');
    var chalk = require('chalk');

    var totalSize = 0;

    _.each(depInfos, function (depInfo, packageName) {

      var humanReadableSize = (function _getHumanReadableSize() {
        if (depInfo.size > 1000000) {
          return chalk.blue.dim('~')+chalk.blue(depInfo.size/1000000.0)+chalk.blue(' MB');
        }
        else if (depInfo.size > 1000) {
          return chalk.blue.dim('~')+chalk.blue(depInfo.size/1000.0)+chalk.blue(' kB');
        }
        else {
          return chalk.blue.dim('~')+chalk.blue(depInfo.size)+chalk.blue(' bytes');
        }
      })();

      console.log(
        // Package name + installed version
        chalk.bold(packageName)+'@'+depInfo.installedVersion + '  ' +
        // Only draw semver range if it's different than the actual installed version.
        (
          (depInfo.semverRange !== depInfo.installedVersion) ?
            '(svr: '+depInfo.semverRange+')   ' :
            ''
        )+
        // Size of installed package on disk
        humanReadableSize+'   '+
        chalk.gray('('+depInfo.size + ' bytes)')
      );

      totalSize += depInfo.size;

    });

    console.log();
    var humanReadableSize = (function _getHumanReadableSize() {
      if (totalSize > 1000000) {
        return chalk.blue.dim('~')+chalk.blue.bold(totalSize/1000000.0)+chalk.blue(' MB');
      }
      else if (totalSize > 1000) {
        return chalk.blue.dim('~')+chalk.blue.bold(totalSize/1000.0)+chalk.blue(' kB');
      }
      else {
        return chalk.blue.dim('~')+chalk.blue.bold(totalSize)+chalk.blue(' bytes');
      }
    })();
    console.log('Altogether, dependencies weigh in at ' + humanReadableSize);
    console.log();
    console.log(chalk.dim(' (Note that `devDependencies` and `optionalDependencies` were NOT included above.)'));
    console.log();


  }
});
