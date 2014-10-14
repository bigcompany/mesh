var resource = require('resource'),
    mesh = require('../../');

//
// Remark: See: ./lib/server/public folder for index.html file and mesh.js browser bundle
//

//
// The mesh has started, visit the WebSocket Gateway at: http://localhost:8888
//
mesh.listen({ port: 8888 }, function (err){

  if (err) { 
    console.log('error starting to mesh server.', err);
    process.exit();
  }
  
  mesh.emitter.on('hello', function (data){
    console.log('Hello ', data);
  });
  
  setInterval(function(){
    mesh.emitter.emit('hello', 'i am server ' + process.pid);
  }, 5000);

});