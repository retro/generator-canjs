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
      'documentjs.json',
      'readme.md',
      '_gitignore',
      'test/test.html',
      'test/test.js',
    ];

    this.srcFiles = [
      'plugin_test.js',
      'plugin.js',
      'plugin.md'
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
        done();
      }.bind(this));
    }.bind(this));
  },

  writing: function () {
    var self = this;
    var jshintFolder = this.props.folder && this.props.folder !== '.' ?
      ' ./' + this.props.folder + '/' : '';
    var pkgJsonFields = {
      name: this.props.name,
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      repository: {
        type: 'git',
        url: 'git://github.com/' +  this.props.githubAccount + '/' + this.props.name + '.git'
      },
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      "scripts": {
        preversion: "npm test && npm run build",
        version: "git commit -am \"Update dist for release\" && git checkout -b release && git add -f dist/",
        postversion: "git push --tags && git checkout master && git branch -D release && git push",
        testee: "testee test/test.html --browsers firefox",
        test: "npm run jshint && npm run testee",
        jshint: "jshint ./*.js" + jshintFolder + " --config",
        "release:patch": "npm version patch && npm publish",
        "release:minor": "npm version minor && npm publish",
        "release:major": "npm version major && npm publish",
        build: "node build.js",
        document: "documentjs",
        develop: "done-serve --static --develop --port 8080"
      },
      main: "dist/cjs/" + this.props.name,
      browser: {
       transform: [ "cssify" ]
      },
      browserify: {
       transform: [ "cssify" ]
      },
      keywords: this.props.keywords,
      system: {
        main: this.props.name,
        configDependencies: [ 'live-reload' ],
        npmIgnore: [
          'documentjs',
          'testee',
          'generator-donejs',
          'donejs-cli',
          'steal-tools'
        ]
      }
    };

    if(this.props.folder && this.props.folder !== '.') {
      pkgJsonFields.system.directories = { lib: this.props.folder };
    }

    if(this.props.npmVersion >= 3) {
      pkgJsonFields.system.npmAlgorithm = 'flat';
    }

    if(!this.options.packages) {
      throw new Error('No DoneJS dependency package list provided!');
    }

    this.log('Writing package.json v' + this.options.version);

    var getDependency = function(name) {
      return self.options.packages.dependencies[name] ||
        self.options.packages.devDependencies[name];
    };

    this.fs.writeJSON('package.json', _.extend(pkgJsonFields, this.pkg, {
      dependencies: {
        'can': getDependency('can'),
        'jquery': getDependency('jquery'),
        'cssify': '^0.6.0'
      },
      devDependencies: {
        'documentjs': getDependency('documentjs'),
        'jshint': '^2.9.1',
        'steal': getDependency('steal'),
        'steal-qunit': getDependency('steal-qunit'),
        'steal-tools': getDependency('steal-tools'),
        'testee': getDependency('testee'),
        'generator-donejs': getDependency('generator-donejs'),
        'donejs-cli': getDependency('donejs-cli'),
        'done-serve': getDependency('done-serve')
      }
    }));

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

    this.srcFiles.forEach(function(name) {
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath(path.join(self.props.folder, name.replace('plugin', self.props.name))),
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
