can.Component.extend({
  tag : '<%= _dasherizedComponentName() %>',
  template : '<content>Hello {{hello}}!</content>',
  scope : {
    hello: '@'
  }
});