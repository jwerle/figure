var utils = require('utilities')

module.exports = function(file) {
  utils.mixin(global, require('../'));
  
  require(file);
  return this;
}