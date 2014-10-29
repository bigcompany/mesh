var tap = require('tap'),
    test = tap.test,
    resource = require('resource'),
    http = require('resource-http'),
    Mesh = require('../lib/Mesh'),
    server, 
    client1,
    client2;

test("create server", function (t) {
  
  server = new Mesh();
  
  server.listen({ port: 8888 }, function(err){
    t.equal(null, err);
    t.end();
  });

});

test("create client 1", function (t) {

  client1 = new Mesh();

  client1.connect({ port: 8888 }, function(err){
    t.equal(null, err);
    t.end();
  });

});

test("create client 2", function (t) {

  client2 = new Mesh();

  client2.connect({ port: 8888 }, function(err){
    t.equal(null, err);
    t.end();
  });

});

test("add an event to client 1 emit that event from client 2", function (t) {

  client1.emitter.on('hello', function(){
    console.log('client- hello called')
    t.ok(true)
    t.end();
  });

  setTimeout(function(){
    client2.emitter.emit('hello', 'there');
  }, 100)

});


test("end tests", function (t) {
  process.exit(0);
});

