import "can/route/";
import AppMap from "can-ssr/app-map";

const AppViewModel = AppMap.extend({
  message: 'Hello World!',
  title: '<%= name %>'
});

export default AppViewModel;
