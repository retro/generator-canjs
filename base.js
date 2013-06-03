var path      = require('path');
var yeoman    = require('yeoman-generator');
var util      = require('util');
var inflector = require('underscore.inflections');

var Generator = module.exports = function Generator(){
  yeoman.generators.NamedBase.apply(this, arguments);
  this._.mixin(inflector);
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype._isUsingRequireJS = function _isUsingRequireJS(){
  var bower = JSON.parse(this.read(path.join(process.cwd(), 'bower.json')));
  return !!bower.dependencies.requirejs;
}