---
title: Building a WebSockets Server with Cloudflare Durable Objects
slug: durable-object-chat
date: '2024-09-15'
description: |
  An example of how to use Cloudflare Durable Objects to implement a real-time chat application.
tags:
- Cloudflare
components:
- code-switcher
- iframe
headings:
- title: WebSockets Basics
  slug: websockets-basics
  depth: 2
- title: WebSockets Server on Durable Objects
  slug: websockets-durable-objects
  depth: 2
- title: WebSockets Hibernation
  slug: websockets-hibernation
  depth: 2
- title: Displaying Previous Messages
  slug: displaying-previous-messages
  depth: 2
---

In my previous post of [Introduction to Durable
Objects](https://qiushiyan.dev/posts/intro-durable-object) , I covered
the basics of using the `storage` API to persist state in Cloudflare
Workers. In this post, we’ll explore another key API provided by Durable
Objects: the [WebSocket
API](https://developers.cloudflare.com/durable-objects/api/websockets/),
which enables us to easily create real-time, collaborative applications.

## WebSockets Basics {#websockets-basics}

Let’s first recap the general idea of WebSockets outside of Cloudflare.
WebSockets are a standard protocol that maintains bidirectional,
long-lasting connections between clients and servers. A server can send
and receive messages from a client and vice versa. A simple WebSocket in
node.js looks like this:

``` js
#| filename: server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('This is a WebSocket server\n');
});

server.on('upgrade', (req, socket, head) => {
  // !mark(1:5)
  // verify the upgrade header
  if (req.headers['upgrade'] !== 'websocket') {
    socket.destroy();
    return;
  }

  // !collapse(1:8) collapsed
  const acceptKey = req.headers['sec-websocket-key'];
  const hash = generateAcceptValue(acceptKey);
  const responseHeaders = [
    'HTTP/1.1 101 Web Socket Protocol Handshake',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${hash}`
  ];

  // establish the WebSocket connection
  socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

  // receive and send messages
  socket.on('data', (buffer) => {
    const message = buffer.toString('utf8');
    console.log('Received:', message);
    const response = `Server says: ${message}`;
    socket.write(encodeMessage(response));
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

// !collapse(1:6) collapsed
function generateAcceptValue(acceptKey) {
  return require('crypto')
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
}

// !collapse(1:11) collapsed
function encodeMessage(message) {
  const messageBuffer = Buffer.from(message);
  const messageLength = messageBuffer.length;

  const buffer = Buffer.alloc(messageLength + 2);
  buffer[0] = 0x81; // FIN + opcode (text)
  buffer[1] = messageLength; // No masking, length <= 125

  messageBuffer.copy(buffer, 2);
  return buffer;
}

server.listen(8080, () => {});
```

Note that we need do a bit of housekeeping when establishing the
WebSocket connection (highlighted in the code). We verify that we
receive the correct request headers and respond with the appropriate
headers. While the implementation details aren’t crucial here, it’s
important to note that this health check is necessary for WebSocket
connections and will be needed in the Workers runtime as well.

Once the connection is established, we can send messages to the client
using `socket.write()`, and react to incoming messages using the
`socket.on('data')` callback.

A client can connect to the server using the `WebSocket` constructor:

``` js
#| filename: client.js
const socket = new WebSocket('ws://localhost:8080');
socket.onmessage = (event) => {
    console.log("Received message from server:", event.data);
};

socket.onopen = () => {
    socket.send('Hello from client');
};
```

WebSockets enables real-time multiplayer apps because the server can
send messages to all connected clients through the long-lived
connection. In the chat app we are building, we want to broadcast
message from one client to all other connected users. This is only a
couple of lines for the server:

``` js
#| filename: server.js

// !mark(1:1)
const clients = []

server.on('upgrade', (req, socket, head) => {
  // code to upgrade header
  // ...

  // !mark(1:9)
  clients.push(socket);

  socket.on('data', (buffer) => {
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.write(buffer);
      }
    });
  });

  // handle client disconnecting
  socket.on('end', () => {
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});
```

The key here is that we keep track of all connections in an array. When
a message arrives, we loop through the array and send the message to
each connected client.

## WebSockets Server on Durable Objects {#websockets-durable-objects}

While the Edge Platform on which Durable Objects run offers a subset of
Node.js APIs, the process is quite similar. We use DO instances to model
a chat room or a game match. Workers send requests to the DO instance
(the server), which then broadcasts messages to all other connected
clients.

Let’s explore how we can migrate the Node.js example to the Edge using
Durable Objects and Workers. Our goal is to build a chat app with
multiple rooms. Users can send messages that are broadcast to all other
users in the same room, with messages persisted and isolated at the room
level. Browse the finished version
[here](https://durable-object-chat.qiushiyan.dev/) and code on
[Github](https://github.com/qiushiyan/durable-object-chat).

![screenshot of the finished chat
app](https://github.com/qiushiyan/durable-object-chat/blob/main/image.png?raw=true)

Let’s begin by scaffolding an empty worker project using Hono:

``` bash
pnpm create cloudflare --framework=hono
```

Update or create the following files in the `src` directory:

<code-switcher>

``` ts
#| filename: src/index.ts
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/rooms/:name/ws", async (c) => {
    // !mark(1:4)
    const upgrade = c.req.header("Upgrade");
  // !callout[/upgrade/] health check
    if (!upgrade || upgrade !== "websocket") {
        return c.text("Upgrade header must be websocket", 426);
    }

    const name = c.req.param("name");
    const id = c.env.ROOM.idFromName(name);
    const stub = c.env.ROOM.get(id);
    return stub.fetch(c.req.raw);
});

