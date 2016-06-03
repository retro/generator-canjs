import QUnit from 'steal-qunit';
import { ViewModel } from './<%= name %>';

// ViewModel unit tests
QUnit.module('<%= module %>');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the <%= tag %> component');
});
