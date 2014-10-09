var mesh = require('../../').mesh;
var resource = require('resource');
// var creature = require('./creature').creature;

require('colors')

mesh.connect({ port: 7777, name: "test-client" }, function(err){

  if (err) { 
    console.log('error connecting to mesh server. most likely the server is not running.', err);
    process.exit();
  }

  setInterval(function(){
    console.log('emitting creature::talk')
    mesh.emitter.emit('creature::talk', { text: "Hi!" });
  }, 2000);

});