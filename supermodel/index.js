var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');
var utils = require('../lib/utils');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.props = {};

    // This makes `appname` a required argument.
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
    var folder = this.config.get('folder');
    var options = {
      className: this.name.charAt(0).toUpperCase() + this.name.slice(1),
      name: this.name,
      url: this.props.url,
      idProp: this.props.idProp
    };

    this.modelFiles.forEach(function(name) {
      var target = name.replace('model', options.name);
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath(path.join(folder, 'models', target)),
        options
      );
    });

    var modelTest = this.destinationPath(path.join(folder, 'models', 'test.js'));
    utils.addImport(modelTest, folder + '/models/' + options.name + '_test');

    var fixturesFile = this.destinationPath(path.join(folder, 'models', 'fixtures.js'));
    utils.addImport(fixturesFile, folder + '/models/fixtures/' + options.name);
  }
});
