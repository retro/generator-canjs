var <%= _.classify(_componentName(true)) %>Model = can.Model({

  findAll : 'GET /<%= _.pluralize(_componentName(true)) %>',
  findOne : 'GET /<%= _.pluralize(_componentName(true)) %>/{id}',
  create  : 'POST /<%= _.pluralize(_componentName(true)) %>',
  update  : 'PUT /<%= _.pluralize(_componentName(true)) %>/{id}',
  destroy : 'DELETE /<%= _.pluralize(_componentName(true)) %>/{id}'

}, {

});