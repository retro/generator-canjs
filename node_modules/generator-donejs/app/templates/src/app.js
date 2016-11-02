import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';

const AppViewModel = DefineMap.extend({
  route: "string",
  message: {
    value: 'Hello World!',
    serialize: false
  },
  title: {
    value: '<%= name %>',
    serialize: false
  }
});

export default AppViewModel;
