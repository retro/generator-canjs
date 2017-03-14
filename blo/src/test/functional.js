import F from 'funcunit';
import QUnit from 'steal-qunit';

F.attach(QUnit);

QUnit.module('blo functional smoke test', {
  beforeEach() {
    F.open('../development.html');
  }
});

QUnit.test('blo main page shows up', function() {
  F('title').text('blo', 'Title is set');
});
