'use strict';
var util   = require('util');
var yeoman = require('yeoman-generator');
var path   = require('path');
var base   = require('../base.js')

var ComponentGenerator = module.exports = function ComponentGenerator(args, options, config) {
  base.apply(this, arguments);
};

util.inherits(ComponentGenerator, base);

ComponentGenerator.prototype.askForName = base.namePrompt('Please enter the path to the component eg.: components/users:');

ComponentGenerator.prototype._nameWithoutExtension = function _nameWithoutExtension(){
  return this._fullName().replace(/\.js$/, '');
}

ComponentGenerator.prototype._toRoot = function _toRoot(){
  var length = this._fullPath().split('/').length - 1;
  return this._.repeat('../', length);
}

ComponentGenerator.prototype._fullPath = function _fullPath(){
  var nameWithoutExtension = this._nameWithoutExtension();
  return path.join(nameWithoutExtension, nameWithoutExtension.split('/').pop());
}

ComponentGenerator.prototype._baseName = function _fullPath(){
  return this._nameWithoutExtension().split('/').pop();
}

ComponentGenerator.prototype.files = function files() {
  var template = this._isUsingRequireJS() ? 'requirejs' : 'none',
      fullPath = this._fullPath();
  if(this.name){
    this._mkdirp(this.name + '/');
    this.template(template + '.js', fullPath + '.js');
    this.template(template + '.html', fullPath + '.html');
  } else {
    console.log('You must provide path to the component!');
  }
};