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

      it('doesn\'t add extra newlines', function() {
        var tmpDir = this.tmpDir;
        var f = path.join(tmpDir, 'test.js');
        fs.writeFileSync(f, 'import bar from \'bar\'\n', 'utf8');

        utils.addImport(f, 'foo', 'foo');
        utils.addImport(f, 'bar', 'bar');
        var testFile = fs.readFileSync(f);

        assert(!(/\n\n\n/.test(testFile)), 'should not have multiple newlines in a row');
      });
    });
  });
});
