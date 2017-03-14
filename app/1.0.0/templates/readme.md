# <%= name %>

Welcome to the <%= name %> application!

## Getting started

To install all dependencies, (e.g. after cloning it from a Git repository) run

```
npm install
```

## Running tests

Tests can be run with

```
npm test
```



# Additional tools
```
npm install generator-canjs -g # CanJS SDK
npm install steal-server -g # Steal Packager and Server
npm install jsdocs -g # Documentation Creation
```


#NOTE: Integrate into steal-server

## Development mode // Should be replaced

Development mode can be started with

```
npm develop
// or
done-serve --develop --port 8080
//TODO: steal develop
```

## Build and production mode Should be Replaced has not much todo with this

To build the application into a production bundle run

```
npm build
// or
node build.js
//TODO: steal build
```

In Unix environment the production application can be started like this:

```
NODE_ENV=production npm start
```
