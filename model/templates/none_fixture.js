var <%= _.classify(_componentName(true)) %>Store = can.fixture.store(100, function(i){
  var id = i + 1; // Make ids 1 based instead of 0 based
  return {
    id   : id,
    name : '<%= _.titleize(_componentName(true)) %> ' + id
  }
});

can.fixture({
  'GET /<%= _.pluralize(_componentName(true)) %>'         :  <%= _.classify(_componentName(true)) %>Store.findAll,
  'GET /<%= _.pluralize(_componentName(true)) %>/{id}'    :  <%= _.classify(_componentName(true)) %>Store.findOne,
  'POST /<%= _.pluralize(_componentName(true)) %>'        :  <%= _.classify(_componentName(true)) %>Store.create,
  'PUT /<%= _.pluralize(_componentName(true)) %>/{id}'    :  <%= _.classify(_componentName(true)) %>Store.update,
  'DELETE /<%= _.pluralize(_componentName(true)) %>/{id}' :  <%= _.classify(_componentName(true)) %>Store.destroy
});