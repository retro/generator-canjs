define(['can/util/string', 'can/util/fixture'], function(can){

  var store = can.fixture.store(100, function(i){
    var id = i + 1; // Make ids 1 based instead of 0 based
    return {
      id   : id,
      name : '<%= _.titleize(_componentName(true)) %> ' + id
    }
  });

  can.fixture({
    'GET /<%= _.pluralize(_componentName(true)) %>'         : store.findAll,
    'GET /<%= _.pluralize(_componentName(true)) %>/{id}'    : store.findOne,
    'POST /<%= _.pluralize(_componentName(true)) %>'        : store.create,
    'PUT /<%= _.pluralize(_componentName(true)) %>/{id}'    : store.update,
    'DELETE /<%= _.pluralize(_componentName(true)) %>/{id}' : store.destroy
  });

  return store;

})