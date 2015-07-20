var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    // This makes `appname` a required argument.
    this.argument('name', {
      type: String,
      required: true,
      desc: 'The module name for your component (e.g. pmo/home)'
    });

    this.componentFiles = [
      'component.html',
      'component.js',
      'component.less',
      'component.stache',
      'component_test.js',
      'test.html'
    ];
  },

  writing: function () {
    var self = this;
    var short = this.config.get('short');
    var folder = this.config.get('folder');
    var parts = this.name.split('/');
    var fullPath = [folder].concat(parts);
    var options = {
      // ../ levels to go up to the root
      root: '../'.repeat(fullPath.length),
      // Application short name (e.g. pmo)
      short: short,
      // The full component path
      path: path.join.apply(path, fullPath),
      // The full tag name (prepending the short name if it isn't there yet)
      tag: (parts[0] === short ? parts : [short].concat(parts)).join('-'),
      // The short name of the component (e.g. list for restaurant/list)
      name: parts[parts.length - 1],
      // The full module name (e.g. pmo/restaurant/list)
      module: [short].concat(parts).join('/')
    };

    this.componentFiles.forEach(function(name) {
      var target = name.replace('component', options.name);
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath(path.join(options.path, target)),
        options
      );
    });
  }
});
