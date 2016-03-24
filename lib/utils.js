var fs = require('fs');

exports.addImport = function(filename, module, name) {
  if(fs.existsSync(filename)) {
    var content = fs.readFileSync(filename).toString();
    var statement = '\nimport \'' + module + '\';';

    if (name) {
      statement = '\nimport ' + name + ' from \'' + module + '\';';
    }

    // Also add if it is not already there
    if(content.indexOf(statement) === -1) {
      // Use filesystem directly because Yeoman would ask to overwrite the file
      fs.writeFileSync(filename, content + '\n' + statement);
    }
  }
};

// Gets a package.json or ends the asynchronous operation.
exports.getPkgOrBail = function(env, done){
    var pkgFile = env.destinationPath('package.json');
    var pkg = env.fs.readJSON(pkgFile, false);

    if(pkg === false) {
      var error = new Error('Expected to find a package.json file at ' + pkgFile +
                            ' but did not');
      done(error);
      return false;
    }
    return pkg;
};

exports.npmVersion = function(cb) {
  var cp = require('child_process');
  cp.exec('npm -v', readVersion)

  function readVersion(err, stdout, stderr) {
    if (err) {
      cb(err);
      return;
    }

    var semver = require('semver');

    cb(null, semver(stdout));
  }
}
