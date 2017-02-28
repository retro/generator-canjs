var assert = require('assert');
var utils = require('../lib/utils');
var testHelpers = require('./helpers');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

describe('generator:utils', function() {
  describe('addImport', function() {
    beforeEach(function() {
      var dir = this.tmpDir = testHelpers.tmpdir();
      mkdirp.sync(dir);

      var f = path.join(dir, 'test.js');
      fs.writeFileSync(f, '', 'utf8');
    });

    it('Adding a named import', function() {
      var tmpDir = this.tmpDir;
      var f = path.join(tmpDir, 'test.js');

      utils.addImport(f, 'foo', 'foo');

      var actual = fs.readFileSync(f);
      var expected = [
        'import foo from \'foo\';',
        ''
      ].join('\n');

      assert.equal(actual, expected, 'correctly written');
    });

    it('doesn\'t add extra newlines', function() {
      var tmpDir = this.tmpDir;
      var f = path.join(tmpDir, 'test.js');
      fs.writeFileSync(f, 'import foo from \'foo\';\n', 'utf8');

      utils.addImport(f, 'bar', 'bar');
      utils.addImport(f, 'baz', 'baz');

      var actual = fs.readFileSync(f);
      var expected = [
        'import foo from \'foo\';',
        '',
        'import bar from \'bar\';',
        '',
        'import baz from \'baz\';',
        ''
      ].join('\n');

      assert.equal(actual, expected, 'should not have multiple newlines in a row');
    });

    it('don\'t add duplicate imports', function() {
      var tmpDir = this.tmpDir;
      var f = path.join(tmpDir, 'test.js');
      var expected = [
        'import foo from \'foo\';',
        '',
        'import bar from \'bar\';'
      ].join('\n');
      fs.writeFileSync(f, expected, 'utf8');

      utils.addImport(f, 'foo', 'foo');
      var actual = fs.readFileSync(f);

      assert.equal(actual, expected, 'should not change content');
    });

    it('works when there is existing javascript in the file', function() {
      var tmpDir = this.tmpDir;
      var f = path.join(tmpDir, 'test.js');
      var content = [
        'import bar from \'bar\';',
        '',
        'var baz = \'bar\';',
        ''
      ].join('\n');
      fs.writeFileSync(f, content, 'utf8');

      utils.addImport(f, 'foo', 'foo');
      var actual = fs.readFileSync(f);

      var expected = [
        'import bar from \'bar\';',
        '',
        'import foo from \'foo\';',
        '',
        'var baz = \'bar\';',
        ''
      ].join('\n');

      assert.equal(actual, expected, 'should have all imports at the top');
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

  it('validateRequired', function() {
    assert.ok(!utils.validateRequired(''), 'empty string should fail validation');
    assert.ok(!utils.validateRequired(), 'not passing a value should fail validation');
    assert.ok(utils.validateRequired('name'), 'passing a value passes validation');
  });

  it('validateTagName', function() {
    assert.ok(utils.validateTagName('abc-xyz'), 'should return true for valid names');
    assert.ok(/abc is not a valid tag name/.test(utils.validateTagName('abc')), 'should return warning message for invalid names');
  });
});
