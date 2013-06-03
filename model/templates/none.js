var <%= _.classify(_modelName()) %>Model = can.Model({

  findAll : 'GET /<%= _.pluralize(_modelName()) %>',
  findOne : 'GET /<%= _.pluralize(_modelName()) %>/{id}',
  create  : 'POST /<%= _.pluralize(_modelName()) %>',
  update  : 'PUT /<%= _.pluralize(_modelName()) %>/{id}',
  destroy : 'DELETE /<%= _.pluralize(_modelName()) %>/{id}'

}, {

});