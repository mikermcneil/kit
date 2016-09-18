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
    return chalk.dim('~')+chalk.white.bgRed.bold(hours)+chalk.white.bgRed(' hours');
  }
  // >10 mins
  if (minutes > 10) {
    return chalk.dim('~')+chalk.red.bold(minutes)+chalk.red(' minutes');
  }
  // >1 min
  else if (minutes > 1) {
    return chalk.dim('~')+chalk.yellow.bold(minutes)+chalk.yellow(' minutes');
  }
  // >30 secs
  else if (durationInSeconds > 30) {
    return chalk.dim('~')+chalk.cyan.underline.bold(durationInSeconds)+chalk.cyan.underline(' seconds');
  }
  // >15 secs
  else if (durationInSeconds > 15) {
    return chalk.dim('~')+chalk.cyan.bold(durationInSeconds)+chalk.cyan(' seconds');
  }
  // >5 secs
  else if (durationInSeconds > 5) {
    return chalk.dim('~')+chalk.blue.bold(durationInSeconds)+chalk.blue(' seconds');
  }
  // >2 secs
  else if (durationInSeconds > 2) {
    return chalk.dim('~')+chalk.green.dim.bold(durationInSeconds)+chalk.green.dim(' seconds');
  }
  // >0.5 secs
  else if (durationInSeconds > 0.5) {
    return chalk.dim('~')+chalk.blue.dim.bold(durationInSeconds)+chalk.blue.dim(' seconds');
  }
  // <=0.5 sec
  else {
    return chalk.dim('~')+chalk.gray.dim.bold(durationInSeconds)+chalk.gray.dim(' seconds');
  }
};

