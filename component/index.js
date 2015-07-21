var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var utils = require('../utils');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    // This makes `appname` a required argument.
    this.argument('name', {
      type: String,
      required: true,
      desc: 'The module name for your component (e.g. pmo/home)'
    });

    this.modletFiles = [
      'modlet/component.html',
      'modlet/component.js',
      'modlet/component.md',
      'modlet/component.less',
      'modlet/component.stache',
      'modlet/component_test.js',
      'modlet/test.html'
    ];
  },

  writing: function () {
    var isDoneComponent = this.name.indexOf('.component') !== -1;
    this.name = this.name.replace('.component', '');

    var self = this;
    var parts = _.compact(this.name.split('/'));
    var name = parts[parts.length - 1];
    // The application short name (e.g. pmo)
    var short = this.config.get('short');
    // The folder (usually src/)
    var folder = this.config.get('folder');
    var fullPath = [folder].concat(parts);

    // .component files don't go in their own folder
    if(isDoneComponent) {
      fullPath.pop();
    }

    var options = {
      // ../ levels to go up to the root
      root: '../'.repeat(fullPath.length),
      // Application short name (e.g. pmo)
      short: short,
      // The full component path
      path: path.join.apply(path, fullPath),
      // The full tag name (prepending the short name if it isn't there yet)
      tag: (parts[0] === short ? parts : [short].concat(parts)).join('-'),
      // The short name of the component (e.g. list for restaurant/list)
      name: name,
      // The full module name (e.g. pmo/restaurant/list)
      module: [short].concat(parts).join('/')
    };

    if(isDoneComponent) {
      this.fs.copyTpl(
        self.templatePath('component.component'),
        self.destinationPath(path.join(options.path, options.name + '.component')),
        options
      );
    } else {
      this.modletFiles.forEach(function(name) {
        var target = name.replace('component', options.name).replace('modlet/', '');
        self.fs.copyTpl(
          self.templatePath(name),
          self.destinationPath(path.join(options.path, target)),
          options
        );
      });

      var mainTests = this.destinationPath(path.join(folder, 'test.js'));
      utils.addImport(mainTests, options.path + '/' + options.name + '_test');
    }
  }
});
