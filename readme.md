# generator-canjs

[![Build Status](https://travis-ci.org/retro/generator-canjs.svg?branch=master)](https://travis-ci.org/retro/generator-canjs)
[![npm version](https://badge.fury.io/js/generator-canjs.svg)](http://badge.fury.io/js/generator-canjs)
[![Coverage Status](https://coveralls.io/repos/github/retro/generator-canjs/badge.svg?branch=master)](https://coveralls.io/github/retro/generator-canjs?branch=master)

## Changelog
- Moved in donejs binary
- Moved in donejs-cli
- Stripped out done-* dependencies for projects as this gets extra option to add that as this is only ssr related stuff.
- Moved donejs-cli dependencies that was a cli parm befor into the generator


A Yeoman generator for your CanJS application. Available generators are:

- `app` to create a new CanJS application
- `plugin` to create a new CanJS plugin
- `generator` to create a new CanJS generator project

- `component` to create a CanJS component
- `supermodel` to create a can-connect connection
- `module` to generate a general purpose modlet

## Using generators

__Important:__ While this repository is a Yeoman generator it should only be used directly with the CanJS cli instead of the `yo` command line.

With the CLI installed via

```
npm install generator-canjs -g
```

The following commands are availbale. To initialize a new CanJS related project:

- `yo canjs init [projectname]` create a new CanJS application
- `yo canjs plugin [projectname]` create a new CanJS plugin
- `yo canjs init --type generator [projectname]` create a new generator project

Within a CanJS application or plugin:

- `yo canjs add component` to create a CanJS component
- `yo canjs add supermodel` to create a can-connect connection
- `yo canjs add module` to generate a general purpose modlet
