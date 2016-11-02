define(['can/util/string', 'can/component', 'mustache!./<%= _dasherizedComponentName().replace(/-/, '_') %>'], function(can, Component, initView){

  return can.Component({
    tag : '<%= _dasherizedComponentName() %>',
    template : initView,
    scope : {

    }
  })

});