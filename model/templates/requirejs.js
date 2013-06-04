define(['can/util/string', 'can/model'], function(can){

  return can.Model({

    findAll : 'GET /<%= _.pluralize(_componentName()) %>',
    findOne : 'GET /<%= _.pluralize(_componentName()) %>/{id}',
    create  : 'POST /<%= _.pluralize(_componentName()) %>',
    update  : 'PUT /<%= _.pluralize(_componentName()) %>/{id}',
    destroy : 'DELETE /<%= _.pluralize(_componentName()) %>/{id}'

  }, {

  });

})