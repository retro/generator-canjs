var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
  prompting: function () {
    var done = this.async();

    this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Name of project for Cordova',
      default : this.appname // Default to current folder name
    }], function (answers) {
      done();
    }.bind(this));
  },
  
  writing: function () {
    
  }
});
