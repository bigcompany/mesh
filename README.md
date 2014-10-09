# mesh

provides a distributed event emitter mesh

<img src="https://travis-ci.org/bigcompany/resource-mesh.svg?branch=master"/>

## Features

 - Creates distributed WebSocket event emitter over multiple nodes
 - Events are intelligently rebroadcasted among entire network of nodes
 - Can Auto-detect role as server or client
 - WebSocket transport powered by `engine.io`


## Examples

See: `./examples` folder

### Basic Mesh

This example can be run N times to create a mesh of event emitting nodes.

The `myEvent` listener is added on each node and also emitted on a timer. Each node will recieve `myEvent` from other nodes.

```js
mesh.start({ port: 8888 }, function (err) {

  if (err) {
    throw err;
  }

  // registers local myEvent as listener on the mesh
  mesh.emitter.on('myEvent', function(data){
    console.log('mesh '.yellow + this.event + " - " + data.pid);
  });

  // emits to remote myEvent listeners
  setInterval(function(){a
    mesh.emitter.emit('myEvent', { "pid": process.pid });
  }, 1000);

});
```

Explicit server / clients can be created using `mesh.listen` and `mesh.connect`.

For more examples see: `./examples` folder


### Remote Callbacks

The mesh does not support remote callbacks by default. The overhead of safely enabling remote callbacks requires V8::Persistent<Object> and the use of MakeWeak method through `node-weak`. Since node core doesn't have access to WeakMaps yet it's somewhat cumbersome to use them.

Apart from these minor technical issues, using remote callbacks is not a great design choice for distributed applications. In the real world actors will crash and message confirmations may get lost ( even though the event was received and fired on the receiving node ). It is generally a better design choice to stick with an event emitter pattern with no built in confirmations. This same functionality of a remote callback can be achieved using two separate named events and a unique message identifier.

## Tests

```bash
npm test
```