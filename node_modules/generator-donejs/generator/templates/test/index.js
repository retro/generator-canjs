var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('<%= name %>', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../default'))
      .inTmpDir()
      .withPrompts({
        name: 'testing'
      }).on('end', done);
  });

  it('should write testing.js file', function() {
    assert.file(['testing.js']);
    assert.fileContent('testing.js', /This is a file from the <%= name %> DoneJS generator/);
  });
});
