#!/usr/bin/env node

/**
 * Module dependencies
 */

var util = require('util');
var program = require('commander');
var chalk = require('chalk');
var _ = require('lodash');
var Process = require('machinepack-process');

var VERSION = require('../package.json').version;



program
// Set up `-v` usage
.version(VERSION)
// Allow unknown options.
.unknownOption = function NOOP(){};

// Set up commands
program.usage(chalk.gray('[options]')+' '+chalk.bold('<command>'))
.command('pkg', 'show the version of the package in the current directory')
.command('deps', 'get the install footprint + versions of this package\'s dependencies')
.command('install', 'install & save the verified/trusted release of a dep here')
.command('exclaim', 'convert a message to ASCII art and copy it to your clipboard')
// .command('h1', 'create a heading for your JavaScript code')
// .command('h2', 'create a sub-heading for your JavaScript code')
.command('about', 'what is kit?');


// Parse the CLI args / opts.
program.parse(process.argv);

// Make an aliaser function for use below.
var runAs = makeAliaser('kit');


// $ kit
//
// (i.e. with no CLI arguments...)
if (program.args.length === 0) {
  return runAs('about');
}



// $ kit <command>
//
// (i.e. matched one of the overtly exposed commands)
var matchedCommand = !!program.runningCommand;
if (matchedCommand){
  return;
}



// $ kit <alias>
//
// (i.e. check aliases, since wasn't matched by any overtly exposed commands)
if ( _.isString(program.args[0]) ) {

  if (_.contains(['h','he','hel'], program.args[0])) {
    return runAs('help');
  }

  if (program.args[0] === 'h1') {
    return runAs('exclaim', { font: 'ANSI Shadow', width: 12 });
  }

  if (program.args[0] === 'h2') {
    return runAs('exclaim', { font: 'Calvin S', width: 35 });
  }

  if (program.args[0] === 'pkgversion') {
    return runAs('pkg');
  }

  // ...

}//</if program.args[0] is a string...>



// $ kit <*>
//
// (i.e. final handler)
(function unknownCommand(){

  // Display usage (i.e. "help"):
  program.outputHelp();
})();





/**
 * Helper fn
 * @param  {String} prefix [the filename prefix to use, e.g. "kit"]
 */
function makeAliaser (prefix){

  process.argv.splice(process.argv.indexOf(program.args[0]),1);

  /**
   * @param  {String} aliasFor [string command to redirect to]
   * @param  {Dictionary} cliOpts [a dictionary of options to convert/escape as CLI opts]
   */
  return function _alias (aliasFor, cliOpts){

    if (_.isObject(cliOpts)) {
      _.each(cliOpts, function (val, inputCodeName) {
        var escapedAsCliOpt = Process.escapeCliOpt({ value: val }).execSync();
        process.argv.push('--'+inputCodeName+'='+escapedAsCliOpt);
      });
    }

    require('./'+prefix+'-'+aliasFor);
  };
}