export * from "./room"
```

``` ts
#| filename: src/room.ts
import { DurableObject } from "cloudflare:workers";

export class Room extends DurableObject<Env> {
  constructor(private state: DurableObjectState) {}

  async fetch(request: Request) {
      // !mark(1:4)
    const websocketPair = new WebSocketPair();
    const [client, server] = Object.values(websocketPair);

    // !callout[/acceptWebSocket/] accept connection
    this.ctx.acceptWebSocket(server);
    await this.handleSession(server);

    return new Response(null, {
        status: 101,
        // !callout[/client/] respond with client socket :right
        webSocket: client,
    });
  }

  // !callout[/webSocketMessage/] equivalent to `socket.on('data')`
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
  }

  // !callout[/webSocketClose/] equivalent to `socket.on('close')`
  async webSocketClose(ws: WebSocket, code?: number, reason?: string) {

  }
  // storing connections
  async handleSession(socket: WebSocket) {
  }


}
```

``` toml
#| filename: wrangler.toml
name = "chat-api"
compatibility_date = "2024-09-11"
compatibility_flags = ["nodejs_compat"]

[[durable_objects.bindings]]
name = "ROOM"
class_name = "Room"

[[migrations]]
tag = "v1"
new_classes = ["Room"]
```

</code-switcher>

Let’s break this down:

<my-steps>

#### Derive DO from Route

*js`app.get("/rooms/:name/ws", handler)`* defines a handler that will be
called when a GET request is sent to `/rooms/<name>/ws`, where `<name>`
dynamic route parameter. We derive the DO instance ID from the name and
pass on the request.

#### Accept Connection

`WebSocketPair()` returns an object containing two sockets:

``` ts
{
    0: socket,
    1: socket,
}
```

where the first is the client socket and second the server socket. We
can then call `this.ctx.acceptWebSocket(server)` to upgrade the
connection and also returns the client socket in the response. This is
equivalent to returning the convoluted response header in the Node.js
example.

Note that `WebSocketPair` is a Cloudflare Workers runtime only API, and
is not available in standard Node.js.

#### Handle Message Events

`webSocketMessage` and `webSocketClose` are conventional methods for
handling message events, and will be automatically invoked when a
message from client is received, or the client disconnects.

</my-steps>

## WebSockets Hibernation {#websockets-hibernation}

Despite some syntax differences, what we’ve built so far is essentially
the same as the Node.js example. However, we should consider an
optimization known as **WebSocket Hibernation**.

According to the
[docs](https://developers.cloudflare.com/durable-objects/api/websockets/),
this is a feature that allows a DO to be removed from memory (it
“hibernates”) when it’s inactive (e.g. not in the process of executing
`webSocketMessage()`) while keeping its WebSockets connected. This
reduces duration charges that would otherwise be incurred during periods
of inactivity.

Even better, `ctx.acceptWebSocket()` already sets up hibernation for us.
If you establish a connection this way, the DO instance will be
automatically put into hibernation when it’s inactive.

It seems we can move forward with our chat app without any extra work to
accommodate hibernation. Let’s continue by working on our session
handling logic. Here’s the flow of how a user joins a chat room and
sends a message:

1.  User enters a room and requests a WebSockets connection via
    `new WebSocket()` to our server.

2.  When the connection is established, we request that the user
    immediately send us a message of type `"join"` with their username,
    which is used to identify the user in the chat room. After the
    server finished processing the join event, it will broadcast to all
    other users in the room that a new user has joined.

3.  The user can now broadcast messages to other users in the room.

Based on these requirements, it is clear that we need to store all live
connections. We can model this with a `Map`, where the key is the
established socket, and the value is an object containing the registered
username.

``` ts
type Session = {
  name?: string;
};

