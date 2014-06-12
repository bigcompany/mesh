var resource = require('resource'),
    EventEmitter = require('eventemitter2').EventEmitter2,
    mesh = resource.define('mesh');

mesh.schema.description = "provides a distributed p2p event emitter mesh";

mesh.property("port", {
  "type": "number",
  "default": 7777,
  "description": "the port of the node"
});

mesh.property("host", {
  "type": "string",
  "default": "0.0.0.0",
  "description": "the host of the node"
});

//
// Any events emitted on this eventEmitter will be broadcast to the mesh
// by listeners added by the uplink and downlink methods
//
mesh.meshEmitter = new EventEmitter({
  wildcard: true,
  delimiter: '::',
  maxListeners: 0
});

//
// When emitting on the mesh resource, also emit to the meshEmitter so that
// the event is broadcast to other nodes. The standard resource emit is called
// internally by the mesh resource in order to emit events without
// broadcasting.
//
mesh.emit = function (event, payload) {

  //
  // Emit the event over the mesh
  //
  return mesh.meshEmitter.emit(event, payload);

  //
  // Don't do the regular emit ( since its being used to broadcast to the remote mesh scope, not the local mesh scope)
  //
  // return emit(event, payload);
};

mesh.method('connect', require('./lib/connect'), {
  "input": {
    "port": mesh.schema.properties['port'],
    "host": mesh.schema.properties['host']
  }
});

mesh.method('listen', require('./lib/listen'), {
  "input": {
    "port": mesh.schema.properties['port'],
    "host": mesh.schema.properties['host']
  }
});

mesh.method('downlink', require('./lib/downlink'));
mesh.method('uplink', require('./lib/uplink'));

exports.mesh = mesh;