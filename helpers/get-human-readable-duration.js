/**
 * Module dependencies
 */

var chalk = require('chalk');


/**
 * getHumanReadableDuration()
 *
 * TODO: pull this into a well-formed machine
 *
 * @param {Numinuteser} seconds
 * @returns {String}
 */
module.exports = function getHumanReadableDuration(seconds) {
  var SECONDS_IN_MINUTE = 60;
  var SECONDS_IN_HOUR = 60 * 60;

  var hours = Math.floor((seconds/SECONDS_IN_HOUR)*100)/100;
  var minutes = Math.floor((seconds/SECONDS_IN_MINUTE)*100)/100;

  var chalkToUse;
  var unitsStr;

  // >1 hr
  if (hours > 1) {
    chalkToUse = chalk.yellow.bgRed;
    unitsStr = 'hours';
  }
  // >10 mins
  else if (minutes > 10) {
    chalkToUse = chalk.white.bgRed;
    unitsStr = 'minutes';
  }
  // >2 mins
  else if (minutes > 2) {
    chalkToUse = chalk.red;
    unitsStr = 'minutes';
  }
  // >15 secs
  else if (seconds > 15) {
    chalkToUse = chalk.yellow;
    unitsStr = 'seconds';
  }
  // >5 secs
  else if (seconds > 5) {
    chalkToUse = chalk.reset;
    unitsStr = 'seconds';
  }
  // >1 secs
  else if (seconds > 1) {
    chalkToUse = chalk.reset;
    unitsStr = 'seconds';
  }
  // >0.5 secs
  else if (seconds > 0.5) {
    chalkToUse = chalk.gray;
    unitsStr = 'seconds';
  }
  // >0.125 secs
  else if (seconds > 0.125) {
    chalkToUse = chalk.dim;
    unitsStr = 'seconds';
  }
  // <=0.125 sec
  else {
    chalkToUse = chalk.gray.dim;
    unitsStr = 'seconds';
  }


  // Return final output.
  if (unitsStr === 'hours') {
    return chalkToUse.bold(hours)+chalkToUse(' hours');
  }
  else if (unitsStr === 'minutes') {
    return chalkToUse(minutes)+chalkToUse(' minutes');
  }
  else {
    return chalkToUse(seconds)+chalkToUse(' seconds');
  }

};

