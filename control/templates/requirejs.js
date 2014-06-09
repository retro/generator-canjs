define(['can/util/string', 'mustache!./init', 'ejs!./init', 'can/control'], function(can, initMustache, initEjs){

  return can.Control.extend({
    defaults : {

    }
  },{
    init : function(){
      this.element.append(initMustache({
        engine : 'Mustache'
      }));
      this.element.append(initEjs({
        engine : 'EJS'
      }));
    }
  });

})