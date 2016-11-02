requirejs(['can/util/library', 'can/control'], function(can){
  var App = can.Control({
    init : function(){
      this.element.html('Hello World!');
    }
  })

  new App('#content');
});