export class Room extends DurableObject<Env> {
  private storage: DurableObjectStorage;

  // !callout[/sessions/] store connected sessions
  private sessions: Map<WebSocket, Session>;

  constructor(ctx: DurableObjectState, env: Env) {
    this.sessions = new Map();
  }

  async fetch(request: Request) {
    // accept socket ...

    await this.handleSession(server);

    // return response with client socket ...
  }

  async handleSession(ws: WebSocket) {
    // !callout[/newSession/] register a new session whose username is unset
    const newSession: Session = { name: undefined };
    this.sessions.set(ws, newSession);
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const session = this.sessions.get(ws);

    if (!session) {
      ws.close(1011, "Session not found");
      return;
    }

    const payload = JSON.parse(message as string) as any;
    // !callout[/join/] handle join message :right
    if (payload.type === "join") {
      session.name = payload.name;
      this.broadcast(`${session.name} joined the room | ${payload.timestamp}`);
      // !callout[/message/] handle general chat message :right
    } else if (payload.type === "message") {
      this.broadcast(
        `${session.name}: ${payload.message} | ${payload.timestamp}`
      );
    }
  }

  async webSocketClose(ws: WebSocket, code?: number, reason?: string) {
    this.sessions.delete(ws);
    ws.close(code || 1000, reason || "durable object closed websocket");
  }

