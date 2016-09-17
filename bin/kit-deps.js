#!/usr/bin/env node
require('machine-as-script')({


  friendlyName: 'kit deps',


  extendedDescription: 'This only works with NPM 2.x (see [this issue](https://github.com/npm/npm/issues/10361) for more info).',


  inputs: {

    width: {
      description: 'The width for the main column.',
      example: 65,
      defaultsTo: 65
    }

  },


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
      ' - the size of the installed dependency (`size`) -- note that this is the raw size in bytes-- not the "size on disk"'
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
                    if (err) return proceed(err);

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
                  size: total
                };

                return next();

              });//</Filesystem.readJson() :: read dependency's package.json file)>
            });//</recursion (to figure out how big dependency is, as far as bytes)>
          },//</‹···Each dep declared in the package.json file···›

          // ~∞%°  after async.each…
          function afterwards(err) {
            if (err) { return exits.error(err); }


            var totalSize = 0;


            // Used for padding below.
            var COLUMN_1_WIDTH = inputs.width;

            _.each(depInfos, function (depInfo, packageName) {

              var humanReadableSize = (function _getHumanReadableSize() {
                if (depInfo.size > 1000000) {
                  // return chalk.blue.dim('~')+chalk.blue(depInfo.size/1000000.0)+chalk.blue(' MB');
                  return chalk.blue.dim('~')+chalk.blue( Math.floor((depInfo.size/1000000.0)*100)/100 )+chalk.blue(' MB');
                }
                else if (depInfo.size > 1000) {
                  return chalk.blue.dim('~')+chalk.blue.dim( Math.floor((depInfo.size/1000.0)*100)/100 )+chalk.blue.dim(' KB');
                }
                else {
                  return chalk.blue.dim('~')+chalk.gray(depInfo.size)+chalk.gray(' bytes');
                }
              })();

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


              // If version is definitely not pinned, mention that.
              // (it might be fine-- if it's a dep you trust- but you still need to know)
              // (
              //   isDefinitelyNotPinned ?
              //     chalk.green.dim('(not pinned)') :
              //     ''
              // )

              var column1 = (
                // Package name + installed version
                (
                  isDefinitelyNotPinned ?
                    chalk.bold.green(packageName)+'@'+depInfo.installedVersion :
                    chalk.bold(packageName)+'@'+depInfo.installedVersion
                )+'  '+
                // Draw semver range, but only if it's different enough from the actual
                // installed version to maybe matter.
                (
                  isDifferentEnoughToMaybeMatter ?
                    chalk.yellow.dim('('+depInfo.semverRange+')')+'   ' :
                    ''
                )
              );


              // Padding for readability
              var padding = '';
              var numPaddingChars = COLUMN_1_WIDTH - stripAnsi(column1).length;
              // If we end up with a number <= 0, (i.e. because it's too long),
              // then just skip ahead.
              if (numPaddingChars > 0) {
                padding = _.repeat(' ', numPaddingChars);
              }

              var column2 = (
                // Size of installed package in the appropriate unit
                humanReadableSize
              );


              // Build final console output.
              var consoleOutput = (
                column1 +
                padding +
                column2 +
                '  ' + chalk.red(COLUMN_1_WIDTH + ' - ' + stripAnsi(column1).length + ' (vs '+column1.length+') ' + ' = ' + numPaddingChars + ' ::' + stripAnsi(column1))
              );

              console.log(consoleOutput);



              totalSize += depInfo.size;

            });

            console.log();
            var humanReadableSize = (function _getHumanReadableSize() {
              if (totalSize > 1000000) {
                return chalk.blue.dim('~')+chalk.blue.bold( Math.floor((totalSize/1000000.0)*100)/100 )+chalk.blue(' MB');
              }
              else if (totalSize > 1000) {
                return chalk.blue.dim('~')+chalk.blue.dim.bold( Math.floor((totalSize/1000.0)*100)/100 )+chalk.blue.dim(' KB');
              }
              else {
                return chalk.blue.dim('~')+chalk.gray.bold(totalSize)+chalk.gray(' bytes');
              }
            })();
            console.log('Altogether, dependencies weigh in at ' + humanReadableSize);
            console.log();
            console.log(chalk.dim(' (Note that `devDependencies` and `optionalDependencies` were NOT included above.)'));
            console.log();

            // Done!
            return exits.success(depInfos);

          });//</async.each() :: get info about dependencies>

        } catch (e) { return exits.error(e); }
      }//—————— on success —————¬
    });//</Filesystem.readJson()>
  }

}).exec();
