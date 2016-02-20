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
  it('donejs:supermodel', function (done) {
    var tmpDir;

    helpers.run(path.join(__dirname, '../supermodel'))
      .inTmpDir(function (dir) {
        tmpDir = dir;
        fs.copySync(path.join( __dirname, "tests", "basics" ), dir)
      })
      .withOptions({
        skipInstall: true
      })
      .withPrompts({
        name: 'messages',
        url: "/messages",
        idProp: "id"
      })
      .on('end', function () {
        assert( fs.existsSync( path.join( tmpDir, "src", "models", "messages.js" ) ), "bar.js exists" );
        done();
      });
  });
});
