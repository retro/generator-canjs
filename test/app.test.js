var path = require('path');
var helpers = require('yeoman-generator').test;
var exec = require('child_process').exec;
var donejsPackage = require('donejs/package.json');

function pipe(child) {
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

describe('generator-donejs', function () {
  it('donejs:app', function (done) {
    var tmpDir;

    helpers.run(path.join(__dirname, '../app'))
      .inTmpDir(function (dir) {
        tmpDir = dir;
      })
      .withOptions({
        packages: donejsPackage.donejs,
        skipInstall: false
      })
      .withPrompts({
        name: 'place-my-tmp'
      })
      .on('end', function () {
        child = exec('npm test', {
          cwd: tmpDir
        });

        pipe(child);

        child.on('exit', function (status) {
          assert.equal(status, 0, 'Got correct exist status');
          done();
        });
      });
  });
});