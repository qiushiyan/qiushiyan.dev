---
title: Managing state in Cloudflare Worker with Durable Objects
slug: intro-durable-object
date: '2024-09-06'
description: |
  A powerful infrastructure for building stateful, realtime and collaborative applications.
tags:
- Web
components:
- code-switcher
- do-counter-example
headings:
- title: What are Durable Objects and why they are needed
  slug: what-are-durable-objects-and-why-they-are-needed
  depth: 2
- title: Configure durable objects
  slug: configure-durable-objects
  depth: 2
- title: Communication between workers and durable objects
  slug: communication-between-workers-and-durable-objects
  depth: 2
- title: Persist state with the `storage` API
  slug: persist-state-with-the-storage-api
  depth: 2
- title: Build a counter service with hono
  slug: build-a-counter-service-with-hono
  depth: 2
- title: Other notes
  slug: other-notes
  depth: 2
---

## What are Durable Objects and why they are needed {#what-are-durable-objects-and-why-they-are-needed}

Cloudflare workers are one of the most impactful serverless solutions.
Each worker is replicated over the Cloudflare global network in hundreds
of cities worldwide, also called the **edge**. When a user makes a
request to the worker, a worker instance will be spawned close to the
user’s geographic location to serve the request with minimal latency.

<img src="https://workers.cloudflare.com/resources/illustrations/global-network-dark-theme.svg" alt="Cloudflare network where each circle represents an edge location in which workers can be spawned">

This works great until you need to coordinate between clients. Edge
deployments requests are spread across multiple workers and it will be
hard to share and manage state. If you are building a collaborative
editor, you want every edit User A makes is reflected instantly on User
B’s screen. One obvious solution is to store keystrokes in a database
and have all clients constantly pulling from it to keep the them in
sync. This will at best, have poor performances. Moreover, we will have
consistency problems with database transactions from different users
fighting each other and fails constantly.

It boils down to one problem: both workers and databases are not
designed ensure realtime consistency. This is where Durable Objects (DO)
come into play.

In contrast to workers, DO can act as a single source of truth across
clients and ensure strong consistency with the following features:

- **Uniqueness**: durable objects are literally “objects” as they are
  instances of a JavaScript class. They are uniquely identified by an
  ID, you call *js`MY_DO_CLASS.get(id)`* to spawn an object and it
  exists in only one location in the world. All workers will talk to the
  same DO so long as they are using the same ID.

- **Persistence**: Do can manage states as persistent disk storage. All
  workers can send messages to it, mutates the state and get fast,
  consistent results. When an object becomes idle, it will be garbage
  collected but the persistent state will be preserved and restored when
  the same ID is used again.

## Configure durable objects {#configure-durable-objects}

If you have used other Cloudflare products such as **KV** or **D1**, you
will be used to adding bindings using the `wrangler` cli, e.g.,

``` bash
wrangler create d1 <name>
```

However, with durable objects, we need to manually add entries to the
`wrangler.toml` configuration file, e.g.

<code-switcher>

``` toml
#| filename: wrangler.toml
name = "durable-object-starter"
main = "src/index.ts"


[[durable_objects.bindings]]
name = "MY_DURABLE_OBJECT"
class_name = "MyDurableObject"

[[migrations]]
tag = "v1"
new_classes = ["MyDurableObject"]
```

``` typescript
#| filename: src/durable-object.ts
export class MyDurableObject {
    // DO implementation
    async fetch(request: Request, env: Env) {
        return new Response("Hello World");
    }
}
```

``` typescript
#| filename: src/index.ts
export default {
    async fetch(request, env) {
        let id = env.MY_DURABLE_OBJECT.newUniqueId();
        let obj = env.MY_DURABLE_OBJECT.get(id);
        return obj.fetch(request);
    }
}

// !callout[/durable-object/] make sure you export the DO class from the worker entry file :right
export * from "./durable-object";
```

</code-switcher>

Let’s break down the code:

<my-steps>

#### Add the binding

We configure the DO binding in `wrangler.toml`. The
`durable_objects.bindings.name` field will be used by the worker to
refer to the durable object in `env`, and
`durable_objects.bindings.class_name` will be the name of a class you
implement the durable object behavior. With
`class_name = MyDurableObject`, you must export a `MyDurableObject`
class from the entry point of your worker.

The `[[migrations]]` section is relevant we need to add or remove DO in
production. We won’t need it in this example but it’s a best practice to
include it.

#### Define DO

