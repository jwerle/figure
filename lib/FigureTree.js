var figure = {}

figure.FigureTree = function FigureTree(map) {
  var children

  if (typeof map === 'string') {
    map = map.substr(map.indexOf('['));
    map = specialStringToJson(map, false);
  }
  else if (map instanceof figure.FigureTree) {
    map = map.map;
  }
  else if (typeof map === 'object') {
    map = map;
  }
  else {
    throw new Error("Invalid FigureTree map");
  }

  this.map = map;
}

figure.FigureTree.prototype.toString = function() {
  return this.keys().join(',');
};

figure.FigureTree.prototype.keys = function() {
  var self = this

  return Object.keys(this.map).map(function(child){
    var str = JsonToSpecialString(self.map[child])

    return (str.length > 2 && [child].concat(['[', str, ']']).join('')) || (child);
  });
}

specialStringToJson = function(s, wrap) {
  s         = s.replace(/\[/g, ':{');
  s         = s.replace(/^\:\{/,'{');
  s         = s.replace(/\]/g, '}');
  s         = s.replace(/([a-z0-9_-]+)+/gi,'"$1"');
  s         = s.replace(/("[a-z0-9_-]+")([,|}])/ig, "$1:{}$2");
  s         = (wrap !== false && '{' + s + '}') || s;

  return JSON.parse(s);
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