import QUnit from 'steal-qunit';
import module from './<%= name %>';

QUnit.module('<%= module %>');

QUnit.test('Initialized the module', function(){
  QUnit.equal(typeof module, 'function');
  QUnit.equal(module(), 'This is the <%= name %> module');
});
