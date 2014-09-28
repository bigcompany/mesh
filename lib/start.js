module['exports'] = function start (options, callback) {

  var mesh = require('../index').mesh;
  
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    mesh.listen(options, function (err) {
      if (err && err.code === 'EADDRINUSE') {
        return mesh.connect(options, callback);
      }
      if (callback) {
        callback(null, options);
      }
    });
  
};