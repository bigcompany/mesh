var resource = require('resource'),
    http = require('resource-http'),
    mesh = require('../../index');

require('colors');

mesh.start({ port: 7777 }, function (err){

  if (err) {
    throw err;
  }

  mesh.emitter.on('customEvent', function(data){
    console.log(process.pid + ' - mesh '.yellow + this.event + " - " + data.pid);
  });
  
  setInterval(function(){
    mesh.emitter.emit('customEvent', { "pid": process.pid });
  }, 1000);

});