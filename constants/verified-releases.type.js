module.exports = {
  friendlyName: 'Verified releases',
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

    'chalk': '1.1.3',
    'commander': '2.8.1',

    'request': '2.74.0',
    'fs-extra': '0.30.0',
    'knex': '0.11.9',
    'debug': '2.2.0',
    'bcryptjs': '2.3.0',
    'semver': '4.3.6',
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
    'mocha': '3.0.2',

    'waterline-errors': '0.10.1',
    'waterline-sequel': '0.6.4',

    // Uncommon deps used in built-in Waterline modules:
    'npm': '2.15.6',
    'chai': '3.5.0',
    'jpath': '0.0.20',
    'should': '9.0.0',

    // This is not a complete list.
    // (TODO: add to this list over time)
  }
};
