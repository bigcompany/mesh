var debug = require('debug')('resource::mesh')

module['exports'] = function listen (options, callback) {

  debug('Attempting to create new server node');

  var mesh = this,
      http = require('resource-http'),
      engine = require('engine.io');

  if (typeof http.app === 'object') {
    attach(http.app);
  }
  else {
    options.root = options.root || __dirname + "/public";
    //
    // Remark: resource-http autoport must be set to false or resource-mesh autonode funtionality will not work
    //
    options.autoport = false;
    http.listen(options, function (err, app) {
      if (err) {
        return callback(err);
      }
      debug('Node is going into server mode.');
      debug('Created websocket gateway at ' + options.host + ":" + options.port);
      mesh.mode = "server";
      attach(app);
    });
  }

  function attach(app) {
    //
    // Remark: mesh.server is the same as http.server
    //
    mesh.server = engine.attach(app.server);

    mesh.server.on('connection', function(socket){
      options.socket = socket;
      mesh.downlink(options, function(err, result){
        if (err) {
          throw err;
        }
      });
    });

    callback(null, mesh.server);
  }
  return mesh;
};