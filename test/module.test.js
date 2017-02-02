var assert = require('assert');
var path = require('path');
var helpers = require('yeoman-test');
var exec = require('child_process').exec;
var fs = require('fs-extra');

describe('generator-donejs', function() {
  describe('donejs:module', function() {
    it('basics works', function(done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../module'))
        .inTmpDir(function(dir) {
          var done = this.async();
          tmpDir = dir;
          fs.copySync(path.join( __dirname, "tests", 'basics'), dir);
          done();
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'foo-bar'
        })
        .on('end', function() {
          assert( fs.existsSync( path.join( tmpDir, "src", "foo-bar", "foo-bar.js" ) ), "foo-bar.js exists" );
          done();
        });
    });

    it('allows to override template files', function (done) {
      var source = path.join(__dirname, 'tests', 'override', 'override.js');
      var tmpDir, target;

      helpers.run(path.join(__dirname, '../module'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          target = path.join(dir, '.donejs', 'templates', 'module', 'module_test.js');
          fs.copySync(path.join( __dirname, "tests", 'basics'), dir);
          fs.copySync(source, target);
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'foo-bar'
        })
        .on('end', function () {
          assert.fileContent(path.join( tmpDir, "src", "foo-bar", "foo-bar_test.js" ),
            /Overriden foo-bar test file/);
          done();
        });
    });

    it('throws an error if package.json is not present', function(done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../module'))
        .inTmpDir(function(dir) {
          var done = this.async();
          tmpDir = dir;
          done();
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'foo-bar'
        })
        .on('error', function(err){
          var msg = err.message;
          assert(/No package.json/.test(msg), 'Error because of no package.json');
          done();
        });
    });

    it('passing arguments works', function(done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../module'))
        .inTmpDir(function(dir) {
          var done = this.async();
          tmpDir = dir;
          fs.copySync(path.join( __dirname, "tests", 'basics'), dir);
          done();
        })
        .withOptions({
          skipInstall: true
        })
        .withArguments([
          'foo-bar'
        ])
        .on('end', function() {
          assert( fs.existsSync( path.join( tmpDir, "src", "foo-bar", "foo-bar.js" ) ), "foo-bar.js exists" );
          done();
        });
    });
  });
});
