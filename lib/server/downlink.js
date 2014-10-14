var debug = require('debug')('resource::mesh')

module['exports'] = function downlink (options, callback) {

  debug('new connection recieved', options.socket.id);

  var http = require('resource-http'),
      resource = require('resource');

      var mesh = this;

      mesh.clients = mesh.clients || {};
      mesh.clientCount = Object.keys(mesh.clients);

      var socket = options.socket;
      var handler = function (data, broadcast) {
        if(typeof broadcast === "undefined") {
          broadcast = true;
        }
        var self = this,
            parts = self.event.split('::'),
            ev;
        if (parts.length === 2) {
          ev = self.event
        } else {
          ev = "mesh::" + self.event
        }
        function broadcastToClients() {
          for (var client in mesh.server.clients) {
            if (mesh.server.clients[client].id === data.id) {
              continue;
            }
            if (broadcast !== false) {
                if (mesh.server.clients
                    && mesh.server.clients[client]
                    && mesh.server.clients[client].eventTable
                    && typeof mesh.server.clients[client].eventTable[ev] === "object"
                    && mesh.server.clients[client].eventTable[ev].remote !== false) {
                  if(socket.id === client) {
                    mesh.server.clients[client].send(JSON.stringify({
                      event: self.event,
                      payload: data
                    }));
                  } else {
                  }
              } else {
                // console.log('refusing to send event ' + ev + ' to client, it is not registered', broadcast)
              }
            }
          }
        }
        broadcastToClients();
    };

    mesh.emitter.onAny(handler);

    socket.on('message', function(data){
      var msg = JSON.parse(data);
      msg.payload.id = socket.id;
      
      // TODO: better handling of handshake event. copy cached client headers back into message,
      // so that headers like username and password don't have to be sent in every message for authorization
      if (msg.event === "handshake") {
        mesh.server.clients[socket.id].eventTable = msg.payload.eventTable;
      }

      // Check if there is an authorize method provided in server options
      // If so, don't broadcast any recieved events if authorization fails
      if (options.auth) {
        options.auth(msg.headers.auth.user, msg.headers.auth.password, function(err, success){
          if(success) {
            _emit();
          } else {
            // do nothing, bad auth
          }
        })
      } else {
        _emit();
      }

      //
      // All incoming messages from the mesh should be broadcasted as local event
      // unless the event is not registered in the local eventTable and set to `remote`
      //
      function _emit () {
        // Determine if broadcasted message is enabled as remote resource method locally
        var ev = msg.event;
        
        var parts = ev.split('::'),
            ev;

        if (parts.length === 2) {
          ev = ev;
        } else {
          ev = "mesh::" + ev;
        }

        if (typeof resource.eventTable[ev] === "object"
            && resource.eventTable[ev].remote !== false) {
          // if so, emit it
          var parts = msg.event.split("::");
          if (parts.length == 2) {
            // if the message looks like `creature::talk`, emit it to the resource library emitter
            resource.emit(msg.event, msg.payload);
          } else {
            // if the message is like `talk` emit it to the mesh resource emitter
            mesh.emitter.emit(msg.event, msg.payload);
          }
        } else {
        }
        mesh.emitter.emit(msg.event, msg.payload);
      }

    });

    socket.on('disconnect', function(data){
      // TODO: do something with this event
      // mesh.emitter.removeListener(handler);
    });

    //
    // Continue with information about the client
    //
    callback(null, {
      id: socket.id,
      lastSeen: new Date().toString(),
      role: "client",
      status: "connected",
      eventTable: resource.eventTable
    });

};