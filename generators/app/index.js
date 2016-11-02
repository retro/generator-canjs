'use strict';
module.exports = require('yeoman-generator').Base.extend({
  'initializing' : function () {
    //this.composeWith('canjs:pre');
    this.composeWith('canjs:pre', {
      arguments: ['app']
    }, {
      local: require.resolve('generator-canjs')
    });
    }
    /*
    this.composeWith('canjs:donejs');
    this.composeWith('canjs:canjs2.3.x');
    this.composeWith('canjs:canjs3.0.x');
    */

});
