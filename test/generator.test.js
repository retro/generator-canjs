var assert = require('assert');
var path = require('path');
var helpers = require('yeoman-test');
var exec = require('child_process').exec;
var donejsPackage = require('donejs-cli/package.json');
var npmVersion = require('../lib/utils').npmVersion;

function pipe(child) {
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

describe('generator-donejs:generator', function () {
  it('donejs:generator', function (done) {
    var tmpDir;

    helpers.run(path.join(__dirname, '../generator'))
      .inTmpDir(function (dir) {
        tmpDir = dir;
      })
      .withOptions({
        packages: donejsPackage.donejs,
        skipInstall: false
      })
      .withPrompts({
        name: 'donejs-generator-test'
      })
      .on('end', function () {
        child = exec('npm test', {
          cwd: tmpDir
        });

        pipe(child);

        child.on('exit', function (status) {
          assert.equal(status, 0, 'Got correct exit status');
          done();
        });
      });
  });
});
