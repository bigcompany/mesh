var resource = require('resource'),
    http = require('resource-http'),
    mesh = require('../../');

require('colors');

mesh.listen({ port: 7777 }, function (err){

  if (err) { 
    console.log('error starting to mesh server.', err);
    process.exit();
  }
  
  setInterval(function(){
    mesh.emitter.emit('server-foo', 'i am server ' + process.pid);
  }, 5000);

  mesh.emitter.on('client-foo', function(data){
    console.log('got client foo event');
    mesh.emitter.emit('server-echo-client-foo', 'hello');
  })

  
  mesh.emitter.on('hello', function(data){
    console.log('hello', data)
  })
  


});
