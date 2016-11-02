'use strict';
var util   = require('util');
var yeoman = require('yeoman-generator');
var path   = require('path');
var base   = require('../base.js')

var ModelGenerator = module.exports = function ModelGenerator(args, options, config) {
  base.apply(this, arguments);
};

util.inherits(ModelGenerator, base);

ModelGenerator.prototype.askForName = base.namePrompt('Please enter the path to the model eg.: models/user:');

ModelGenerator.prototype.files = function files() {
  if(this.name){
    this._mkdirp(this.name);
    this.template((this._isUsingRequireJS() ? 'requirejs' : 'none') + '.js', this._fullName());
  } else {
    console.log('You must provide path to the model!');
  }
}

ModelGenerator.prototype.askForFixture = function askForFixture() {
  var cb          = this.async(),
      modelName   = this.name.split('/').pop();
  
  var prompts = [{
    name: 'generateFixture',
    message: 'Would you like to generate fixtures for the ' + modelName + ' model?',
    default: 'Y/n'
  }];

  this.prompt(prompts, function (props) {

    this.generateFixture = (/y/i).test(props.generateFixture);

    cb();

  }.bind(this));
}

ModelGenerator.prototype.fixtures = function fixtures(){
  var fixturePath = ['fixtures', this._fullName(true).split('/').pop()].join('/');
  if(this.generateFixture){
    this._mkdirp(fixturePath);
    this.template((this._isUsingRequireJS() ? 'requirejs_fixture' : 'none_fixture') + '.js', fixturePath);
  }
}