  // !callout[/broadcast/] broadcast message to all connected users :right
  private broadcast(message: any) {
    this.sessions.forEach((session, ws) => {
      if (session.name) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}
```

<div class="column-margin">

We assume that incoming messages are JSON strings with a specific
structure. For joining events, the structure is:

``` json
{
  "type": "join",
  "name": "username",
  "timestamp": 1715728800
}
```

For chat events:

``` json
{
  "type": "message",
  "message": "hello",
  "timestamp": 1715728800
}
```

</div>

The code is becoming a bit lengthy, but the core logic is simply
mutating `this.sessions` in reaction to user join and leave events. When
a chat message is received, we loop through `this.sessions` and send it
to other clients.

However, there’s one caveat: any instance properties are reset when the
instance wakes up from hibernation. This means that `this.sessions` will
be become an empty map and we lose track of all usernames. We also can’t
use the storage API to store usernames, as they need to be tied to their
respective sockets, which are not serializable. Luckily there are other
APIs that can help use restore the state:

- `ws.serializeAttachment(value)` keeps an arbitrary value in memory to
  survive hibernation.

- `ws.deserializeAttachment()` retrieves the last serialized value.

- `this.ctx.getWebSockets()` returns all WebSocket connections. This is
  not affected by hibernation and will always return the latest list of
  server sockets.

With these tools, we can serialize the session data in advance, and
prepare for hibernation by always reconstructing `this.sessions` in the
constructor.

``` ts

constructor(ctx: DurableObjectState, env: Env) {
    // ...

    this.sessions = new Map();
    this.ctx.blockConcurrencyWhile(async () => {
        this.ctx.getWebSockets().forEach((websocket) => {
            this.sessions.set(websocket, {
                // !callout[/deserializeAttachment/] restore session data
                ...websocket.deserializeAttachment(),
            });
        });
    });
    // ...
}

async handleSession(ws: WebSocket) {
    const newSession: Session = { name: undefined };

    // it's not necessary to serialize here because session data doesn't contain anything yet, but your app could be more complex and do have some state that needs to be saved.
    ws.serializeAttachment({
      ...session,
    });
    this.sessions.set(ws, newSession);
}

async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // ...

    if (payload.type === "join") {
        session.name = payload.name;
        // !callout[/serializeAttachment/] serialize session data to prepare for hibernation
        ws.serializeAttachment({
            ...ws.deserializeAttachment(),
            name: payload.name,
        });
    }

  // ...
}
```

The first time the DO is created, nothing is different in the
constructor because we haven’t serialized anything yet. But when a user
joins the chat, we put the updated session data in memory to survive
hibernation. When the DO wakes up, the constructor is called it will be
populate all sessions with the latest data.

## Displaying Previous Messages {#displaying-previous-messages}

A final requirement is that when a user connects, they should see a list
of all previous messages in the room. How we store the messages can
vary. It could be an external database accessed via a RESTful API. But
since we are using durable objects already, we can simply use the
`storage` API.

One gotcha is that we want to only display historical messages when the
user is registered with a username. For this we will add another field
to `Session` called `blockedMessages`.

``` ts
type Session = {
  name?: string;
  blockedMessages: string[];
};
```

Think `blockedMessages` as a queue that will be populated upon
connection, we will dequeue the messages when the user is registered.

Let’s refactor the relevant handlers to the following:

``` ts
constructor(ctx: DurableObjectState, env: Env) {
    // ...

    this.ctx.blockConcurrencyWhile(async () => {
        this.ctx.getWebSockets().forEach((websocket) => {
            this.sessions.set(websocket, {
                ...websocket.deserializeAttachment(),
                // !mark(1:1)
                blockedMessages: [],
            });
        });
    });

    // ...
}

async handleSession(server: WebSocket, ip: string) {
    const newSession: Session = {
        name: undefined,
        blockedMessages: [],
    };

    server.serializeAttachment({
        ...session
    });

    this.sessions.set(server, session);

    // !callout[/list/] retrieve previous messages :right
    const historyMessages = await this.storage.list({
        reverse: true,
        limit: 100,
    });
    const backlog = [...historyMessages.values()];
    backlog.reverse();
    backlog.forEach((message) => {
        // !callout[/push/] enqueue previous messages :right
        session.blockedMessages.push(message);
    });
}

async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // ...

    const payload = JSON.parse(message as string) as any;
    if (payload.type === "join") {
        session.name = payload.name;
        ws.serializeAttachment({
            ...ws.deserializeAttachment(),
            name: payload.name,
        });

        // !callout[/blockedMessages/] dequeue previous messages when username is received
        session.blockedMessages.forEach((message) => {
            ws.send(JSON.stringify(message));
        });
        session.blockedMessages = [];

        this.broadcast(`${session.name} joined the room | ${payload.timestamp}`);

        return;
    }


    if (payload.type === "chat") {
        if (!session.name) {
            ws.close(1011, "Session without name");
            return;
        }

        this.broadcast(
            `${session.name}: ${payload.message} | ${payload.timestamp}`
        );
        const key = new Date(payload.timestamp).toISOString();
        // !callout[/storage/] store chat message
        await this.storage.put(key, JSON.stringify(data));
    }
}
```

<div class="column-margin">

You may also want to set up an [alarm
handler](https://developers.cloudflare.com/durable-objects/api/alarms/)
to clean up historical messages periodically.

</div>

This wraps up our chat application. The complete code is available on
[Github](https://github.com/qiushiyan/durable-object-chat/blob/main/api/src/room.ts)
with two additional features: a rate limiter and enhanced message types.
A demo is available at https://durable-object-chat.qiushiyan.dev/.
