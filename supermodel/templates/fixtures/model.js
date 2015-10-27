import fixture from 'can-fixture';

const store = fixture.store([{
  <%= idProp %>: 0,
  description: 'First item'
}, {
  <%= idProp %>: 1,
  description: 'Second item'
}]);

fixture({
  'GET <%= url %>': store.findAll,
  'GET <%= url %>/{<%= idProp %>}': store.findOne,
  'POST <%= url %>': store.create,
  'PUT <%= url %>/{<%= idProp %>}': store.update,
  'DELETE <%= url %>/{<%= idProp %>}': store.destroy
});

export default store;
