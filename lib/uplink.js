module['exports'] = function uplink (options, callback) {

  var mesh = require('../').mesh;

  var handler = function (data) {
    mesh.client.send(JSON.stringify({
      event: this.event,
      payload: data
    }));
  };

  mesh.meshEmitter.onAny(handler);

  //
  // Any mesh client events should be rebroadcasted locally,
  // but they should not be re-emitted
  //
  mesh.client.on('message', function(data){
    var msg = JSON.parse(data);
    mesh._emit(msg.event, msg.payload, false);
  })

  mesh.client.on('disconnect', function() {
    meshEmitter.removeListener(handler);
  });

  //
  // Send a friendly phone-home message
  // Feel free to comment this line out at any time
  //
  //mesh.emit('node::ohai', resource.system.info());
  mesh.emit('node::ohai', 'hello');

  //
  // Continue with information about the newly connected to node
  //
  callback(null, {
    id: options.host + ":" + options.port,
    port: options.port,
    host: options.host,
    status: "connected",
    lastSeen: new Date().toString(),
    role: "server"
  });

};