/**
 * Module dependencies
 */

var chalk = require('chalk');


/**
 * getHumanReadableSize()
 *
 * TODO: pull this into a well-formed machine
 *
 * @param {Number} sizeInBytes
 * @returns {String}
 */
module.exports = function getHumanReadableSize(sizeInBytes) {
  var APRX_BYTES_IN_MB = 1000000.0;
  var APRX_BYTES_IN_KB = 1000.0;

  var sizeInMegabytes = Math.floor((sizeInBytes/APRX_BYTES_IN_MB)*100)/100;
  var sizeInKilobytes = Math.floor((sizeInBytes/APRX_BYTES_IN_KB)*100)/100;

  // >50MB
  if (sizeInMegabytes > 50) {
    return chalk.dim('~')+chalk.yellow.bold(sizeInMegabytes)+chalk.yellow(' MB');
  }
  // >10MB
  if (sizeInMegabytes > 10) {
    return chalk.dim('~')+chalk.blue.bold(sizeInMegabytes)+chalk.blue(' MB');
  }
  // >1MB
  if (sizeInMegabytes > 1) {
    return chalk.dim('~')+chalk.green.dim.bold(sizeInMegabytes)+chalk.green.dim(' MB');
  }
  // >500KB
  else if (sizeInKilobytes > 500) {
    return chalk.dim('~')+chalk.cyan.dim.bold(sizeInKilobytes)+chalk.cyan.dim(' KB');
  }
  // >25KB
  else if (sizeInKilobytes > 25) {
    return chalk.dim('~')+chalk.blue.dim.bold(sizeInKilobytes)+chalk.blue.dim(' KB');
  }
  // >1KB
  else if (sizeInKilobytes > 1) {
    return chalk.dim('~')+chalk.gray.dim.bold(sizeInKilobytes)+chalk.gray.dim(' KB');
  }
  // <=1KB
  else {
    return chalk.dim('~')+chalk.dim.bold(sizeInBytes)+chalk.dim(' bytes');
  }
};

