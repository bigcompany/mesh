module['exports'] = function connect (options, callback) {

  var mesh = this,
  client = require('engine.io-client');

  mesh.client = new client.Socket({ host: options.host, port: options.port });
  mesh.client.on('error', function (err) {
    return callback(err);
  });

  mesh.client.on('open', function(socket){
    mesh.mode = "client";
    mesh.uplink(options, callback);
  });

  return mesh;
};