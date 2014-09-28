var resource = require('resource'),
    http = require('resource-http'),
    mesh = require('../../').mesh;

    require('colors');

//
// Generic authorize method
// This can replaced with any custom auth function
// 
function authorize (user, password, callback) {
  var result = false;
  if (user === "marak" && password === "password") {
    result = true;
  }
  callback(null, result);
}

mesh.listen({ 
  port: 7777,
  auth: authorize
}, function (err){

  if (err) {
    throw err;
  }

  mesh.emitter.on('client-foo', function (data){
    mesh.emitter.emit('server-echo-client-foo', data);
  });

  setInterval(function(){
    console.log('emitting server-foo message to mesh.emitter'.blue)
    mesh.emitter.emit('server-foo', { bar: "foo" });
  }, 2000);

});

