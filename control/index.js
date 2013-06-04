'use strict';
var util   = require('util');
var yeoman = require('yeoman-generator');
var path   = require('path');
var base   = require('../base.js')

var ControlGenerator = module.exports = function ControlGenerator(args, options, config) {
  base.apply(this, arguments);
};

util.inherits(ControlGenerator, base);

ControlGenerator.prototype.askForName = base.namePrompt('Please enter the path to the control eg.: controls/users:');

ControlGenerator.prototype.files = function files() {
  if(this.name){
    this._mkdirp(this.name);
    this.template((this._isUsingRequireJS() ? 'requirejs' : 'none') + '.js', this._fullName());
  } else {
    console.log('You must provide path to the model!');
  }
};