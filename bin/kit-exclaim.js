#!/usr/bin/env node

require('machine-as-script')({


  friendlyName: 'kit exclaim',


  inputs: {

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

    // Get the serial command-line arguments (e.g. `['some words probably']`)
    // and join them together into a single string.
    var text = env.serialCommandLineArgs.join(' ');

    // Replace each literal `\n` with an actual newline character.
    text = text.replace(/\\n/g, '\n');

    // Insert line breaks.
    // (but maintain deliberate newlines)
    text = text.split('\n').map(function (line){
      line = wrap(line, { width: inputs.width, indent: '' });
      return line;
    }).join('\n');

    // Build ascii art
    var asciiArt = figlet.textSync(text, { font: inputs.font });


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
