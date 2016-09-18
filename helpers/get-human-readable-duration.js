/**
 * Module dependencies
 */

var chalk = require('chalk');


/**
 * getHumanReadableDuration()
 *
 * TODO: pull this into a well-formed machine
 *
 * @param {Numinuteser} durationInSeconds
 * @returns {String}
 */
module.exports = function getHumanReadableDuration(durationInSeconds) {
  var SECONDS_IN_MINUTE = 60;
  var SECONDS_IN_HOUR = 60 * 60;

  var hours = Math.floor((durationInSeconds/SECONDS_IN_HOUR)*100)/100;
  var minutes = Math.floor((durationInSeconds/SECONDS_IN_MINUTE)*100)/100;

  // >1 hr
  if (hours > 1) {
    return chalk.dim('~')+chalk.red.bold(hours)+chalk.red(' hours');
  }
  // >10 mins
  if (minutes > 10) {
    return chalk.dim('~')+chalk.yellow.bold(minutes)+chalk.yellow(' minutes');
  }
  // >1 min
  else if (minutes > 1) {
    return chalk.dim('~')+chalk.cyan.bold(minutes)+chalk.dim(' minutes');
  }
  // >15 secs
  else if (durationInSeconds > 15) {
    return chalk.dim('~')+chalk.blue.bold(durationInSeconds)+chalk.dim(' seconds');
  }
  // >5 secs
  else if (durationInSeconds > 5) {
    return chalk.dim('~')+chalk.cyan.dim.bold(durationInSeconds)+chalk.cyan.dim(' seconds');
  }
  // <=5 secs
  else {
    return chalk.dim('~')+chalk.gray.dim.bold(durationInSeconds)+chalk.gray.dim(' seconds');
  }
};

