import fixture from 'can/util/fixture/';

const store = fixture.store(5, function(i){
  return {
    <%= idProp %>: i,
    name: "<%= name %> number "+i,
    ownerId: fixture.rand(10)
  };
});

fixture({
  'GET <%= url %>': store.findAll,
  'GET <%= url %>/{<%= idProp %>}': store.findOne,
  'POST <%= url %>': store.create,
  'PUT <%= url %>/{<%= idProp %>}': store.update,
  'DELETE <%= url %>/{<%= idProp %>}': store.destroy
});
