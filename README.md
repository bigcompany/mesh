# mesh

provides a distributed event emitter mesh

<img src="https://travis-ci.org/bigcompany/mesh.svg?branch=master"/>

## Features

 - Distributed WebSocket event emitter
 - Intelligent event broadcasting among mesh
 - Auto-detection of role as `server` or `client`
 - Powered by `engine.io`


## Examples

See: `./examples` folder

### Basic Mesh

This example can be run N times in order to create a mesh of event emitting nodes.

`myEvent` is added on each node and also emitted on a timer. 

Every node will then recieve `myEvent` from other nodes.

```js
mesh.start({ port: 8888 }, function (err) {

  if (err) {
    throw err;
  }

  mesh.emitter.on('myEvent', function(data){
    console.log('mesh ' + this.event + " - " + data.pid);
  });

  setInterval(function(){a
    mesh.emitter.emit('myEvent', { "pid": process.pid });
  }, 1000);

});
```

Explicit `server` / `client` can be created using `mesh.listen` and `mesh.connect`.

For more examples see: `./examples` folder

### Browser Usage

For browser examples see: `./examples/4_browser/` folder

### Frequent Concerns

**I can't get my nodes to receive custom events!**

Did you bind an event listener using `mesh.emitter.on`? Events **must** be bound in order to be seen on the mesh.

**How can I listen for events using `mesh.emitter.onAny`?**

By design, `mesh.emitter.onAny` will not receive remote events. This is in order to keep network traffic to a minimum.

**How are events broadcasted among the mesh?**

`mesh` uses a [star topography](http://en.wikipedia.org/wiki/Star_network). The first node is the server and all subsequent nodes are clients.

All nodes in the mesh are eligible for receiving events from any other node.

<img height="250" width="250" src="http://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/StarNetwork.svg/1200px-StarNetwork.svg.png"/>

 - Any events emitted on a `client` will be recieved on the `server`
   - Provided the `server` has a listener for that event
 - Any events emitted on the `server` will re-broadcast to all `clients`
   - Provided that `client` has a listener for that event
 - Any events recieved on the `server` will re-broadcast to all `clients`
   - Excluding the original `client` sender
   - Provided that `client` has a listener for that event

**How is network traffic kept low if all nodes are in communication?**

An event map of every node is kept and exchanged on connection with the mesh. Events are then only broadcasted to a node if that event name has been previously registered.

**Can I bind new live events after a connection is made to the mesh?**

Yes! Live events are fully supported. This also means you can interact with the mesh in real-time using a repl.

**Is it possible to get a remote callback for emitted mesh events?**

The mesh does not support remote callbacks. The overhead of safely enabling remote callbacks requires `V8::Persistent<Object>` and the use of `MakeWeak` method through `node-weak`. Since node core doesn't have access to WeakMaps yet it's somewhat cumbersome to use them.

Apart from these minor technical issues, using remote callbacks is not a great design choice for distributed applications. In the real world actors will crash and message confirmations may get lost ( even though the event was received and fired on the receiving node ). It is generally a better design choice to stick with an event emitter pattern with no built in confirmations. This same functionality of a remote callback can be achieved using two separate named events and a unique message identifier.



## Tests

```bash
npm test
```
