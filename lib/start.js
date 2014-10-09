var debug = require('debug')('resource::mesh');

module['exports'] = function start (options, callback) {

  var mesh = this;
  
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    mesh.listen(options, function (err) {
      if (err && err.code === 'EADDRINUSE') {
        debug('Service already listening on ' + options.port);
        debug('Attempting to connect instead');
        return mesh.connect(options, callback);
      }
      if (callback) {
        callback(null, options);
      }
    });

    return mesh;
};