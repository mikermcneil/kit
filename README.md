# kit

```bash
∑ kit about
•  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  
  ___--¬___
 |~~ ``` ~~|
 |         |
 |_________|
 |_________|

kit v1.2.3
(run kit for usage)

kit is a light-hearted grab bag of command-line utilities.
Feel free to fork, add whatever, and send PRs if you like.
https://github.com/mikermcneil/kit
•  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  •  
```


## Installation

```bash
∑ npm install -g @mikermcneil/kit
```

## kit

```bash
∑ kit

  Usage: kit [options] <command>


  Commands:

    exclaim      convert a message to ASCII art and copy it to your clipboard
    pkgversion   show the version of the package in the current directory
    about        what is kit?
    help [cmd]   display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

## kit pkgversion

```bash
∑ cd /code/sails
∑ kit pkgversion 
-----------------------------------------------------------------
sails
API-driven framework for building realtime apps, using MVC conventions (based on Express and Socket.io)
v0.12.4
MIT License

> http://npmjs.org/package/sails
> http://github.com/balderdashy/sails/
-----------------------------------------------------------------
```


## kit exclaim


```bash
∑ kit exclaim hello world!
-----------------------------------------------------------------
OK, I copied an ASCII-art-ified version of that message to your clipboard:

//  ██╗  ██╗███████╗██╗     ██╗      ██████╗     ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ ██╗
//  ██║  ██║██╔════╝██║     ██║     ██╔═══██╗    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗██║
//  ███████║█████╗  ██║     ██║     ██║   ██║    ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║██║
//  ██╔══██║██╔══╝  ██║     ██║     ██║   ██║    ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║╚═╝
//  ██║  ██║███████╗███████╗███████╗╚██████╔╝    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝██╗
//  ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝      ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝
//                                                                                             
-----------------------------------------------------------------
```

#### Options

```bash
∑ kit exclaim --help

  Usage: kit-exclaim [options]

  Options:

    -h, --help   output usage information
    -a, --args   the serial command-line arguments.
    -w, --width  the width before wrapping.
    -f, --font   the ASCII font to use.

```


#### Headings

```bash
∑ kit exclaim 'find user & populate projects' --width=15
-----------------------------------------------------------------
OK, I copied an ASCII-art-ified version of that message to your clipboard:

//  ███████╗██╗███╗   ██╗██████╗     ██╗   ██╗███████╗███████╗██████╗        ██╗       
//  ██╔════╝██║████╗  ██║██╔══██╗    ██║   ██║██╔════╝██╔════╝██╔══██╗       ██║       
//  █████╗  ██║██╔██╗ ██║██║  ██║    ██║   ██║███████╗█████╗  ██████╔╝    ████████╗    
//  ██╔══╝  ██║██║╚██╗██║██║  ██║    ██║   ██║╚════██║██╔══╝  ██╔══██╗    ██╔═██╔═╝    
//  ██║     ██║██║ ╚████║██████╔╝    ╚██████╔╝███████║███████╗██║  ██║    ██████║      
//  ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝      ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝    ╚═════╝      
//                                                                                     
//  ██████╗  ██████╗ ██████╗ ██╗   ██╗██╗      █████╗ ████████╗███████╗                
//  ██╔══██╗██╔═══██╗██╔══██╗██║   ██║██║     ██╔══██╗╚══██╔══╝██╔════╝                
//  ██████╔╝██║   ██║██████╔╝██║   ██║██║     ███████║   ██║   █████╗                  
//  ██╔═══╝ ██║   ██║██╔═══╝ ██║   ██║██║     ██╔══██║   ██║   ██╔══╝                  
//  ██║     ╚██████╔╝██║     ╚██████╔╝███████╗██║  ██║   ██║   ███████╗                
//  ╚═╝      ╚═════╝ ╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝                
//                                                                                     
//  ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗                 
//  ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝                 
//  ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗                 
//  ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║                 
//  ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║                 
//  ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝                 
//                                                                                     
-----------------------------------------------------------------
```

#### Sub-headings

```bash
∑ kit exclaim 'SEND EMAIL via mailgun' --width=25 --font='Calvin S'
-----------------------------------------------------------------
OK, I copied an ASCII-art-ified version of that message to your clipboard:

//  ╔═╗╔═╗╔╗╔╔╦╗  ╔═╗╔╦╗╔═╗╦╦    ┬  ┬┬┌─┐  ┌┬┐┌─┐┬┬  ┌─┐┬ ┬┌┐┌
//  ╚═╗║╣ ║║║ ║║  ║╣ ║║║╠═╣║║    └┐┌┘│├─┤  │││├─┤││  │ ┬│ ││││
//  ╚═╝╚═╝╝╚╝═╩╝  ╚═╝╩ ╩╩ ╩╩╩═╝   └┘ ┴┴ ┴  ┴ ┴┴ ┴┴┴─┘└─┘└─┘┘└┘
-----------------------------------------------------------------
```




## Credits

This module wouldn\'t be possible without [@patorjk](https://github.com/patorjk)'s amazing work on [figlet](https://github.com/patorjk/figlet.js).

See also:
+ [h1](http://patorjk.com/software/taag/#p=display&c=c%2B%2B&f=ANSI%20Shadow&t=Use%20this%20font%20%0Ato%20delineate%0Amajor%20sections%0Aof%20your%20code%0A(no%20more%20than%0A%20once%20per%20every%0A%20200%20lines%20of%20code))
+ [h2](http://patorjk.com/software/taag/#p=display&c=c%2B%2B&f=Calvin%20S&t=use%20this%20font%20to%20indicate%0Asmaller%20sections%20of%20our%20code.%0A%0Ae.g.%0A%0ACLICK%0A%5B-build%20light%20in%20ribbon-%5D)



## License

MIT
