module['exports'] = function downlink (socket, callback) {

  var http = require('resource-http'),
      mesh = require('../').mesh;

    var handler = function (data) {
      socket.send(JSON.stringify({
        event: this.event,
        payload: data
      }));
    };

    mesh.meshEmitter.onAny(handler);

    socket.on('message', function(data){
      var msg = JSON.parse(data);
      msg.payload.id = socket.id;
      //
      // TODO: figure out where engine.io is storing remoteAddress on socket
      //
      //msg.payload.host = socket.remoteAddress.host;
      //msg.payload.port = socket.remoteAddress.port;

      //
      // Any mesh client events should be rebroadcasted locally,
      // but they should not be re-emitted
      //
      mesh._emit(msg.event, msg.payload, false);
    });

    socket.on('disconnect', function(data){
      meshEmitter.removeListener(handler);
    });

    //
    // Continue with information about the socket
    //
    callback(null, {
      id: socket.id,
      lastSeen: new Date().toString(),
      role: "client",
      status: "connected"
    });

};