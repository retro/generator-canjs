import QUnit from 'steal-qunit';
import <%= className %> from './<%= name %>';

QUnit.module('models/<%= name %>');

QUnit.test('getList', function(){
  stop();
  <%= className %>.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
