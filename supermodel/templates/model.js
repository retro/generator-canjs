import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';

export const <%= className %> = DefineMap.extend({
  "*": "string"
});

<%= className %>.List = DefineList.extend({
  "*": <%= className %>
});

export const <%= name %>Connection = superMap({
  url: '<%= url %>',
  idProp: '<%= idProp %>',
  Map: <%= className %>,
  List: <%= className %>.List,
  name: '<%= name %>'
});

tag('<%= name %>-model', <%= name %>Connection);

export default <%= className %>;
