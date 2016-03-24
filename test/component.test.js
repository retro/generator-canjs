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
  });
});
