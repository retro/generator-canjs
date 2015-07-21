import QUnit from 'steal-qunit';
import F from 'funcunit';
import $ from 'jquery';
import stache from 'can/view/stache/';
import { ViewModel } from './<%= name %>';

F.attach(QUnit);

// ViewModel unit tests
QUnit.module('<%= module %> ViewModel');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the <%= tag %> component');
});

// Component functional unit tests
QUnit.module('<%= module %> Component');

const template = stache(`<<%= tag %>></<%= tag %>>`);

QUnit.test('Component works', function(){
  $('#qunit-fixture').html(template({}));
  F('<%= tag %>').exists('Component initialized');
  F('<%= tag %>').html('<p>This is the <%= tag %> component</p>',
    'Component has text');
});
