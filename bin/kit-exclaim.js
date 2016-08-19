#!/usr/bin/env node

require('machine-as-script')({


  friendlyName: 'kit exclaim',


  inputs: {

    args: {
      description: 'The serial command-line arguments.',
      example: ['some words probably']
    },

    width: {
      description: 'The width before wrapping.',
      example: 12,
      defaultsTo: 12
    },

    font: {
      description: 'The ASCII font to use.',
      example: 'Calvin S',
      defaultsTo: 'ANSI Shadow'
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'ASCII art',
      example: '//  ██╗   ██╗██████╗  ██████╗ ██████╗  █████╗ ██████╗ ███████╗    ███████╗ ██████╗ ███╗   ███╗███████╗    \n//  ██║   ██║██╔══██╗██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██╔════╝    ██╔════╝██╔═══██╗████╗ ████║██╔════╝    \n//  ██║   ██║██████╔╝██║  ███╗██████╔╝███████║██║  ██║█████╗      ███████╗██║   ██║██╔████╔██║█████╗      \n//  ██║   ██║██╔═══╝ ██║   ██║██╔══██╗██╔══██║██║  ██║██╔══╝      ╚════██║██║   ██║██║╚██╔╝██║██╔══╝      \n//  ╚██████╔╝██║     ╚██████╔╝██║  ██║██║  ██║██████╔╝███████╗    ███████║╚██████╔╝██║ ╚═╝ ██║███████╗    \n//   ╚═════╝ ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝    ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝    \n//                                                                                                        \n//  ██████╗ ███████╗██████╗ ███████╗                                                                      \n//  ██╔══██╗██╔════╝██╔══██╗██╔════╝                                                                      \n//  ██║  ██║█████╗  ██████╔╝███████╗                                                                      \n//  ██║  ██║██╔══╝  ██╔═══╝ ╚════██║                                                                      \n//  ██████╔╝███████╗██║     ███████║                                                                      \n//  ╚═════╝ ╚══════╝╚═╝     ╚══════╝                                                                      \n//                                                                                                        ',
    }

  },


  fn: function (inputs, exits, env) {

    var wrap = require('word-wrap');
    var figlet = require('figlet');
    var ncp = require('copy-paste');

    var originalText = inputs.args.join(' ');

    // Insert line breaks.
    var origTextWithLineBreaks = wrap(originalText, { width: inputs.width, indent: '' });

    // Build ascii art
    var asciiArt = figlet.textSync(origTextWithLineBreaks, { font: inputs.font });


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
