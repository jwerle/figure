#!/usr/bin/env node
require('colors');

var parseopts, opts, cmds, cmd, args, parser, puts, name, fail, exec, cwd, pkg
  , generateIndexFile, path, dest, figure, Figure, children, die, prompt

children  = [];
prompt    = "figure> ";

parseopts = require('../vendor/parseopts');
pkg       = require('../package');
path      = require('path');
figure    = require('../lib/Figure');

puts = function(msg) { console.log(prompt.cyan + (msg || "")); return puts; };
warn = function(msg) { console.warn(prompt.green + (msg || "").yellow); return warn; };
fail = function(msg) { puts((msg || "").red); process.exit(1); };
die  = function(msg) { puts((msg || "").yellow); process.exit(); };
cwd  = process.cwd();
args = process.argv.slice(2);
opts = [
  {full : 'name', abbr: 'n', args : true},
  {full : 'version', abbr: 'v'},
  {full : 'children', abbr: 'c'},
  {full : 'directory', abbr: 'd'}
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
    name = opts.name && opts.name.length? 
            opts.name.replace(/\/|\\/g, '') : 
            fail("Missing name");
    
    dest = path.join(cwd, name);

    fig = new figure.Figure(dest, children);

    if (opts.children && opts.children.length) {
      puts
        ("Using children");

      opts.children.split(',').map(function(directory){
        fig.children.push(new figure.Figure(directory, false, fig));
      });
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
}

module.exports.puts   = puts;
module.exports.warn   = warn;
module.exports.fail   = fail;
module.exports.die    = die;