module['exports'] = function uplink (options, callback) {
  var mesh = this;
  var resource = require('resource');
  var handler = function (data, broadcast) {
    data = data || {};

    //
    // This event was recieved from a remote source, do not rebroadcast it
    //
    if (broadcast === false){
      return;
    }

    mesh.client.send(JSON.stringify({
      event: this.event,
      payload: data,
      eventTable: resource.eventTable,
      headers: {
        "auth": {
          user: options.user,
          password: options.password
        }
      }
    }), function(data){
      // console.log('client send callback', data)
    });
  };

  mesh.emitter.onAny(handler);

  // Emit a handshake after connection to communicate the client's eventTable
  // Remark: It is possible that the server might try to send an event to a client which
  // should be eligible to recieve an event but has not yet broadcasted its eventTable with the handshake.
  // This will cause the client to not recieve the event.
  //
  mesh.emitter.emit('handshake');

  //
  // Any mesh client events should be rebroadcasted locally,
  // but they should not be re-emitted
  //
  mesh.client.on('message', function(data){
    var msg = JSON.parse(data);

    //
    // Emit the event on resource scope
    //
    resource.emit(msg.event, msg.payload);

    //
    // Emit event on mesh.emitter scope with rebroadcast set to false
    // This will trigger the event for locale listeners, but not broadcast the event back to the mes
    //
    mesh.emitter.emit(msg.event, msg.payload, false)
  })

  mesh.client.on('error', function(err) {
    console.log('error with client', err)
    // mesh.emitter.removeListener(handler);
  });

  mesh.client.on('close', function() {
    
    // TODO: add autoheal logic
    //  server has been lost, attempt to heal the network
    //  we could add reconnect logic here so client attempts to reconnect a few times before assuming total server failure
    if(mesh.autoheal && mesh.rank === 0) {
      mesh.listen(options, function(){});
    } else {
      mesh.connect(options, function(){})
    }
    // mesh.emitter.removeListener(handler);
  });

  //
  // Continue with information about the newly connected to node
  //
  callback(null, {
    id: options.host + ":" + options.port,
    port: options.port,
    host: options.host,
    status: "connected",
    lastSeen: new Date().toString(),
    role: "server",
    eventTable: resource.eventTable
  });

};