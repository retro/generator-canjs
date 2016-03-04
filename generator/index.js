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
    
    this.mainFiles = [
      '_gitignore',
      'license.md',
      'readme.md',
      'default/templates/file.js',
      'default/index.js',
      'test/index.js'
    ];
  },

  prompting: function () {
    var done = this.async();
    
    var prompts = [{
      name: 'name',
      message: 'Project name',
      when: !this.pkg.name,
      default: process.cwd().split(path.sep).pop()
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
      message: 'Application keywords',
      when: !this.pkg.keywords,
      filter: _.words
    }];

    this.prompt(prompts, function (props) {
      this.props = _.extend(this.props, props);
      this.props.name = _.kebabCase(this.props.name);
      done();
    }.bind(this));
  },

  writing: function () {
    var self = this;
    
    this.fs.writeJSON('package.json', {
      name: this.props.name,
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      repository: this.props.repository,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      license: "MIT",
      main: "lib/",
      scripts: {
        test: "npm run jshint && npm run mocha",
        jshint: "jshint test/. default/index.js --config",
        mocha: "mocha test/ --timeout 120000",
        publish: "git push origin --tags && git push origin",
        'release:patch': "npm version patch && npm publish",
        'release:minor': "npm version minor && npm publish",
        'release:major': "npm version major && npm publish"
      },
      keywords: this.props.keywords
    });
    
    this.npmInstall(['yeoman-generator', 'lodash'], { 'save': true });
    this.npmInstall(['mocha', 'jshint', 'yeoman-assert', 'yeoman-test'], { 'saveDev': true });

    this.fs.copy(this.templatePath('static'), this.destinationPath());
    this.fs.copy(this.templatePath('static/.*'), this.destinationPath());
    
    this.mainFiles.forEach(function(name) {
      // Handle bug where npm has renamed .gitignore to .npmignore
      // https://github.com/npm/npm/issues/3763
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath((name === "_gitignore") ? ".gitignore" : name),
        self.props
      );
    });
  }
});
