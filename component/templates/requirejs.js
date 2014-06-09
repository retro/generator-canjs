define(['can/util/string', 'can/component'], function(can, Component){

  return can.Component.extend({
    tag : '<%= _dasherizedComponentName() %>',
    template : '<content>Hello {{hello}}!</content>',
    scope : {
      hello: '@'
    }
  })

});