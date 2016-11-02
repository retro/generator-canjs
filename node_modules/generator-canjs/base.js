var path      = require('path');
var yeoman    = require('yeoman-generator');
var util      = require('util');
var inflector = require('underscore.inflections');
var chalk     = require('chalk');

var Generator = module.exports = function Generator(){
  yeoman.generators.Base.apply(this, arguments);
  this._.mixin(inflector);
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype._isUsingRequireJS = function _isUsingRequireJS(){
  var bower = JSON.parse(this.read(path.join(process.cwd(), 'bower.json')));
  return !!bower.dependencies.requirejs;
}

Generator.prototype._componentName = function modelName(singularize){
  var name = this.name.replace(/\.js$/, '').split('/').pop();
  return singularize ? this._.singularize(name) : name;
}

Generator.prototype._dasherizedComponentName = function(){
  return this._componentName().replace(/_/g, '-');
}

Generator.prototype._fullName = function _fullName(pluralized){
  var name = this._.trim(this.name);

  name = pluralized ? this._.pluralize(name) : name;

  if(!this._.endsWith(name, '.js')){
    name += '.js';
  }
  return name;
}

Generator.prototype._mkdirp = function _mkdirp(name){
  var componentPath = name.split('/');

  componentPath.pop();
  componentPath.forEach(function(pathPart, i){
    var dir = path.join.apply(path, this._.first(componentPath, i + 1));
    this.mkdir(dir);
  }.bind(this));
}

Generator.namePrompt = function namePrompt(message){
  return function askFor() {

    var cb = this.async();

    var name = this._.trim(this.name || "");

    var prompts = [{
      name: 'name',
      message: message,
      default: arguments[0] || ""
    }];

    var promptsCb = function (props) {
      var name;
      
      name = this._.trim(props.name);

      if(name !== ''){
        this.name = name;
        cb();
      } else {
        console.error(chalk.red.bold('You must provide the path!'));
      }

    }.bind(this)

    if(name === ""){
      this.prompt(prompts, promptsCb);
    } else {
      cb();
    }
  };
}