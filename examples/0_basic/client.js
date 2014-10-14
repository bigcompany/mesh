var mesh = require('../../');
var resource = require('resource');
var creature = resource.define('creature');

require('colors')
/*
creature.method('talk', function(options, cb){
  console.log('creature talked', options.text.green)
  cb(null, options.text);
});
*/

mesh.connect({ port: 7777, name: "test-client" }, function(err){

  if (err) { 
    console.log('error connecting to mesh server. most likely the server is not running.', err);
    process.exit();
  }

  setInterval(function(){
    mesh.emitter.emit('client-foo');
  }, 2000);

  mesh.emitter.on("server-foo", function(data){
    console.log('got server-foo event'.green, data);
  })
  
  mesh.emitter.on("server-echo-client-foo", function(data){
    console.log('got server-echo-client-foo event'.green, data);
  })

});
