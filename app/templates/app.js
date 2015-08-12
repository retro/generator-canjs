import "can/route/";
import AppMap from "can-ssr/app-map";
import 'can/map/define';

const AppViewModel = AppMap.extend({
  define: {
    message: {
      value: 'Hello World!'
    },
    title: {
      value: '<%= name %>'
    }
  }
});

export default AppViewModel;
