var resource = require('resource'),
    http = require('resource-http'),
    mesh = require('../../').mesh;

require('colors');


var creature = require('./creature').creature;

// sets creature resource to be available for remote method calls from the mesh
// creature.remote = true;


mesh.listen({ port: 7777 }, function (err){

  if (err) { 
    console.log('error starting to mesh server.', err);
    process.exit();
  }
  
  // since creature resource has been set to remote,
  /// all creature events are available to the mesh

});
