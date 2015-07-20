import QUnit from 'steal-qunit';
import { ViewModel } from './<%= name %>';

QUnit.module('<%= module %> ViewModel');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the <%= tag %> component');
});
