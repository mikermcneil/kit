# kit

```bash
∑ kit about
kit is a suite of @mikermcneil's personal command-line utilities.
```


## Installation

```bash
∑ npm install -g kit
```



## Usage

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

#### pkgversion

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


#### exclaim


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

```bash
∑ kit exclaim --help

  Usage: kit-exclaim [options]

  Options:

    -h, --help   output usage information
    -a, --args   the serial command-line arguments.
    -w, --width  the width before wrapping.
    -f, --font   the ASCII font to use.

```

```bash
∑ kit exclaim hello world it is I, calvin! --width=30 --font='Calvin S'
-----------------------------------------------------------------
OK, I copied an ASCII-art-ified version of that message to your clipboard:

//  ┬ ┬┌─┐┬  ┬  ┌─┐  ┬ ┬┌─┐┬─┐┬  ┌┬┐  ┬┌┬┐  ┬┌─┐  ╦   ┌─┐┌─┐┬ ┬  ┬┬┌┐┌┬
//  ├─┤├┤ │  │  │ │  ││││ │├┬┘│   ││  │ │   │└─┐  ║   │  ├─┤│ └┐┌┘│││││
//  ┴ ┴└─┘┴─┘┴─┘└─┘  └┴┘└─┘┴└─┴─┘─┴┘  ┴ ┴   ┴└─┘  ╩┘  └─┘┴ ┴┴─┘└┘ ┴┘└┘o
-----------------------------------------------------------------
```


## License

MIT
