var assert = require('assert');
var utils = require('../lib/utils');
var testHelpers = require('./helpers');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

describe('generator:utils', function() {
  describe('addImport', function() {
    describe('Adding a named import', function() {
      before(function() {
        var dir = this.tmpDir = testHelpers.tmpdir();
        mkdirp.sync(dir);

        var f = path.join(dir, 'test.js');
        fs.writeFileSync(f, '', 'utf8');
      });

      it('works', function() {
        var tmpDir = this.tmpDir;
        var f = path.join(tmpDir, 'test.js');

        utils.addImport(f, 'foo', 'foo');
        var testFile = fs.readFileSync(f);

        assert(/import foo from 'foo';/.test(testFile), 'correctly written');
      });
    });
  });

  describe('toNpmInstallStrings', function() {
    it('works', function(){
      var deps = {
        foo: "^1.0.0",
        bar: "~2.0.0"
      };
      var strings = utils.toNpmInstallStrings(deps);

      assert.equal(strings.length, 2, "There are two deps");
      assert.equal(strings[0], "foo@^1.0.0");
      assert.equal(strings[1], "bar@~2.0.0");
    });
  });
});
