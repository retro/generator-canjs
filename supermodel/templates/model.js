import can from 'can';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';

export const <%= className %> = can.Map.extend({
  define: {}
});

<%= className %>.List = can.List.extend({
  Map: <%= className %>
}, {});

export const <%= name %>Connection = superMap({
  url: '<%= url %>',
  idProp: '<%= idProp %>',
  Map: <%= className %>,
  List: <%= className %>.List,
  name: '<%= name %>'
});

tag('<%= name %>-model', <%= name %>Connection);

export default <%= className %>;
