import QUnit from 'steal-qunit';
import plugin from './my-plugin';

QUnit.module('my-plugin');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the my-plugin plugin');
});
