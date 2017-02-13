import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import loader from '@loader';

const <%= className %> = DefineMap.extend({
  seal: false
}, {
  '<%= idProp %>': '*'
});

const algebra = new set.Algebra(
  set.props.id('<%= idProp %>')
);

<%= className %>.List = DefineList.extend({
  '*': <%= className %>
});

<%= className %>.connection = superMap({
  url: loader.serviceBaseURL + '<%= url %>',
  Map: <%= className %>,
  List: <%= className %>.List,
  name: '<%= name %>',
  algebra
});

export default <%= className %>;
