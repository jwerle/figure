var figure = {}

figure.FigureTree = function FigureTree(tree) {
  Array.call(this);

  var children

  if (typeof tree === 'string') {
    tree = tree.substr(tree.indexOf('['));
    tree = specialStringToJson(tree, false);
  }
  else if (tree instanceof figure.FigureTree) {
    tree = tree.tree;
  }
  else if (typeof tree === 'object') {
    tree = tree;
  }

  this.tree = tree || null;
}

figure.FigureTree.prototype = Array.prototype;
figure.FigureTree.prototype.constructor = figure.FigureTree;
figure.FigureTree.prototype.toString = function() {
  return this.keys().join(',');
};

figure.FigureTree.prototype.keys = function() {
  var self = this

  return Object.keys(this.tree).map(function(child){
    var str = JsonToSpecialString(self.tree[child])

    return (str.length > 2 && [child].concat(['[', str, ']']).join('')) || (child);
  });
}

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