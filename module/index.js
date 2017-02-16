var BaseGenerator = require('../lib/baseGenerator');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var utils = require('../lib/utils');

module.exports = BaseGenerator.extend({
  constructor: function(args, opts) {
    BaseGenerator.call(this, args, opts);

    this.templatePath = utils.templatePath(path.join('.donejs', 'templates', 'module'));

    this.argument('name', {
      type: String,
      required: false,
      desc: 'The module name (e.g. my/module)'
    });

    this.moduleFiles = [
      'module.js',
      'module.md',
      'test.html',
      'module_test.js'
    ];
  },

  prompting: function () {
    var done = this.async();
    this.prompt({
      name: 'name',
      message: 'What is the name of your module (e.g. my/module)?',
      validate: utils.validateRequired,
      when: !this.options.name
    }).then(function(prompt) {
      _.extend(this.options, prompt);
      done();
    }.bind(this));
  },

  writing: function () {
    var self = this;
    var pkgFile = this.destinationPath('package.json');
    var parts = this.options.name.split('/');
    var name = _.last(parts);
    var pkg = this.fs.readJSON(pkgFile, false);
    if(pkg === false) {
      throw new Error("No package.json file not found at "+pkgFile);
    }
    var folder = _.get(pkg, 'steal.directories.lib');
    var appName = _.get(pkg, 'name');

    if (folder == null || appName == null) {
      throw new Error("The 'name' or 'steal.directories.lib' is not specified in your package.json file.");
    }

    var fullPath = [folder].concat(parts);

    var options = {
      // ../ levels to go up to the root
      root: _.repeat('../', fullPath.length),
      // The full component path
      path: path.join.apply(path, fullPath),
      // The short name of the component (e.g. list for restaurant/list)
      name: name,
      app: appName,
      // The full module name (e.g. pmo/restaurant/list)
      module: [appName].concat(parts).join('/')
    };

    this.moduleFiles.forEach(function (name) {
      var target = name.replace('module', options.name);
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath(path.join(options.path, target)),
        options
      );
    });

    var mainTests = this.destinationPath(path.join(folder, 'test', 'test.js'));
    utils.addImport(mainTests, [appName].concat(fullPath.slice(1)).join('/') +
      '/' + name + '_test');
  }
});
