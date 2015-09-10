var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');
var makeVersionList = function(list) {
  return Object.keys(list).map(function(key) {
    return key + '@' + list[key];
  });
};

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
      'readme.md',
      'documentjs.json',
      '_gitignore'
    ];

    this.srcFiles = [
      'app.js',
      'index.stache',
      'index.md',
      'index.html',
      'styles.less',
      'test.html',
      'test/test.js',
      'test/functional.js',
      'models/fixtures/fixtures.js',
      'models/test.js'
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
      message: 'Application keywords',
      when: !this.pkg.keywords,
      filter: _.words
    }];

    this.prompt(prompts, function (props) {
      this.props = _.extend(this.props, props);

      this.config.set('folder', this.props.folder);
      this.config.set('name', this.props.name);

      done();
    }.bind(this));
  },

  writing: function () {
		var pkgName = _.kebabCase(this.props.name);
		var pkgMain = pkgName + '/index.stache!done-autorender';

    var self = this;
    var pkgJsonFields = {
      name: pkgName,
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
        test: 'testee ' + this.props.folder + '/test.html --browsers firefox --reporter Spec',
        start: 'can-serve --port 8080',
        develop: "can-serve --develop --port 8080",
        document: "documentjs",
        build: "steal-tools"
      },
      main: pkgMain,
      files: [this.props.folder],
      keywords: this.props.keywords,
      system: {
				main: pkgMain,
        directories: {
          lib: this.props.folder
        },
        configDependencies: [ 'live-reload' ],
        npmIgnore: [
          'documentjs',
          'testee',
          'donejs-deploy',
          'generator-donejs'
        ]
      }
    };

    this.fs.writeJSON('package.json', _.extend(pkgJsonFields, this.pkg));

    if(this.options.packages) {
      this.log('Installing packages for DoneJS v' + this.options.version);
      var deps = this.options.packages.dependencies;
      var devDeps = this.options.packages.devDependencies;

      this.npmInstall(makeVersionList(deps), { save: true });
      this.npmInstall(makeVersionList(devDeps), { saveDev: true });

    } else {
      this.log('No DoneJS packages with specific versions provided! Installing latest version of every package. WARNING: Projects with latest versions might not be tested together yet.');
      this.npmInstall([
        'can',
        'can-connect',
        'steal',
        'jquery',
        'can-ssr',
        'done-autorender',
        'done-css',
        'done-component',
        'generator-donejs'
      ], { save: true });

      this.npmInstall([
        'documentjs',
        'funcunit',
        'steal-qunit',
        'steal-tools',
        'testee',
        'donejs-deploy'
      ], { saveDev: true});
    }

    this.mainFiles.forEach(function(name) {
      // Handle bug where npm has renamed .gitignore to .npmignore
      // https://github.com/npm/npm/issues/3763
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath((name === "_gitignore") ? ".gitignore" : name),
        self.props
      );
    });

    this.srcFiles.forEach(function(name) {
      self.fs.copyTpl(
        self.templatePath(path.join('src', name)),
        self.destinationPath(path.join(self.props.folder, name)),
        self.props
      );
    });
  }
});
