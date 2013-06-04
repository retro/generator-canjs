'use strict';
var util   = require('util');
var path   = require('path');
var yeoman = require('yeoman-generator');

var extractAppName = function (_, appname) {
  var slugged = _.slugify(appname),
    match = slugged.match(/^generator-(.+)/);

  if (match && match.length === 2) {
    return match[1].toLowerCase();
  }

  return slugged;
};

var CanjsGenerator = module.exports = function CanjsGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CanjsGenerator, yeoman.generators.Base);

CanjsGenerator.prototype.askFor = function askFor() {
  var cb = this.async();
  var generatorName = extractAppName(this._, this.appname);

  // welcome message
  var welcome =
  '\n                                            ####'.yellow.bold +
  '\n    ######### ###########   ####  #######  ######'.yellow.bold +
  '\n  ########### ############# ############### ####'.yellow.bold +
  '\n ############ ############# ###############'.yellow.bold +
  '\n ######              ###### #####    ###### ####  #######'.yellow.bold +
  '\n #####                ##### #####     ##### #### #########'.yellow.bold +
  '\n #####         ############ #####     ##### #### ####'.yellow.bold +
  '\n #####       ############## #####     ##### #### ####'.yellow.bold +
  '\n #####      #####    ###### #####     ##### ####  #####'.yellow.bold +
  '\n ######     #####     ##### #####     ##### ####    #####'.yellow.bold +
  '\n ########## ######### ##### #####     ##### ####      ####'.yellow.bold +
  '\n  ########## ######## ##### #####     ##### ####      ####'.yellow.bold +
  '\n    #######    #####   #### #####     ####  #### ########'.yellow.bold +
  '\n                                          ######  ###### '.yellow.bold +
  '\n                                          #####'.yellow.bold;

  console.log(welcome);

  var prompts = [{
    name: 'appName',
    message: 'What is the name of your application?',
    default: generatorName
  },{
    name: 'useRequire',
    message: 'Would you like to include RequireJS (for AMD support)?',
    default: 'Y/n',
  }];

  this.prompt(prompts, function (err, props) {

    if (err) {
      return this.emit('error', err);
    }

    this.appName    = props.appName;
    this.useRequire = (/y/i).test(props.useRequire);

    cb();

  }.bind(this));
};

CanjsGenerator.prototype._requirejs = function _requirejs(){
  var require = [
    '"require-can-renderers" : "git://github.com/retro/require-can-renderers.git",',
    '"requirejs" : "~2.1.6",'
  ];
  return this.useRequire ? require.join("\n") : "";
}

CanjsGenerator.prototype.app = function app() {
  var depManager  = this.useRequire ? 'requirejs' : 'none';
  var appTemplate = this.read('_app.js');
  var appWrapper  = this.read('_' + depManager + '_wrap.js');
  var app         = this._.underscored(this.appName);

  this.copy('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template(depManager + '.html', app + '.html');
  this.write(app + '.js', appWrapper.replace('/*APPCODE*/', appTemplate));
  
  if(this.useRequire){
    this.copy('requirejsconfig.js', 'requirejsconfig.js');
  }
};

CanjsGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};