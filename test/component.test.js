var assert = require('assert');
var path = require('path');
var helpers = require('yeoman-generator').test;
var exec = require('child_process').exec;
var donejsPackage = require('donejs-cli/package.json');
var npmVersion = require('../lib/utils').npmVersion;
var fs = require('fs-extra');

function pipe(child) {
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

describe('generator-donejs', function () {
  describe('donejs:component', function() {

    it('works with a .component type', function (done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../component'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          fs.copySync(path.join( __dirname, "tests", 'basics'), dir)
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'home.component'
        })
        .on('end', function () {
          assert(fs.existsSync(path.join(tmpDir, 'src', 'home.component')),
                 'home.component exists');
          done();
        });
    });

    it('can provide a name that includes the package name', function(done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../component'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          fs.copySync(path.join( __dirname, "tests", 'basics'), dir)
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'basics/foo/bar',
          tag: 'foo-bar'
        })
        .on('end', function () {
          assert(fs.existsSync(path.join(tmpDir, 'src', 'foo', 'bar', 'bar.js')),
                 'created at the right place');
          done();
        });
    });

    it('works with no directories.lib', function (done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../component'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          fs.copySync(path.join( __dirname, "tests", "no_directories" ), dir)
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'foo/bar',
          tag: 'foo-bar'
        })
        .on('end', function () {
          assert( fs.existsSync( path.join( tmpDir, "foo", "bar", "bar.js" ) ), "bar.js exists" );
          assert( fs.existsSync( path.join( tmpDir, "foo", "bar", "bar_test.js" ) ), "bar_test.js exists" );
          assert( fs.existsSync( path.join( tmpDir, "foo", "bar", "bar.html" ) ), "bar.html exists" );
          done();
        });
    });

    it('Errors when a package is not found', function (done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../component'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          fs.copySync(path.join(__dirname, 'tests', 'empty'), dir);
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'foo/bar',
          tag: 'foo-bar'
        })
        .on('error', function(err) {
          var msg = err.message;
          assert(/Expected to find/.test(msg), 'Correct error message');
          done();
        });
    });

    it('allows to override template files', function (done) {
      var source = path.join(__dirname, 'tests', 'override', 'override.js');
      var tmpDir, target;

      helpers.run(path.join(__dirname, '../component'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          target = path.join(dir, '.donejs', 'templates', 'component', 'modlet', 'component_test.js');
          fs.copySync(path.join( __dirname, "tests", 'basics'), dir);
          fs.copySync(source, target);
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'dummy',
          tag: 'dummy-component'
        })
        .on('end', function () {
          assert.fileContent(path.join(tmpDir, 'src', 'dummy', 'dummy_test.js'),
            /Overriden dummy test file/);
          done();
        });
    });
  });
});
