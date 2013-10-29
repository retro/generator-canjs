/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('CanJS generator with RequireJS', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('canjs:app', [
        '../../app'
      ]);

      this.app.options['skip-install'] = true;

      helpers.mockPrompt(this.app, {
        'appName': 'foo',
        'useRequire': 'Y'
      });

      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.jshintrc',
      '.editorconfig',
      'bower.json',
      ['foo.html', /require\.js/],
      ['foo.js', /requirejs/],
      'package.json',
      'requirejsconfig.js'
    ];

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  describe('CanJS Model', function(){
    it('creates canjs model', function(done){
      var model = helpers.createGenerator('canjs:model', ['../../model']);

      helpers.mockPrompt(model, {
        name : 'models/user',
        generateFixture : 'y'
      })

      this.app.run({}, function(){
        model.run([], function(){
          helpers.assertFiles([
            ['models/user.js', /return can\.Model/],
            ['fixtures/users.js', /return store/]
          ]);
        })
        done();
      })
    })
  })

  describe('CanJS Control', function(){
    it('creates canjs control', function(done){
      var control = helpers.createGenerator('canjs:control', ['../../control'], ['controls/users']);
      this.app.run({}, function(){
        control.run([], function(){
          helpers.assertFiles([
            ['controls/users/users.js', /return can\.Control/],
            'controls/users/init.ejs',
            'controls/users/init.mustache',
            ['controls/users/users.html', /requirejs/],
          ]);
        })
        done();
      })
    })
  })

  describe('CanJS Component', function(){
    it('creates canjs control', function(done){
      var control = helpers.createGenerator('canjs:component', ['../../component'], ['component/users']);
      this.app.run({}, function(){
        control.run([], function(){
          helpers.assertFiles([
            ['controls/users/users.js', /return can\.Component/],
            ['controls/users/users.html', /requirejs/],
          ]);
        })
        done();
      })
    })
  })

});
