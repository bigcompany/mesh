var resource = require('resource'),
    http = require('resource-http'),
    mesh = require('../').mesh;

mesh.listen({ port: 7777 }, function (err){

  if (err) {
    throw err;
  }

  mesh.onAny(function(data){
    mesh.emit('server-echo::' + this.event, data);
  });

  setInterval(function(){
    mesh.emit('server-foo', { bar: "foo" });
  }, 2000);

  mesh.onAny(function(data){
    console.log(this.event, data)
  });

});