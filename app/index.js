var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');

module.exports = generators.Base.extend({
  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage,
      repository: this.pkg.repository
    };
  },

  prompting: function () {
    var done = this.async();
    var prompts = [{
      name: 'name',
      message: 'Project name',
      when: !this.pkg.name,
      default: process.cwd().split(path.sep).pop()
    }, {
      name: 'short',
      message: 'What is your application short name?',
      default: 'app'
    }, {
      name: 'folder',
      message: 'Project main folder',
      default: 'src'
    }, {
      name: 'description',
      message: 'Description',
      when: !this.pkg.description
    }, {
      name: 'homepage',
      message: 'Project homepage url',
      when: !this.pkg.homepage
    }, {
      name: 'githubAccount',
      message: 'GitHub username or organization',
      when: !this.pkg.repository
    }, {
      name: 'authorName',
      message: 'Author\'s Name',
      when: !this.pkg.author,
      store: true
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email',
      when: !this.pkg.author,
      store: true
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage',
      when: !this.pkg.author,
      store: true
    }, {
      name: 'keywords',
      message: 'Key your keywords (comma to split)',
      when: !this.pkg.keywords,
      filter: _.words
    }];

    this.prompt(prompts, function (props) {
      this.props = _.extend(this.props, props);

      this.config.set('short', this.props.short);
      this.config.set('folder', this.props.folder);

      done();
    }.bind(this));
  },

  writing: function () {
    var self = this;
    var pkgJsonFields = {
      name: _.kebabCase(this.props.name),
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      repository: this.props.repository,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      scripts: {
        test: 'testee ' + this.props.short + '/test.html --browsers firefox',
        start: 'can-serve --port 8080'
      },
      main: this.props.folder + '/index.stache!done-autorender',
      files: [this.props.folder],
      keywords: this.props.keywords,
      system: {
        directories: {
          lib: 'src'
        },
        npmIgnore: ['documentjs', 'testee']
      }
    };

    this.fs.writeJSON('package.json', _.extend(pkgJsonFields, this.pkg));

    this.npmInstall([
      'can@^2.3.0-pre.0',
      'can-connect',
      'steal',
      'jquery',
      'can-ssr',
      'done-autorender',
      'done-css',
      'done-component'
    ], {'save': true});

    this.npmInstall([
      'documentjs@^0.3.0-pre.4',
      'funcunit',
      'steal-qunit',
      'steal-tools',
      'testee'
    ], {'saveDev': true});

    this.fs.copyTpl(
      self.templatePath('index.stache'),
      self.destinationPath(self.props.folder + '/index.stache'),
      self.props
    );

    this.fs.copyTpl(
      self.templatePath('app.js'),
      self.destinationPath(self.props.folder + '/app.js'),
      self.props
    );
  }
});
