var mesh = require('../').mesh;

mesh.connect({ port: 7777, name: "test-client" }, function(err){
  if (err) { throw err; }
  setInterval(function(){
    mesh.emit('client-foo', { bar: "foo" });
  }, 2000);

  mesh.onAny(function(data){
    console.log(this.event, data);
  })
});