var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var utils = require('../lib/utils');

module.exports = generators.Base.extend({
  templatePath: utils.templatePath(path.join('.donejs', 'templates', 'module')),
  
  constructor: function () {
    generators.Base.apply(this, arguments);

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
			required: true,
			when: !this.name
		}, function (prompt) {
      _.extend(this, prompt);
      done();
		}.bind(this));
	},

  writing: function () {
    var self = this;
    var pkgFile = this.destinationPath('package.json');
		var parts = this.name.split('/');
		var name = _.last(parts);
		var pkg = this.fs.readJSON(pkgFile, false);
		if(pkg === false) {
			self.log.error("No package.json file not found at "+pkgFile);
			process.exit(1);
		}
		var folder = _.get(pkg, 'system.directories.lib');
		var appName = _.get(pkg, 'name');

		if (folder == null || appName == null) {
			self.log.error("The 'name' or 'system.directories.lib' is not specified in your package.json file.");
			process.exit(1);
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
  }
});
