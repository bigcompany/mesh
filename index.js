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
mesh.emitter = new EventEmitter({
  wildcard: true,
  delimiter: '::',
  maxListeners: 0,
  newListener: true
});

// Whenever a new listener is added to the mesh.emitter
// add that new event to the resource eventTable namedspaced under "mesh::*"
//
// Remark: mesh.emitter events are considered remote by default
// This means that these events will be available to remote sources unless,
// unless remote property is set to `false`
//
// This is special behavior which only applies to the mesh.emitter.
// All other resource event emitters will add events as NOT remote by default
// see: https://github.com/bigcompany/resource
//
//
mesh.emitter.on('newListener', function(ev){
  resource.eventTable["mesh::" + ev] = {
    remote: true
  };
  mesh.eventTable[ev] = {};
});

mesh.mode = "unknown";

//
// By default, keep autohealing of mesh disabled
//
mesh.autoheal = false;

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
mesh.method('start', require('./lib/start'));

exports.mesh = mesh;