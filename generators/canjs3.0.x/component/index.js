
var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');
var utils = require('../lib/utils');

module.exports = generators.Base.extend({
  templatePath: utils.templatePath(path.join('.donejs', 'templates', 'component')),

  constructor: function () {
    generators.Base.apply(this, arguments);

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

			var tag = _.kebabCase(name);
			var prompts = [{
				name: 'tag',
				message: 'The tag name of the component',
				default: tag,
        when: !this.tag
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
    var done = this.async();

    var pkg = utils.getPkgOrBail(this, done);
    if(!pkg) {
      return;
    }

		var parts = this.name.split('/');
		var name = _.last(parts);
		var folder = _.get(pkg, 'system.directories.lib') || "./";
		var appName = _.get(pkg, 'name');
    // If we generate a component with the same name as the application
    var isRootComponent = name === appName;

    // https://github.com/donejs/donejs/issues/525
    if(!isRootComponent && parts[0] === appName) {
      parts.shift();
    }

		var fullPath = isRootComponent ? [folder] : [folder].concat(parts);

		// .component files don't go in their own folder
		if (isDoneComponent) {
			fullPath.pop();
		}

		var options = {
			// ../ levels to go up to the root
			root: _.repeat('../', fullPath.length),
			// The full component path
			path: path.join.apply(path, fullPath),
			// The full tag name (prepending the short name if it isn't there yet)
			tag: this.tag,
			// The short name of the component (e.g. list for restaurant/list)
			name: name,
			app: appName,
			// The full module name (e.g. pmo/restaurant/list)
			module: isRootComponent ? parts.join('/') : [appName].concat(parts).join('/')
		};

		if (isDoneComponent) {
			this.fs.copyTpl(
					self.templatePath('component.component'),
					self.destinationPath(path.join(options.path, options.name + '.component')),
					options
			);
		} else {
			this.modletFiles.forEach(function (name) {
				var target = name.replace('component', options.name).replace('modlet/', '');
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
    done();
  }
});
