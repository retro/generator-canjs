import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import loader from '@loader';

export const <%= className %> = DefineMap.extend({
  seal: false
}, {
  '<%= idProp %>': '*'
});

<%= className %>.List = DefineList.extend({
  '*': <%= className %>
});

export const <%= name %>Connection = superMap({
  url: loader.serviceBaseURL + '<%= url %>',
  idProp: '<%= idProp %>',
  Map: <%= className %>,
  List: <%= className %>.List,
  name: '<%= name %>'
});

tag('<%= name %>-model', <%= name %>Connection);

export default <%= className %>;
