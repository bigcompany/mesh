module['exports'] = function connect (options, callback) {

  var mesh = require('../').mesh,
  client = require('engine.io-client');

  mesh.client = new client.Socket({ host: options.host, port: options.port });
  mesh.client.on('error', function (err) {
    return callback(err);
  });

  mesh.client.on('open', function(){
    mesh.uplink(options, callback);
  });

};