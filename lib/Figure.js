var loader      = require('auto-loader')
  , path        = require('path')
  , exec        = require('child_process').exec
  , FigureTree  = require('./FigureTree').FigureTree

var noop = new Function
  , specialStringToJson, generateIndexFileData

var Figure = function Figure(directory, children, parent) {
  var self = this, _children, tmp, match, index

  children = children || [];

  if (!directory) {
    throw new Error("A Figure needs a directory.");
  }

  if (typeof children === 'string' && children.match(',')) {
    children = children.split(',')
  }

  if (directory.match(/([\[|\]]+)+/g)) {
    _children  = directory.substr(directory.indexOf('['));
    directory  = directory.substr(0, directory.indexOf('['));
    _children  = new FigureTree(_children);
    _children  = _children.keys();

    children = _children.concat(children);
  }

  this.parent    = parent || {};
  this.directory = directory;
  this.children  = children instanceof FigureTree? children : new FigureTree();
  this.loader    = new loader.Loader(this.getDirectory());

  this.parent && this.parent.children && this.parent.children.push(this);


  if (Array.isArray(children) && children.length) {
    children.forEach(function(child){
      if (child) {
        if (typeof child === 'string') {

          child = new Figure(child, false, self);
          
        }
        else if (child instanceof Figure && !self.get(child.directory)) {
          _child          = new Figure(child.directory);
          _child.parent   = self;
          _child.children = child.children
          child           = _child;
        }
        else {
          return;
        }

        self.children.push(child);
      }
    });
  }
   
  //void console.log('figure => \n', this.directory, this) && console.log('parent tree => \n', this.parent.children && this.parent.children.tree) && console.log('\n');   
}

Figure.prototype.owns = function(figure) {
  if (!(figure instanceof Figure)) {
    throw new Error("Figure.shares() expects an instance of Figure"); 
  }

  figure.parent = this;
  this.children.push(figure)
  return this;
};

Figure.prototype.shares = function(figure) {
  if (!(figure instanceof Figure)) {
    throw new Error("Figure.shares() expects an instance of Figure"); 
  }

  var fig       = new Figure(figure.directory, figure.children.directories(), this);
  fig.parent    = this;
  this.children.push(fig);
  return this;
};

Figure.prototype.create = function(callback) {
  var indexFile, directory, self, cmd, figureFile
    , children

  callback    = (callback instanceof Function && callback) || (noop);
  self        = this;
  directory   = this.getDirectory();
  children    = this.children.get();
  indexFile   = path.join(directory, 'index.js');
  indexData   = generateIndexFileData(directory);
  figureFile  = directory + '/.figure';
  cmd         = [];

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

    if (children && children.length) {
      children.forEach(function(child, index){
        child &&
          (child instanceof Figure && child.create(function(){
            if (children.length === index + 1) {
              setTimeout(function(){ callback.call(self); }, 0);
            }
          }))
      });
    }
    else {
      callback.call(self);
    }
  });

  return this;
}

Figure.prototype.remove = function(callback) {
  var directory, cmd, self = this

  callback  = (callback instanceof Function && callback) || (noop);
  directory = this.getDirectory();

  if (Figure.isFigure(directory)) {
    cmd = [
      'rm -rf '+ directory
    ].join('; ');

    exec(cmd, function(err, stdout, stderr){
      if (err) {
        throw err;
      }

      setTimeout(function(){ callback.call(self, err); }, 0);
    });
  }
  else {
    throw new Error("Figure " + directory + " is not a figure. Missing .figure file.");
  }

  return this;
};

Figure.prototype.get = function() {
  return this.children.get.apply(this.children, arguments);
};

Figure.prototype.exists = function() {
  return Figure.isFigure(this.getDirectory());
};

Figure.prototype.requireTree = function() {
  return this.loader.load(this.getDirectory());
};

Figure.prototype.getDirectory = function() { 
  return ((this.parent && this.parent.directory) &&
         (!~ this.directory.indexOf(this.parent.directory + '/')) &&
          (path.resolve(this.parent.getDirectory(), this.directory)))
          || this.directory;
};

Figure.isFigure = function(directory) {
  directory = (directory instanceof Figure && directory.getDirectory())
              || directory;

  return loader.stat(directory + '/.figure')? true : false;
};

generateIndexFileData = function(directory) {
  return  [
    "module.exports = require('auto-loader').load('"+ directory +"')['"+ path.basename(directory) +"']"
  ].join('\n')
};


module.exports.use = require('./use')

module.exports.Figure = Figure;