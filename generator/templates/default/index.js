var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
  prompting: function () {
    var done = this.async();

    this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'What is the name of the file?'
    }], function (answers) {
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
