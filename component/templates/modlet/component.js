import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './<%= name %>.less';
import template from './<%= name %>.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the <%= tag %> component'
  }
});

export default Component.extend({
  tag: '<%= tag %>',
  ViewModel: ViewModel,
  template
});
