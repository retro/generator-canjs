'use strict';
var util   = require('util');
var yeoman = require('yeoman-generator');
var path   = require('path');
var base   = require('../base.js')

var ModelGenerator = module.exports = function ModelGenerator(args, options, config) {
  base.apply(this, arguments);
};

util.inherits(ModelGenerator, base);

ModelGenerator.prototype.askForName = function askFor() {
  var cb = this.async();

  var name = this._.trim(this.name || "");

  var prompts = [{
    name: 'name',
    message: 'Please enter the path to the model eg.: models/user:'
  }];

  var promptsCb = function (err, props) {
    var name;
    if (err) {
      return this.emit('error', err);
    }

    name = this._.trim(props.name);

    if(name !== ''){
      this.name = name
    }

    cb();

  }.bind(this)

  if(name === ""){
    this.prompt(prompts, promptsCb);
  } else {
    cb();
  }
};

ModelGenerator.prototype._modelName = function modelName(){
  var name = this.name.replace(/\.js$/, '');
  return this._.singularize(name.split('/').pop());
}

ModelGenerator.prototype._fullName = function _fullName(){
  var name = this._.trim(this.name);
  if(!this._.endsWith(name, '.js')){
    name += '.js';
  }
  return name;
}

ModelGenerator.prototype.files = function files() {
  var modelPath, name;

  if(this.name){
    modelPath = this.name.split('/');
    modelPath.pop();
    
    modelPath.forEach(function(pathPart, i){
      var dir = path.join.apply(path, this._.first(modelPath, i + 1));
      this.mkdir(dir);
    }.bind(this));

    this.template((this._isUsingRequireJS() ? 'requirejs' : 'none') + '.js', this._fullName());
  } else {
    console.log('You must provide path to the model!');
  }
};