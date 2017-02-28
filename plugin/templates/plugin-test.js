import QUnit from 'steal-qunit';
import plugin from './<%= name %>';

QUnit.module('<%= name %>');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the <%= name %> plugin');
});
