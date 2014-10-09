var resource = require('resource'),
    http = require('resource-http'),
    mesh = require('../../');

require('colors');

mesh.listen({ port: 7777 }, function (err){

  if (err) { 
    console.log('error starting to mesh server.', err);
    process.exit();
  }



});
