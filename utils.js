var fs = require('fs');

exports.addImport = function(filename, module, name) {
  if(fs.existsSync(filename)) {
    var content = fs.readFileSync(filename);

    if (name) {
      content += '\nimport ' + name + ' from \'' + module + '\';';
    } else {
      content += '\nimport \'' + module + '\';';
    }

    // Use filesystem directly because Yeoman would ask to overwrite the file
    fs.writeFileSync(filename, content);
  }
};
