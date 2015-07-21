import fixture from 'can/util/fixture/';

const store = fixture.store(5, function(i){
  return {
    id: i,
    name: "<%= name %> number "+i,
    ownerId: fixture.rand(10)
  };
});

fixture({
  'GET <%= url %>': store.findAll,
  'GET <%= url %>/{id}': store.findOne,
  'POST <%= url %>': store.create,
  'PUT <%= url %>/{id}': store.update,
  'DELETE <%= url %>/{id}': store.destroy
});
