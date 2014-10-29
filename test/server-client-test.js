var tap = require('tap'),
    test = tap.test,
    resource = require('resource'),
    http = require('resource-http'),
    Mesh = require('../lib/Mesh'),
    server, 
    client;

test("create server", function (t) {

  server = new Mesh();

  server.listen({ port: 8888 }, function(err){
    t.equal(null, err);
    t.end();
  });

});

test("create client", function (t) {

  t.plan(3);
  client = new Mesh();

  client.emitter.on('hello', function(){
    console.log('!!hello called')
    t.ok(true);
  });
  
  client.connect({ port: 8888 }, function(err) {
    t.equal(null, err);
    t.ok(true);
    
    setTimeout(function(){
      server.emitter.emit('hello');
    }, 500);
  });

});

test("end tests", function (t) {
  process.exit(0);
});