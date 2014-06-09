define(['can/util/string', 'can/model'], function(can){

  return can.Model.extend({

    findAll : 'GET /<%= _.pluralize(_componentName(true)) %>',
    findOne : 'GET /<%= _.pluralize(_componentName(true)) %>/{id}',
    create  : 'POST /<%= _.pluralize(_componentName(true)) %>',
    update  : 'PUT /<%= _.pluralize(_componentName(true)) %>/{id}',
    destroy : 'DELETE /<%= _.pluralize(_componentName(true)) %>/{id}'

  }, {

  });

})