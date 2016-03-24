var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');
var utils = require('../lib/utils');
var upperFirst = require("lodash.upperfirst");

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.props = {};

    this.argument('name', {
      type: String,
      required: false,
      desc: 'The name for you model (e.g. order)'
    });

    this.modelFiles = [
      'fixtures/model.js',
      'model.js',
      'model_test.js'
    ];
  },

  prompting: function () {
    var done = this.async();

		this.prompt({
			name: 'name',
			type: String,
			required: true,
			message: 'The name for you model (e.g. order)',
			when: !this.name
		}, function (first) {
			var name = this.name = this.name || first.name;
			var prompts = [{
				name: 'url',
				message: 'What is the URL endpoint?',
				default: '/' + name
			}, {
				name: 'idProp',
				message: 'What is the property name of the id?',
				default: 'id'
			}];

			this.prompt(prompts, function (props) {
				this.props = _.extend(this.props, props);

				done();
			}.bind(this));
		}.bind(this));
  },

  writing: function () {
    var self = this;
    var done = this.async();
    var pkgFile = this.destinationPath('package.json');
    var pkg = this.fs.readJSON(pkgFile, false);

    if(pkg === false) {
      var error = new Error('Expected to find a package.json file at ' + pkgFile +
                            ' but did not');
      return done(error);
    }
    var folder = _.get(pkg, 'system.directories.lib');
    var appName = _.get(pkg, 'name');

    if (folder == null || appName == null) {
      self.log.error("The 'name' or 'system.directories.lib' is not specified in your package.json file.");
      process.exit(1);
    }

    var options = {
      className: upperFirst(_.camelCase(this.name)),
      name: this.name,
      url: this.props.url.trim(),
      idProp: this.props.idProp
    };

    if(this.name === 'test') {
      throw new Error('Supermodel can not be named "test"');
    }

    this.modelFiles.forEach(function(name) {
      var target = name.replace('model', options.name);
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath(path.join(folder, 'models', target)),
        options
      );
    });

    var modelTest = this.destinationPath(path.join(folder, 'models', 'test.js'));
    utils.addImport(modelTest, appName + '/models/' + options.name + '_test');

    var fixturesFile = this.destinationPath(path.join(folder, 'models', 'fixtures', 'fixtures.js'));
    utils.addImport(fixturesFile, appName + '/models/fixtures/' + options.name);
    done();
  }
});
