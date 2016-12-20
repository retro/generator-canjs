var validate = require("validate-npm-package-name");
var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');
var npmVersion = require('../lib/utils').npmVersion;

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
      '_gitignore',
      'build.js',
      'production.html',
      'development.html'
    ];

    this.srcFiles = [
      'test.html',
      'app.js',
      'index.stache',
      'index.md',
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

    npmVersion(function(err, version){
      if(err) {
        done(err);
        return;
      }

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
      }, {
        name: 'npmVersion',
        message: 'NPM version used',
        default: version.major
      }];

      this.prompt(prompts, function (props) {
        this.props = _.extend(this.props, props);
        this.props.name = _.kebabCase(this.props.name);

        var validationResults = validate(this.props.name);
        var isValidName = validationResults.validForNewPackages;

        if(!isValidName) {
          var warnings = validationResults.warnings;
          var error = new Error('Your project name ' + this.props.name + ' is not ' +
            'valid. Please try another name. Reason: ' + warnings[0]);
          done(error);
          return;
        }

        if (path.isAbsolute(this.props.folder)) {
          this.props.folder = path.relative(this.destinationPath(), this.props.folder);
        }
        var isValidPath = this.props.folder.indexOf('..') === -1;
        if (!isValidPath) {
          var error = new Error('Your project main folder ' + this.props.folder + ' is external ' +
            'to the project folder. Please set to internal path.');
          done(error);
          return;
        }

        done();
      }.bind(this));
    }.bind(this));
  },

  writing: function () {
		var pkgName = this.props.name;
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
        start: 'done-serve --port 8080',
        develop: "done-serve --develop --port 8080",
        document: "documentjs",
        build: "node build"
      },
      main: pkgMain,
      files: [this.props.folder],
      keywords: this.props.keywords,
      system: {
				main: pkgMain,
        directories: {
          lib: this.props.folder
        },
        configDependencies: [ 'live-reload', 'node_modules/can-zone/register' ],
        transpiler: 'babel'
      }
    };

    if(this.props.npmVersion < 3) {
      pkgJsonFields.system.npmAlgorithm = 'nested';
    }

    if(!this.options.packages) {
      throw new Error('No DoneJS dependency package list provided!');
    }

    this.log('Writing package.json v' + this.options.version);

    var deps = this.options.packages.dependencies;
    var devDeps = this.options.packages.devDependencies;

    this.fs.writeJSON('package.json', _.extend(pkgJsonFields, this.pkg, {
      dependencies: deps,
      devDependencies: devDeps
    }));

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
  },

  end: function () {
    if(!this.options.skipInstall) {
      var done = this.async();
      this.spawnCommand('npm', ['--loglevel', 'error', 'install']).on('close', done);
    }
  }
});
