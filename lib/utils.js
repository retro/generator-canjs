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
