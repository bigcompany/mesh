module['exports'] = function uplink (options, callback) {
  var mesh = this;
  var resource = require('resource');
  var handler = function (data, broadcast) {
    // don't rebroadcast messages we sent
    if(typeof resource.eventTable[this.event] === "object") {
      return;
    }
    data = data || {};
    if (data.id !== mesh.client.id) {
    }
    if(broadcast === false){
      //console.log('not sending to mesh', this.event, data);
      return;
    }
    mesh.client.send(JSON.stringify({
      event: this.event,
      payload: data,
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

  // Remark: mesh.emitter.on events are not going to be bound until the next tick
  // This process.nextTick seems to be okay. A possible issue might be messages incoming on mesh.client.on('message'),
  // before the handshake is complete. This would cause messages to be ignored / dropped until the handshake is complete
  process.nextTick(function(){
    mesh.client.send(JSON.stringify({
      event: 'handshake',
      payload: {
        eventTable: resource.eventTable
      },
      headers: {
        "auth": {
          user: options.user,
          password: options.password
        }
      }
    }));
  });

  //
  // Any mesh client events should be rebroadcasted locally,
  // but they should not be re-emitted
  //
  mesh.client.on('message', function(data){
    var msg = JSON.parse(data);
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