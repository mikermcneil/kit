#!/usr/bin/env node
require('machine-as-script')({


  friendlyName: 'kit install',


  description: 'Install the verified/trusted release of a dependency, then save it to the package.json file.',


  inputs: {

    dev: {
      description: 'Whether to save this as a dev dependency.',
      example: false
    },

    verifiedReleases: {
      description: require('../constants/verified-releases.type').description,
      extendedDescription: require('../constants/verified-releases.type').extendedDescription,
      example: require('../constants/verified-releases.type').example,
      defaultsTo: require('../constants/verified-releases.type').defaultsTo
    },

    trustedReleases: {
      // Note that, for these, loose semver ranges will be tolerated as long as they match the specified semver range.
      description: require('../constants/trusted-releases.type').description,
      extendedDescription: require('../constants/trusted-releases.type').extendedDescription,
      example: require('../constants/trusted-releases.type').example,
      defaultsTo: require('../constants/trusted-releases.type').defaultsTo,
    }

  },


  exits: {

    notAnNpmPackage: {
      description: 'This is not an NPM package.'
    }

  },


  fn: function (inputs, exits, env) {
    var path = require('path');
    var _ = require('lodash');
    var chalk = require('chalk');
    var async = require('async');
    var Filesystem = require('machinepack-fs');
    var NPM = require('machinepack-npm');


    // A dictionary mapping the package names of common dependencies to the version number of a verified release.
    var VERIFIED_RELEASES_OF_COMMON_DEPS = inputs.verifiedReleases;

    // A set of trusted package names.
    // (loose semver ranges will be tolerated, as long as they are compatible with the specified semver range.)
    var TRUSTED_RELEASES_OF_CORE_DEPS = inputs.trustedReleases;


    // --•
    // If we made it here, we're dealing with a common or core dependency.
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
      success: function(destPkgMD) {

        var depsToInstall;

        // If serial command-line arguments were specified, use them.
        if (env.serialCommandLineArgs.length > 0) {
          depsToInstall = _.map(env.serialCommandLineArgs, function (pkgName){
            return {
              name: pkgName,
              kind: inputs.dev ? 'dev' : ''
            };
          });
        }
        // Otherwise use the existing dependencies and dev dependencies of this package.
        // (in this case, the `--dev` flag should never be used)
        else {
          if (!_.isUndefined(inputs.dev)) {
            return exits.error(new Error('The `dev` option should only be used when also specifying NEW dependencies to install.'));
          }

          depsToInstall = [];
          _.each(destPkgMD.dependencies, function (semverRange, pkgName){
            depsToInstall.push({ name: pkgName, kind: '' });
          });
          _.each(destPkgMD.devDependencies, function (semverRange, pkgName){
            depsToInstall.push({ name: pkgName, kind: 'dev' });
          });
        }


        // Now install all deps.
        async.eachLimit(depsToInstall, 5, function (depInfo, done){

          try {

            // Set up local variable for pkg name to install.
            var nameOfPkgToInstall = depInfo.name;

            // Check if the specified package is in list of common dependencies.
            var verifiedVersion = VERIFIED_RELEASES_OF_COMMON_DEPS[nameOfPkgToInstall];
            var isCommon = !_.isUndefined(verifiedVersion);

            // Check if the specified package is in list of core dependencies.
            var trustedSemverRange = TRUSTED_RELEASES_OF_CORE_DEPS[nameOfPkgToInstall];
            var isCore = !_.isUndefined(trustedSemverRange);


            // Check to see if dep is already there.
            // (check deps AND devDeps... but not optionalDeps because we never use that)
            var depSemverRange;
            if (destPkgMD.dependencies) {
              depSemverRange = destPkgMD.dependencies[nameOfPkgToInstall];
            }
            var devDepSemverRange;
            if (destPkgMD.devDependencies) {
              devDepSemverRange = destPkgMD.devDependencies[nameOfPkgToInstall];
            }
            var relevantExistingSemverRange = !_.isUndefined(depSemverRange) ? depSemverRange : devDepSemverRange;

            // If so, then it may still be overridden, or we might still bail early.

            // Under a few circumstances, we'll bail now w/ an error msg:
            // (or if it is in there BUT WRONG, then log a slightly different message)
            if (depInfo.kind === 'dev' && !_.isUndefined(depSemverRange)) {
              return done(new Error(nameOfPkgToInstall + ' is already in the package.json file, but as a normal (non-dev) dependency! ('+depSemverRange+').'));
            }
            else if (depInfo.kind === '' && !_.isUndefined(devDepSemverRange)) {
              return done(new Error(nameOfPkgToInstall + ' is already in the package.json file, but as a dev dependency! ('+devDepSemverRange+').'));
            }
            else if (!_.isUndefined(depSemverRange) || !_.isUndefined(devDepSemverRange)) {

              var logMsgPrefix = chalk.bold.cyan(nameOfPkgToInstall) + ' is already in the package.json file.';

              if (isCommon) {
                if (relevantExistingSemverRange !== verifiedVersion) {
                  console.log(logMsgPrefix);
                  console.log('But the existing semver range (`'+relevantExistingSemverRange+'`) isn\'t quite right.');
                  console.log('Should instead be pinned to '+verifiedVersion+'.  Proceeding to install and save...');
                }
                else {
                  console.log(logMsgPrefix + chalk.gray('  ✓ Skipping... b/c it is already pinned to a verified version.'));
                  return done();
                }
              }
              else if (isCore) {
                // TODO: add this kind of check at some point:
                // var isCompatible = NPM.isVersionCompatible({ version: dependencyPkgMD.version, semverRange: trustedSemverRange }).execSync() :
                // if (!isCompatible) {
                //   console.log('But the existing semver range (`'+relevantExistingSemverRange+'`) isn\'t quite right.');
                //   console.log('Should instead be within: '+trustedSemverRange);
                // }
                // else {
                console.log(logMsgPrefix + chalk.gray('  ✓ Skipping... b/c it is a core dep within a trusted range.'));
                return done();
                // }
              }
              // Otherwise, it's neither:
              else {

                try {
                  NPM.validateVersion({ string: relevantExistingSemverRange, strict: true }).execSync();

                  // --• If it is valid, then bail early-- we don't need to do anything else.
                  console.log(logMsgPrefix + chalk.gray('  ✓ Skipping... b/c it is pinned.'));
                  return done();

                } catch (e) {
                  switch (e.exit) {
                    // If the relevant existing semver range is not a valid version,
                    // that means it is NOT pinned.  Since it is not pinned, then we need
                    // to reinstall it, but pinned.
                    case 'invalidSemanticVersion':
                      console.log(logMsgPrefix);
                      console.log('The specified dependency (`'+nameOfPkgToInstall+'`) is not a known common or core dependency.  (See `verifiedReleases` & `trustedReleases`.)');
                      console.log('Proceeding to install the latest release that matches this semver range (`'+relevantExistingSemverRange+'`), and then pin it in the package.json file...');
                      break;
                    default: throw e;
                  }
                }
              }//</else: misc dep>

            }//</already exists in package.json in either the deps or devDeps>

            // >-•

            // Detemine which version or semver range to install.
            var relevantVersionOrSemverRangeToInstall;
            if (isCommon) { relevantVersionOrSemverRangeToInstall = verifiedVersion; }
            else if (isCore) { relevantVersionOrSemverRangeToInstall = trustedSemverRange; }
            else {
              if (_.isUndefined(relevantExistingSemverRange)) {
                relevantVersionOrSemverRangeToInstall = '*';
              }
              else {
                relevantVersionOrSemverRangeToInstall = relevantExistingSemverRange;
              }
            }
            // >-

            if (!relevantVersionOrSemverRangeToInstall) {
              throw new Error('Consistency violation: Internal error!  Would have attempted to install crazy semver range or version: `'+relevantVersionOrSemverRangeToInstall+'`');
            }

            // Install a package from the NPM registry to the `node_modules/` folder of this project,
            // and update the package.json file.
            NPM.installPackage({
              name: nameOfPkgToInstall,
              version: relevantVersionOrSemverRangeToInstall,
              dir: process.cwd(),
              save: depInfo.kind !== 'dev',
              saveDev: depInfo.kind === 'dev',
              saveExact: true,
              loglevel: 'warn',
            }).exec(function (err) {
              if (err) { return done(err); }

              return done();
            });//</NPM.installPackage>
          } catch (e) { return done(e); }
        }, function (err) {
          if (err) { return exits.error(err); }

          console.log();
          console.log(chalk.green('✓')+' Install completed successfully!');

          return exits.success();

        });//</async.each()>
      }//—————— on success —————¬
    });//</Filesystem.readJson()>
  }

}).exec();
