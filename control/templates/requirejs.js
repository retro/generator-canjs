define(['can/util/string', 'can/control' , 'mustache!init', 'ejs!init'], function(can, Control, initMustache, initEjs){

  return can.Control({
    defaults : {

    }
  },{
    init : function(){
      this.element.append(initMustache());
      this.element.append(initEjs());
    }
  });

})