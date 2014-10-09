var spawn = require('child_process').spawn,
    tap = require('tap'),
    test = tap.test,
    resource = require('resource'),
    http = require('resource-http'),
    Mesh = require('../').Mesh,
    server, 
    client;

test("create server", function (t) {
  
  server = new Mesh();
  
  server.emitter.on('client-foo', function (data){
    console.log(data)
    server.emitter.emit('server-echo-client-foo', data);
  });

  setInterval(function(){
    server.emitter.emit('server-foo', { bar: "foo" });
  }, 2000);
  
  
  server.listen({ port: 8888 }, function(err){
    t.equal(null, err);
    t.end();
  });

});

test("create client", function (t) {

  client = new Mesh();
  client.connect({ port: 8888 }, function(err){
    t.equal(null, err);
    t.end();
  });

  setInterval(function(){
    client.emitter.emit('client-foo', { bar: "foo" });
  }, 2000);

  client.emitter.on("server-foo", function(data){
    console.log('got server-foo event'.green, data);
  })
  
  client.emitter.on("server-echo-client-foo", function(data){
    console.log('got server-echo-client-foo event'.green, data);
  })

});

test("emit and receive events", function (t) {

  t.plan(2);

  client.emitter.once('server-echo-client-foo', function (data) {
    t.equal(data.bar, 'foo', 'received server echo');
  });

  client.emitter.once('server-foo', function (data) {
    t.equal(data.bar, 'foo', 'received server message');
  });

});

test("end tests", function (t) {
  process.exit(0);
});