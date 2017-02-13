import fixture from 'can-fixture';
import <%= className %> from '../<%= name %>';

const store = fixture.store([{
  <%= idProp %>: 0,
  description: 'First item'
}, {
  <%= idProp %>: 1,
  description: 'Second item'
}], <%= className %>.connection.algebra);

fixture('<%= url %>/{<%= idProp %>}', store);

export default store;
