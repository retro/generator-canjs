# <%= name %>

[![Build Status](https://travis-ci.org/<%= githubAccount %>/<%= name %>.png?branch=master)](https://travis-ci.org/<%= githubAccount %>/<%= name %>)

<%= description %>

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from '<%= name %>';
```

### CommonJS use

Use `require` to load `<%= name %>` and everything else
needed to create a template that uses `<%= name %>`:

```js
var plugin = require("<%= name %>");
```

## AMD use

Configure the `can` and `jquery` paths and the `<%= name %>` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: '<%= name %>',
		    	location: 'node_modules/<%= name %>/dist/amd',
		    	main: 'lib/<%= name %>'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/<%= name %>/dist/global/<%= name %>.js'></script>
```
