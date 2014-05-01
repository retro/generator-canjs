define(['can/util/string', 'can/component'], function(can, Component){

  return can.Component({
    tag : '<%= _dasherizedComponentName() %>',
    template : '<content>Hello {{hello}}!</content>',
    scope : {

    }
  })

});