var resource = require('resource'),
    http = require('resource-http'),
    mesh = require('../../').mesh;

require('colors');

mesh.listen({ port: 7777 }, function (err){

  if (err) { 
    console.log('error starting to mesh server.', err);
    process.exit();
  }

  mesh.emitter.on('client-foo', function (data){
    mesh.emitter.emit('server-echo-client-foo', data);
  });

  setInterval(function(){
    mesh.emitter.emit('server-foo', { bar: "foo" });
  }, 2000);


});
