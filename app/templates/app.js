import "can/route/";
import AppMap from "can-ssr/app-map";

const AppState = AppMap.extend({
  message: 'Hello World!',
  title: '<%= name %>'
});

export default AppState;
