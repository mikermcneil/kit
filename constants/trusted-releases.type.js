module.exports = {
  friendlyName: 'Trusted releases',
  description: 'A set of trusted releases of internal packages.',
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

    'include-all': '*',
    'sails.io.js': '*',

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
    'switchback': '*',

    'aim-error-at': '*',
    'machine-as-script': '*',
    'machine-as-action': '*',
    'browserify-transform-machinepack': '*',
    'test-machinepack-mocha': '*',
    'test-machinepack': '*',

    'machinepack-npm': '*',
    'machinepack-localmachinepacks': '*',
    'machinepack-stripe': '*',
    'machinepack-markdown': '*',

    // This is not a complete list
    // (TODO: add to this list and expand ranges as it makes sense, over time)
  }
};
