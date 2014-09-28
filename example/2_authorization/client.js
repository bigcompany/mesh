var mesh = require('../../').mesh;
var resource = require('resource');
var http = require('resource-http');

require('colors');

mesh.connect({ 
  port: 7777, 
  name: "test-client", 
  user: "marak", 
  password: "password"
}, function(err){

    if (err) { 
      console.log('error connecting to mesh server. most likely the server is not running.', err);
      process.exit();
    }

    setInterval(function(){
      mesh.emitter.emit('client-foo', { bar: "foo" });
    }, 2000);

    mesh.emitter.on("server-foo", function(data){
      console.log('got server-foo event'.green, data);
    });

    mesh.emitter.on("server-echo-client-foo", function(data){
      console.log('got server-echo-client-foo event'.green, data);
    });

});