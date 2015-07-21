import QUnit from 'steal-qunit';
import <%= className %> from './<%= name %>';

QUnit.module('models/<%= name %>');

QUnit.test('getList', function(){
  stop();
  <%= className %>.getList().then(function(items) {
    QUnit.equal(items.length, 5);
    QUnit.equal(items.attr('0.name'), '<%= name %> number 0');
    start();
  });
});
