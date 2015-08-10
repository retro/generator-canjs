var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var utils = require('../lib/utils');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    // This makes `appname` a required argument.
    this.argument('name', {
      type: String,
      required: false,
      desc: 'The module name for your component (e.g. restaurant/list)'
    });

		this.argument('tag', {
			type: String,
			required: false,
			desc: 'The name of the tag (e.g. restaurant-list)'
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

	prompting: function () {
		var done = this.async();
		this.prompt({
			name: 'name',
			message: 'What is the module name of your component (e.g. pmo/home or pmo/home.component)?',
			required: true,
			when: !this.name
		}, function (first) {
			var name = this.name = this.name || first.name;

			this.isDoneComponent = this.name.indexOf('.component') !== -1;
			this.name = name = name.replace('.component', '');

			var parts = this.parts = _.compact(this.name.split('/'));
			var short = this.short = this.config.get('short');

			var tag = (parts[0] === short ? parts :
				[short].concat(parts)).join('-');
			var prompts = [{
				name: 'tag',
				message: 'The tag name of the component',
				default: tag
			}];

			this.prompt(prompts, function (props) {
				_.extend(this, props);

				done();
			}.bind(this));
		}.bind(this));
	},

  writing: function () {
    var isDoneComponent = this.isDoneComponent;

    var self = this;
    var parts = this.parts;
    var name = parts[parts.length - 1];
    var short = this.short;
    // The folder (usually src/)
    var folder = this.config.get('folder');
    var appName = this.config.get('name');
    var fullPath = [folder].concat(parts);

    // .component files don't go in their own folder
    if(isDoneComponent) {
      fullPath.pop();
    }

    var options = {
      // ../ levels to go up to the root
      root: _.repeat('../', fullPath.length),
      // Application short name (e.g. pmo)
      short: short,
      // The full component path
      path: path.join.apply(path, fullPath),
      // The full tag name (prepending the short name if it isn't there yet)
      tag: this.tag,
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
      utils.addImport(mainTests, appName + '/' + name + '/' + name + '_test');
    }
  }
});
