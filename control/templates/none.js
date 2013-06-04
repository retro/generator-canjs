var <%= _.classify(_componentName()) %>Control = can.Control({
  defaults : {

  }
},{
  init : function(){
    this.element.append(can.view('init.mustache', {
      engine : 'Mustache'
    }));
    this.element.append(can.view('init.ejs', {
      engine : 'EJS'
    }));
  }
});