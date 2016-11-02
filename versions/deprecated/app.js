'use strict';
module.exports.app = function app() {
  console.log('RUNNING ME')
  var depManager  = this.useRequire ? 'requirejs' : 'none';
  var appTemplate = this.read('_app.js');
  var appWrapper  = this.read('_' + depManager + '_wrap.js');
  var app         = this._.underscored(this.appName);

  this.mkdir('style');
  this.copy('_style.less', 'style/style.less');
  this.copy('_style.css', 'style/style.css');
  this.copy('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template(depManager + '.html', app + '.html');
  this.write(app + '.js', appWrapper.replace('/*APPCODE*/', appTemplate));

  if(this.useRequire){
    this.copy('requirejsconfig.js', 'requirejsconfig.js');
    this.template('Gruntfile.js');
    this.template('production.html');
  }
};


module.exports.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
