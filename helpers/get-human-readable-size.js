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

  var chalkToUse;
  var unitsStr;


  // >500MB
  if (sizeInMegabytes > 500) {
    chalkToUse = chalk.yellow.bgRed;
    unitsStr = 'MB';
  }
  // >250MB
  else if (sizeInMegabytes > 250) {
    chalkToUse = chalk.white.bgRed;
    unitsStr = 'MB';
  }
  // >150MB
  else if (sizeInMegabytes > 150) {
    chalkToUse = chalk.red;
    unitsStr = 'MB';
  }
  // >50MB
  else if (sizeInMegabytes > 50) {
    chalkToUse = chalk.yellow;
    unitsStr = 'MB';
  }
  // >5MB
  else if (sizeInMegabytes > 5) {
    chalkToUse = chalk.reset;
    unitsStr = 'MB';
  }
  // >1MB
  else if (sizeInMegabytes > 1) {
    chalkToUse = chalk.reset;
    unitsStr = 'MB';
  }
  // >500KB
  else if (sizeInKilobytes > 500) {
    chalkToUse = chalk.gray;
    unitsStr = 'KB';
  }
  // >25KB
  else if (sizeInKilobytes > 25) {
    chalkToUse = chalk.dim;
    unitsStr = 'KB';
  }
  // <=25KB
  else {
    chalkToUse = chalk.gray.dim;
    unitsStr = 'KB';
  }



  // Return final output.
  if (unitsStr === 'MB') {
    return chalkToUse.bold(sizeInMegabytes)+chalkToUse(' MB');
  }
  else if (unitsStr === 'KB') {
    return chalkToUse(sizeInKilobytes)+chalkToUse(' KB');
  }
  else {
    return chalkToUse(sizeInBytes)+chalkToUse(' bytes');
  }
};

