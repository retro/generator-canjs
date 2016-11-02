'use strict';
module.exports = require('yeoman-generator').Base.extend({
  'initializing' : function () {
    this.composeWith('generator-canjs:pre');
    /*
    this.composeWith('generator-canjs:turbo');
    this.composeWith('generator-canjs:electric');
    */
  }
});
