var EventEmitter = require('eventemitter2').EventEmitter2;

var resource = require('resource');

// class for constructing new Mesh instances
function Mesh (opts) {
  
  var self = this;
  
  opts = opts || {};
  
  self.port = opts.port || 8888;
  self.host = opts.host || "localhost";
  
  self.mode = "unknown";
  self.autoheal = false;
  
  self.eventTable = {};
  //
  // Any events emitted on this eventEmitter will be broadcast to the mesh
  // by listeners added by the uplink and downlink methods
  //
  self.emitter = new EventEmitter({
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
  self.emitter.on('newListener', function(ev){
    resource.eventTable["mesh::" + ev] = {
      remote: true
    };
    self.eventTable[ev] = {};
  });

};

Mesh.prototype.connect = require('../client/connect');
Mesh.prototype.uplink = require('../client/uplink');
Mesh.prototype.start = require('../client/connect');

module['exports'] = Mesh;