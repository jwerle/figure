var path = require('path')

var figure = {}

figure.FigureTree = function FigureTree(tree) {
  Array.call(this);

  var self = this, children

  if (typeof tree === 'string') {
    tree = tree.substr(tree.indexOf('['));
    tree = specialStringToJson(tree, false);
  }
  else if (typeof tree === 'object') {
    if (tree.length) {
      tree.forEach(function(item){
        if (typeof item === 'object') {
          self.push(item);
        }
      });
    }

    if (tree.tree) {
      tree = tree.tree
    }
  }

  this.tree = tree || [];
};

/** Prototype **/
[
  'push', 'concat', 'forEach', 'map', 'filter', 
  'indexOf', 'pop', 'shift', 'unshift', 'lastIndexOf', 
  'reverse', 'sort', 'slice', 'splice', 'reduce', 'reduceRight'
].forEach(function(method){
  figure.FigureTree.prototype[method] = function() {
    return ((!~[
        'concat', 'push', 'forEach', 'shift',
      ].indexOf(method) 
        && [][method].apply(this.tree, arguments))
        || ([][method].apply(this.tree, arguments)) && (this));
  }
});

figure.FigureTree.prototype.constructor = figure.FigureTree;
figure.FigureTree.prototype.toString = function() {
  return this.keys().join(',');
};

figure.FigureTree.prototype.push = function(figure) {
  var child

  if (child = this.get(figure.directory)) {
    this.tree[child.index] = figure;
  }
  else {
    figure.index = this.tree.length -1;
    this.tree.push(figure);
  }

  return this;
};

figure.FigureTree.prototype.keys = function() {
  var self = this

  return Object.keys(this.tree).map(function(child){
    var str = JsonToSpecialString(self.tree[child])

    return (str.length > 2 && [child].concat(['[', str, ']']).join('')) || (child);
  });
};

figure.FigureTree.prototype.get = function(dir) {
  var i, child

  if (! dir) {
    return this.tree;
  }

  for (i = 0; i < this.tree.length; i++) {
    child = this.tree[i];

    if (path.basename(child.directory) === dir) {
      child.index = i;
      break;
    }

    child = false;
  }

  return child
};

specialStringToJson = function(s, wrap) {
  s = s.replace(/\[/g, ':{')
    .replace(/^\:\{/,'{')
    .replace(/\]/g, '}')
    .replace(/([a-z0-9_-]+)+/gi,'"$1"')
    .replace(/("[a-z0-9_-]+")([,|}])/ig, "$1:{}$2")

  return JSON.parse( (wrap !== false && '{' + s + '}') || s );
}


JsonToSpecialString = function(json) {
  json = JSON.stringify(json);
  json = json.replace(/^\:\{/g, '[');
  json = json.replace(/\{\}/g, '');
  json = json.replace(/^\{/, '');
  json = json.replace(/\}$/, '');
  json = json.replace(/"/g, '');
  json = json.replace(/\:/g, '');
  json = json.replace(/\{/g, '[');
  json = json.replace(/\}/g, ']');

  return json;
};

module.exports = figure;