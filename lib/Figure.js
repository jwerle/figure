var loader      = require('auto-loader')
  , path        = require('path')
  , exec        = require('child_process').exec
  , FigureTree  = require('./FigureTree').FigureTree

var noop = new Function
  , specialStringToJson, generateIndexFileData

var Figure = function Figure(directory, children, parent) {
  var self = this, _children, tmp, match,

  children = (children && children.length && children) || [];

  if (!directory) {
    throw new Error("A Figure needs a directory.");
  }

  if (directory.match(/([\[|\]]+)+/g)) {
    children  = directory.substr(directory.indexOf('['));
    directory = directory.substr(0, directory.indexOf('['));
    children  = new FigureTree(children);
    children  = children.keys()
  }

  this.parent    = parent;
  this.directory = directory;
  this.children  = [];
  this.loader    = new loader.Loader(directory);

  if (this.parent && this.parent.directory) {
    this.directory = directory = this.parent.directory + '/' + directory;
  }

  if (Array.isArray(children)) {
    children.forEach(function(child){
      child && 
        (typeof child === 'string' && self.children.push(child = new Figure(child, false, self)))

      child &&
        (child instanceof Figure && (child.parent = self));

      self.children.push(child);
    });
  }


  this.children.get = function(dir) {
    var i, child

    for (i = 0; i < self.children.length; i++) {
      child = self.children[i];

      if (path.basename(child.directory) === dir) {
        break;
      }

      child = false;
    }

    return child
  };
}

Figure.prototype.create = function(callback) {
  var indexFile, directory, self, cmd, figureFile

  callback    = (callback instanceof Function && callback) || (noop);
  self        = this;
  directory   = this.directory;
  indexFile   = path.join(directory, 'index.js');
  indexData   = generateIndexFileData(directory);
  figureFile  = directory + '/.figure';

  cmd = [];

  !this.loader.stat(directory) &&
    cmd.push('mkdir '+ directory);

  !this.loader.stat(indexFile) && 
    cmd.push('echo "'+ indexData + '" >> '+ indexFile) &&
    cmd.push('touch '+ indexFile);

  !this.loader.stat(figureFile) &&
    cmd.push('touch '+ figureFile);

  cmd = cmd.join('; ');

  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      throw err;
    }

    if (self.children && self.children.length) {
      self.children.forEach(function(child, index){
        child &&
          (child instanceof Figure && child.create(function(){
            if (self.children.length === index + 1) {
              callback.call(self);
            }
          }));
      });
    }
    else {
      callback.call(self);
    }
  });

  return this;
}

Figure.prototype.remove = function(callback) {
  var directory, cmd

  callback  = (callback instanceof Function && callback) || (noop);
  directory = this.directory;

  if (Figure.isFigure(directory)) {
    cmd = [
      'rm -rf '+ directory
    ].join('; ');

    exec(cmd, function(err, stdout, stderr){
      if (err) {
        throw err;
      }

      callback.call(err);
    });
  }
  else {
    throw new Error("Figure " + directory + " is not a figure. Missing .figure file.");
  }

  return this;
};

Figure.isFigure = function(directory) {
  return loader.stat(directory + '/.figure')? true : false;
};

generateIndexFileData = function(directory) {
  return  [
    "module.exports = require('auto-loader').load('"+ directory +"')['"+ path.basename(directory) +"']"
  ].join('\n')
};



module.exports.Figure = Figure;