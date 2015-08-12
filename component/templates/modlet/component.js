import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './<%= name %>.less!';
import template from './<%= name %>.stache!';

export const ViewModel = Map.extend({
  define: {
    message: {
      value: 'This is the <%= tag %> component'
    }
  }
});

export default Component.extend({
  tag: '<%= tag %>',
  viewModel: ViewModel,
  template
});