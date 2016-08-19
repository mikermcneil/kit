#!/usr/bin/env node

require('machine-as-script')({


  friendlyName: 'kit about',


  fn: function (inputs, exits) {
    return exits.success();
  }


}).exec({
  success: function (){
    var chalk = require('chalk');
    var VERSION = require('../package.json').version;

    console.log('•  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  ');
    var BRIEFCASE =
    '  ___--¬___\n'+
    ' |~~ ``` ~~|\n'+
    ' |         |\n'+
    ' |_________|\n'+
    ' |_________|\n'+
    '';
    console.log(BRIEFCASE);
    console.log(chalk.bold(chalk.blue('kit')+' v'+VERSION));
    console.log(chalk.gray('(run '+chalk.bold('kit')+' for usage)'));
    console.log();
    console.log(chalk.bold('kit')+' is a light-hearted grab bag of command-line utilities.');
    console.log('Feel free to fork, add whatever, and send PRs if you like.');
    console.log(chalk.underline(chalk.bold(chalk.gray('https://github.com/mikermcneil/kit'))));
    console.log('•  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  ');
    console.log();
  }
});
