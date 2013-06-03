'use strict';
var util   = require('util');
var path   = require('path');
var yeoman = require('yeoman-generator');

var extractGeneratorName = function (_, appname) {
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
  var generatorName = extractGeneratorName(this._, this.appname);

  // welcome message
  var welcome =
  '\n                                            ####'.yellow.bold +
  '\n    ######### ###########   ####  #######  ######'.yellow.bold +
  '\n  ########### ############# ############### ####'.yellow.bold +
  '\n ############ ############# ###############'.yellow.bold +
  '\n ######              ###### #####    ###### ####  ########'.yellow.bold +
  '\n #####                ##### #####     ##### #### ##########'.yellow.bold +
  '\n #####          ########### #####     ##### #### ##########'.yellow.bold +
  '\n #####       ############## #####     ##### #### #####'.yellow.bold +
  '\n #####       #####    ##### #####     ##### ####  ######'.yellow.bold +
  '\n ######     ######    ##### #####     ##### ####    ######'.yellow.bold +
  '\n ########## ######### ##### #####     ##### ####      #####'.yellow.bold +
  '\n  ########## ######## ##### #####     ##### #### ##########'.yellow.bold +
  '\n    #######    #####   #### #####     ####  #### #########'.yellow.bold +
  '\n                                          ######  #######'.yellow.bold +
  '\n                                           ####'.yellow.bold;

  console.log(welcome);

  var prompts = [{
    name: 'appName',
    message: 'What is the name of your application?',
    default: generatorName
  },{
    name: 'depManagement',
    message: 'What are you using for dependency management: (s)teal, (r)equire.js or (n)one? s/r/n',
    default: 'n'
  }];

  var depManagers = {
    s       : 'steal',
    r       : 'requirejs',
    n       : 'none'
  }

  var depPrompts = {
    steal : [{
      name : 'stealPath',
      message : 'FOO BAR BAZ'
    }],
    requirejs : []
  }

  var depCbs = {
    steal : function(props){
    },
    requirejs : function(props){

    }
  }

  this.prompt(prompts, function (err, props) {
    var forDepPrompts;

    if (err) {
      return this.emit('error', err);
    }

    this.appName    = props.appName;
    this.depManager = depManagers[this._.trim(props.depManagement)];

    forDepPrompts = depPrompts[this.depManagement];

    if(forDepPrompts){
      this.prompt(forDepPrompts, function(err, props){
        var depCb = depCbs[this.depManagement].bind(this);
        if(err) {
          return this.emit('error', err);
        }
        depCb(props);
        cb();
      }.bind(this))
    } else {
      cb();
    }

  }.bind(this));
};

CanjsGenerator.prototype._scriptTag = function(){
  var app = this._.underscored(this.appName);
  if(this.depManager === 'steal'){
    return "<script type='text/javascript' src='../steal/steal.js?" + app + "'></script>";
  } else if(this.depManager === 'requirejs'){
    return "<script type='text/javascript' src='components/requirejs/require.js' data-main='" + app + "'></script>";
  } else {
    return "<script type='text/javascript' src='" + app + ".js'></script>";
  }
}

CanjsGenerator.prototype._depManagerBower = function(){
  if(this.depManager === 'requirejs'){
    return '"requirejs" : "~2.1.6",';
  }
  return '';
}

CanjsGenerator.prototype.app = function app() {
  var appTemplate = this.read('_app.js');
  var appWrapper  = this.read('_' + this.depManager + '_wrap.js');
  var app         = this._.underscored(this.appName);
  this.copy('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('depmanager', '.depmanager');
  this.template('app.html', app + '.html');
  this.write(app + '.js', appWrapper.replace('/*APPCODE*/', appTemplate));
};

CanjsGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');

};
