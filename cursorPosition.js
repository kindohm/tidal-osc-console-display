module.exports = function(callback) {
  require('child_process').exec('./cursorposition.sh', function(error, stdout, stderr){
    callback(error, JSON.parse(stdout));
  });
}