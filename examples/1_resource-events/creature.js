var resource = require('resource');

var creature = resource.define('creature');
// TODO: make remote a getter / setter that updates event table
creature.remote = true;

// TODO: add granular controls for remote methods
// so that entire resource isn't exposed
creature.method('talk', function(options, callback){
  console.log('talking', options)
  callback(null, options.text);
});

module['exports'].creature = creature;