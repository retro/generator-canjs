var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  constructor: function(args, opts) {
    Generator.call(this, args, opts);
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    
    this.files = [
      'file.js'
    ];
  },

  prompting: function () {
    var done = this.async();

    this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'What is the name of the file?'
    }]).then(function(answers) {
      this.props = answers;
      done();
    }.bind(this));
  },
  writing: function () {
    this.log('Copying file to ' + this.destinationPath(this.props.name + '.js'));
    
    this.fs.copyTpl(
			this.templatePath('file.js'),
			this.destinationPath(this.props.name + '.js'),
			this.props
		);
  }
});
