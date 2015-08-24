import AppMap from "can-ssr/app-map";
import route from "can/route/";
import 'can/map/define/';

const AppViewModel = AppMap.extend({
  define: {
    message: {
      value: 'Hello World!',
      serialize: false
    },
    title: {
      value: '<%= name %>',
      serialize: false
    }
  }
});

export default AppViewModel;
