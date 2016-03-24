# generator-donejs

[![Build Status](https://travis-ci.org/donejs/generator-donejs.svg?branch=master)](https://travis-ci.org/donejs/generator-donejs)
[![npm version](https://badge.fury.io/js/generator-donejs.svg)](http://badge.fury.io/js/generator-donejs)
[![Coverage Status](https://coveralls.io/repos/github/donejs/generator-donejs/badge.svg?branch=master)](https://coveralls.io/github/donejs/generator-donejs?branch=master)

A Yeoman generator for your DoneJS application. Available generators are:

- `app` to create a new DoneJS application
- `plugin` to create a new DoneJS plugin
- `generator` to create a new DoneJS generator project

- `component` to create a CanJS component
- `supermodel` to create a can-connect connection
- `module` to generate a general purpose modlet

## Using generators

__Important:__ While this repository is a Yeoman generator it should only be used directly with the DoneJS cli instead of the `yo` command line.

With the CLI installed via

```
npm install donejs -g
```

The following commands are availbale. To initialize a new DoneJS related project:

- `donejs init [projectname]` create a new DoneJS application
- `donejs plugin [projectname]` create a new DoneJS plugin
- `donejs init --type generator [projectname]` create a new generator project

Within a DoneJS application or plugin:

- `donejs add component` to create a CanJS component
- `donejs add supermodel` to create a can-connect connection
- `donejs add module` to generate a general purpose modlet
