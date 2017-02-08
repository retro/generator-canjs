import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import loader from '@loader';

const algebra = set.Algebra(
  set.props.id('<%= idProp %>')
);

const <%= className %> = DefineMap.extend({
  seal: false
}, {
  '<%= idProp %>': '*'
});

<%= className %>.List = DefineList.extend({
  '*': <%= className %>
});

<%= className %>.connection = superMap({
  url: loader.serviceBaseURL + '<%= url %>',
  idProp: '<%= idProp %>',
  Map: <%= className %>,
  List: <%= className %>.List,
  name: '<%= name %>',
  algebra
});

<%= className %>.connection.algebra = algebra;

tag('<%= name %>-model', <%= className %>.connection);

export default <%= className %>;
