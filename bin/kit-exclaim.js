#!/usr/bin/env node

require('machine-as-script')({


  friendlyName: 'kit exclaim',


  inputs: {

    args: {
      description: 'The serial command-line arguments.',
      example: 'some words probably'
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'ASCII art',
      example: 'youll see'
    }

  },


  fn: function (inputs, exits, env) {

    var wrap = require('word-wrap');
    var figlet = require('figlet');
    var ncp = require('copy-paste');

    var originalText = inputs.args;

    // Insert line breaks.
    var origTextWithLineBreaks = wrap(originalText, { width: 15, indent: '' });

    // Build ascii art
    var asciiArt = figlet.textSync(origTextWithLineBreaks, { font: 'ANSI Shadow' });
    // var asciiArt = figlet.textSync(originalText, { font: 'Calvin S' });

    // Add `//` comments
    asciiArt =
    asciiArt.split('\n')
    .map(function (line){ return '//  '+line; })
    .join('\n');

    // Copy to clipboard
    ncp.copy(asciiArt, function () {

      return exits.success(asciiArt);

    });//</ncp.copy()>
  }


}).exec({
  success: function (asciiArt){
    var chalk = require('chalk');

    console.log('-----------------------------------------------------------------');
    console.log('OK, I copied an '+chalk.bold('ASCII-art-ified')+' version of that message to your clipboard:');
    console.log();
    console.log(asciiArt);
    console.log('-----------------------------------------------------------------');
    console.log();

  }
});
