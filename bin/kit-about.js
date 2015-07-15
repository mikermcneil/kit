#!/usr/bin/env node

require('machine-as-script')({
  machine: {
    fn: function (inputs, exits) {
      return exits.success();
    }
  }
}).exec({
  success: function (){
    var chalk = require('chalk');
    console.log(chalk.bold(chalk.blue('kit'))+' is a suite of @mikermcneil\'s personal command-line utilities.');
  }
});
