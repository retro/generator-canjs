var Generator = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var URL = require('whatwg-url').URL;
var utils = require('../lib/utils');
var upperFirst = require("lodash.upperfirst");
var utils = require('../lib/utils');

module.exports = Generator.extend({
  constructor: function(args, opts) {
    Generator.call(this, args, opts);

    this.templatePath = utils.templatePath(path.join('.donejs', 'templates', 'supermodel'));

    this.props = {};

    this.argument('name', {
      type: String,
      required: false,
      desc: 'The name for the model (e.g. order)'
    });

    this.modelFiles = [
      'fixtures/model.js',
      'model.js',
      'model_test.js'
    ];
  },

  prompting: function() {
    var done = this.async();

    function addToProps(props){
      this.props = _.extend(this.props, props);
    }

    this.prompt({
      name: 'name',
      type: String,
      validate: utils.validateRequired,
      message: 'The name for you model (e.g. order)',
      when: !this.options.name
    }).then(function(first) {
      var name = this.options.name = this.options.name || first.name;

      var prompt = {
        name: 'url',
        message: 'What is the URL endpoint?',
        default: '/' + name
      };

      var promptId = function() {
        var prompt = {
          name: 'idProp',
          message: 'What is the property name of the id?',
          default: 'id'
        };

        return this.prompt(prompt).then(addToProps.bind(this)).then(function(){
          done();
        });
      }.bind(this);

      this.prompt(prompt).then(function(answer){
        var rawUrl = answer.url.trim();
        try {
          var url = new URL(rawUrl);
          var urlPath = url.pathname;
          url.pathname = '';
          var serviceBaseURL = utils.removeSlash(url.toString());

          var prompt = {
            name: 'useServiceBaseURL',
            message: 'Is ' + serviceBaseURL + ' your service URL?',
            type: Boolean
          };
          this.prompt(prompt).then(function(answer){
            this.props.serviceBaseURL = answer.useServiceBaseURL &&
              serviceBaseURL;
            this.props.url = answer.useServiceBaseURL ? urlPath : rawUrl;

            return promptId();
          }.bind(this));
        } catch(ex) {
          this.props.url = answer.url;
          return promptId();
        }
      }.bind(this));
    }.bind(this));
  },

  writing: function() {
    var self = this;
    var done = this.async();
    _.mixin(require("lodash-inflection"));

    var pkg = utils.getPkgOrBail(this, done);
    if(!pkg) {
      return;
    }

    var folder = _.get(pkg, 'steal.directories.lib') || './';
    var appName = _.get(pkg, 'name');

    if(this.props.serviceBaseURL) {
      pkg.steal.serviceBaseURL = this.props.serviceBaseURL;
      var pkgPath = this.destinationPath('package.json');
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, ' '), 'utf8');
    }

    var options = {
      className: upperFirst(_.camelCase(this.options.name)),
      name: this.options.name,
      url: this.props.url,
      idProp: this.props.idProp
    };

    if(this.options.name === 'test') {
      throw new Error('Supermodel can not be named "test"');
    }

    this.modelFiles.forEach(function(name) {
      var target;
      if (name == 'fixtures/model.js')  {
        target = name.replace('model', _.pluralize(options.name));
      } else {
        target = name.replace('model', options.name);
      }
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath(path.join(folder, 'models', target)),
        options
      );
    });

    var modelTest = this.destinationPath(path.join(folder, 'models', 'test.js'));
    utils.addImport(modelTest, appName + '/models/' + options.name + '_test');
    var fixturesFile = this.destinationPath(path.join(folder, 'models', 'fixtures', 'fixtures.js'));
    utils.addImport(fixturesFile, appName + '/models/fixtures/' + _.pluralize(options.name));

    done();
  }
});
