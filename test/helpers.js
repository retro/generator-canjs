var os = require('os');
var crypto = require('crypto');
var path = require('path');

// The number of times a regex appears in a string
exports.appearances = function(exp, str){
  exp = new RegExp(exp, 'g');
  var times = 0;

  while((exp.exec(str)) !== null) {
    times++;
  }

  return times;
};

exports.tmpdir = function(){
  return path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'));
};
