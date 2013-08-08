[![Stories in Ready](https://badge.waffle.io/retro/generator-canjs.png)](http://waffle.io/retro/generator-canjs)  
# generator-canjs

CanJS generator for Yeoman.

## Getting started
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator: `npm install -g generator-canjs`
- Run: `yo canjs`

## Usage

### Application scaffold

    $ yo canjs

This will create basic application scaffold. It will allow you to choose if you're using
[RequireJS](http://http://requirejs.org/) as a dependency management. This setting will
affect the `canjs:model` and the `canjs:control` generators.

### Model generator

    $ yo canjs:model path/to/model

This will create the model file. If you call this generator as `yo canjs:model models/user`
it will create `user.js` file in the `models` folder.

Model generator will offer to create fixtures for the generated model. For the `User` model fixtures
will be generated in the `fixtures/users.js` file.

### Control generator

    $ yo canjs:control path/to/control/folder

This generator is different than `canjs:model` as it doesn't create just one file. Instead,
it creates a folder which contains all files needed to run this control in isolation.

If you run it like:

    $ yo canjs:control controls/users

it will create following structure:

    controls/
      users/
        users.js // control file
        users.html // demo page
        init.mustache // example mustache view
        init.ejs // example ejs view

## View renderers 

This generator installs https://github.com/retro/require-can-renderers which allow loading of
`mustache` and `ejs` files via RequireJS. It allows you to have code that looks like:

    define('mustache!./init', function(initView){
      // initView is a renderer function and can be called as:
      initView()
    })

## Build

This generator comes with the Gruntfile.js which provides the `build` task. It will compile JavaScript
and view files to the `production.js` file.

It is a default task so it can be called as:

    $ grunt

Or as:

    $ grunt build

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
