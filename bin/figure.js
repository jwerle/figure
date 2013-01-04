#!/usr/bin/env node
require('colors');

var parseopts, opts, cmds, cmd, args, parser, puts, name, fail, exec, cwd, pkg
  , generateIndexFile, path, dest, figure, Figure, children, die, prompt, file
  , stat, utils

children  = [];
prompt    = "figure> ";

parseopts = require('../vendor/parseopts');
pkg       = require('../package');
path      = require('path');
figure    = require('../lib/Figure');
utils     = require('utilities');
stat      = require('auto-loader/lib/utils').stat;

puts = function(msg) { console.log(prompt.cyan + (msg || "")); return puts; };
warn = function(msg) { console.warn(prompt.green + (msg || "").yellow); return warn; };
fail = function(msg, inverse) { console.error(prompt.red + ((msg || "").toUpperCase()).red); process.exit(1); };
die  = function(msg) { puts((msg || "").yellow); process.exit(); };
cwd  = process.cwd();
args = process.argv.slice(2);
opts = [
  {full : 'name', abbr: 'n', args : true},
  {full : 'version', abbr: 'v'},
  {full : 'children', abbr: 'c'},
  {full : 'directory', abbr: 'd'},
  {full : 'file', abbr: 'f'}
];

(parser = new parseopts.Parser(opts)) && parser.parse(args);

cmds = parser.cmds;
opts = parser.opts;

if (opts.version) {
  die(pkg.version);
}

puts
  ("Using figure " + "v".green + pkg.version.green)
  ("Using engine(s) " + Object.keys(pkg.engines).map(function(engine){ return engine.blue + "/" + pkg.engines[engine].green}).join(', '));

switch (cmds[0]) {
  case 'is' : case 'check' :
    dest = opts.directory && opts.directory.length?
            opts.directory.replace(/\/|\\/g, '') :
            fail("Missing destination directory to check.");

    return figure.Figure.isFigure(dest)? die(dest + " is a valid figure directory.") : fail(dest + " is not a valid figure.");
  break;

  case 'create' : case 'new' :
  case 'remove' : case 'destroy' :
    name = (opts.name && opts.name.length) &&  
            opts.name.replace(/\/|\\/g, '') || 
            void fail("Missing name");
    
    dest = path.join(cwd, name);

    

    if (opts.children && opts.children.length) {
      void puts ("Using children");

      fig = new figure.Figure(dest +'['+ opts.children +']');
    }
    else {
      fig = new figure.Figure(dest);
    }

    puts
      ("Using path " + cwd.yellow)
      ("Destination " + dest.blue);


    switch (cmds[0]) {
      case 'create' : case 'new' :
        puts
          ("Creating figure ".blue + name.green);

        fig.create();
      break;

      case 'remove' : case 'destroy' :
        if (fig.children.length) {
          fig.children.forEach(function(child){
            puts
              ("Removing figure ".yellow + child.directory.green);

            child.remove();
          });
        }
        else {
          puts
            ("Removing figure ".yellow + name.green);

          fig.remove();
        }

      break;
    }
  break;

  case 'use' :
    file = (((opts.file && opts.file.length) && (file = path.join(cwd, opts.file))) && 
            ((stat(file))
              || (stat(file + '.js') && (file += '.js'))
              || (stat(file + '.sh') && (file += '.sh'))))
            && file
            || void fail("Missing valid file.", false);

    switch (path.extname(file)) {
      case '.js' :
        void puts
            ("Using file " + file.blue);

        figure.use(file)
      break;

      case '.sh' : case '' :

      break;

      default :
        void fail("Unable to handle file")
      break;
    }
  

  break;
}

module.exports.puts   = puts;
module.exports.warn   = warn;
module.exports.fail   = fail;
module.exports.die    = die;