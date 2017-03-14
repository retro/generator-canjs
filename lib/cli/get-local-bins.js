var fs = require('fs');

module.exports = function(binPath) {
  var result = [];

  if (fs.existsSync(binPath)) {
    result = fs.readdirSync(binPath).map(function(name) {
      return name;
    });
  }

  return result;
};
