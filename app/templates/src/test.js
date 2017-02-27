import F from 'funcunit';
import QUnit from 'steal-qunit';

import '<%= name %>/models/test';

F.attach(QUnit);

QUnit.module('<%= name %> functional smoke test', {
  beforeEach() {
    F.open('./development.html');
  }
});

QUnit.test('<%= name %> main page shows up', function() {
  F('title').text('<%= name %>', 'Title is set');
});