We define the DO class `MyDurableObject` in `src/durable-object.ts`, in
this example it only have one method `fetch`. It’s also common to see
this class defined and exported directly from `src/index.ts`.

#### Access DO in the worker

Inside the worker entry file `src/index.ts`, `env.MY_DURABLE_OBJECT`
works like a key-value namespace, to actually use the `MyDurableObject`
class, you create instances. To get an instance of the durable object,
you call `env.MY_DURABLE_OBJECT.get(id)` where id is a unique identifier
for the instance. Here, we are creating a new unique ID on the fly with
`newUniqueId()`.

</my-steps>

In practice, you will likely want to generate the ID based on a string
that is meaningful to your application. `MY_DURABLE_OBJECT.idFromName`
works like a hash function that always returns the same id given the
same string as input. If you want to create a durable object on a
per-user basis, you will probably call `idFromName()` on the user’s IP
address. If you are building a chat application with many rooms, you
could call `idFromName` on the room’s name.

``` typescript
#| caption: Create ip-scoped durable object instances
const ip = request.headers.get("CF-Connecting-IP");
const id = env.MY_DURABLE_OBJECT.idFromName(ip);
const obj = env.MY_DURABLE_OBJECT.get(id)
```

## Communication between workers and durable objects {#communication-between-workers-and-durable-objects}

DO are designed to operate within a worker instead of being a public
interface for http clients. In our starter example, our DO defines a
`fetch` method that returns a `Response` object, and our worker is
simply a proxy that creates a new DO instance and forwards the request
to it.

``` typescript
#| caption: worker forwards request to durable object
export default {
  async fetch(request, env) {
    let id = env.MY_DURABLE_OBJECT.newUniqueId();
    let obj = env.MY_DURABLE_OBJECT.get(id);
    return obj.fetch(request);
  },
};
```

Handling http requests is a common pattern for DO. The flow is:

- the worker takes a request and computes the ID of the DO instance that
  should handle the request

- the worker creates or gets the instance and calls its `fetch` method

- the DO instance takes the request, does something with it, and returns
  a response

- the worker gets the response and returns it to the client

This way, you can think of durable objects as a kind of “unique inner
worker” that are called by other outer workers.

It’s also possible to define non-fetch methods: they become RPC methods
that workers and other durable objects can call.

<code-switcher>

``` typescript
#| filename: src/counter.ts
import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject {
  private value: number;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.value = 0
  }

  async increment(amount = 1) {
    this.value += amount;
    return this.value;
  }
}
```

``` typescript
#| filename: src/index.ts
export default {
  async fetch(request, env) {
    let url = new URL(request.url);
    let name = url.searchParams.get("name");
    let id = env.COUNTERS.idFromName(name);
    let response = await durableObjectStub.increment();
    return new Response(`Counter incremented to ${response}`);
  }
}
```

</code-switcher>

In the example above, worker calls the `increment` RPC method on the DO,
which modifies its internal state and returns the new value. The worker
wraps the value in a response.

<my-callout>

RPC (Remote Procedure Call) is a standard communication protocol for
Cloudflare Workers and is not unique to durable objects. See
[docs](https://developers.cloudflare.com/workers/runtime-apis/rpc/) for
more information.

</my-callout>

## Persist state with the `storage` API {#persist-state-with-the-storage-api}

In the RPC example above, we are using the property `value` to store the
counter value. This is not ideal if we want the value to be persisted.
After a period of inactivity, the DO will be garbage collected and the
value will be lost. Although you can get the same object with
*js`MY_DURABLE_OBJECT.get(id)`*, the constructor method will be called
again and `value` will be reset to 0.

Durable Objects gain access to a persistent storage via
*js`this.ctx.storage`*. This is a key-value store that is scoped to the
DO instance. It provides interfaces such as `get`, `put`, `delete`, and
`list`, and each operation is implicitly wrapped in a transaction.

Let’s refactor our counter example to use the `storage` API.

<code-switcher>

``` typescript
#| filename: src/counter.ts
import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject {
  async increment(amount = 1) {
    let value: number = (await this.ctx.storage.get("value")) || 0;
    value += amount;
    await this.ctx.storage.put("value", value);
    return value;
  }
}
```

``` typescript
#| filename: src/index.ts
export default {
  async fetch(request, env) {
    let url = new URL(request.url);
    let name = url.searchParams.get("name");

    if (!name) {
      return new Response(
        "Select a Durable Object to contact by using" +
          " the `name` URL query string parameter, for example, ?name=A"
      );
    }

    let id = env.COUNTERS.idFromName(name);
    let stub = env.COUNTERS.get(id);

    let count = null;
    switch (url.pathname) {
      case "/increment":
        count = await stub.increment();
        break;
      default:
        return new Response("Not found", { status: 404 });
    }

    return new Response(`Durable Object '${name}' count: ${count}`);
  }
}
```

</code-switcher>

## Build a counter service with hono {#build-a-counter-service-with-hono}

Let’s enhance our counter example by turning it into a full-fledged API
service. We will use [hono](https://hono.dev/) to scaffold routes for
our worker and call the DO for storage. hono is a trending web framework
that is fully compatible with the Edge platform. A worker can be
scaffolded with hono using the following command:

``` bash
pnpm create cloudflare --framework=hono
```

After the project is created, go to `src/index.ts` and we can see the
following code:

``` typescript
import { Hono } from "hono";
const app = new Hono();

app.get("/", (c) => c.text("Hello world, this is Hono!!"));

export default app;
```

If you have used express before, this looks very similar. `app` is
simply an object with a `fetch` method that routes the request the a
handler, it’s just that we are not writing `fetch` directly.
`app.get("/", handler)` calls the handler when a GET request is made to
`/`.

Next, we will define the `Counter` DO.

<code-switcher>

``` toml
#| filename: wrangler.toml
[[durable_objects.bindings]]
name = "COUNTER"
class_name = "Counter"

[[migrations]]
tag = "v1"
new_classes = ["Counter"]
```

``` typescript
#| filename: src/counter.ts
import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject {
    async increment(amount = 1) {
        let value = (await this.ctx.storage.get<number>("value")) || 0;
        value += amount;
        await this.ctx.storage.put("value", value);
        return value;
    }

    async decrement(amount = 1) {
        let value = (await this.ctx.storage.get<number>("value")) || 0;
        value -= amount;
        await this.ctx.storage.put("value", value);
        return value;
    }

    async getCounterValue() {
        const value = (await this.ctx.storage.get<number>("value")) || 0;
        return value;
    }

}
```

</code-switcher>

Most of the code is self-explanatory, we’ve enhanced the `Counter` DO
with RPC methods to decrement and get the counter value.

The remaining step is to add routes to the worker and call the
appropriate DO methods. `/<name>/increment` and `/<name>/decrement` will
be the endpoints to increment and decrement the counter respectively, we
will use `<name>` to derive the durable object ID so each counter is
isolated from others. And don’t forget to re-export the `Counter` class.

``` typescript
#| filename: src/index.ts
// !callout[/CloudflareBindings/] Annotate the env object
const app = new Hono<{ Bindings: CloudflareBindings }>();

function getCounter(c: Context) {
    const id = c.env.COUNTER.idFromName(c.req.param("name"));
    const obj = c.env.COUNTER.get(id);
    return obj;
}

app.get("/:name/value", async (c) => {
    const obj = getCounter(c);
    const value = await obj.getCounterValue();
    return c.json({ value });
});

app.post("/:name/increment", async (c) => {
    const obj = getCounter(c);
    const value = await obj.increment();
    return c.json({ value });
});

app.post("/:name/decrement", async (c) => {
    const obj = getCounter(c);
    const value = await obj.decrement();
    return c.json({ value });
});

export * from "./counter";
```

<div class="column-margin">

What is shown here is a simplified version. The actual service adds a
rate limiter to prevent excessive requests from the same IP address, the
rate limiter is also a DO. Browse full code on
[Github](https://github.com/qiushiyan/durable-object-counter).

</div>

We can access bindings via `c.env` in the hono app. To get
autocompletion we are also adding a generic type
`{ Bindings: CloudflareBindings }`. `CloudflareBindings` is a generated
type produced by running `pnpm cf-typegen`.

The worker and DO can now be readily deployed using `pnpm deploy`. I
have set up a simple UI to test the endpoints. Each card below
represents a DO with name `card-1` and `card-2`. Clicking on the plus or
minus button will send requests to `/card-1/increment` and
`/card-2/decrement` respectively.

<do-counter-example> \</do-counter-example

## Other notes {#other-notes}

- Durable objects support the Workers Runtime Websocket API and can
  become a WebSocket server (see
  https://developers.cloudflare.com/durable-objects/api/websockets/). I
  will write a separate post later to build a chatroom application with
  DO + WebSocket.

- Another important DO feature is the `alarm` API. This is to schedule a
  wake-up call for the DO at a specific time. See
  https://developers.cloudflare.com/durable-objects/api/alarms/ for more
  information.
