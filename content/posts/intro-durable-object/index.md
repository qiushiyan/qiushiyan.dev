---
title: An introduction to Cloudflare Durable Objects
slug: intro-durable-object
date: "2024-09-06"
description: |
  A powerful infrastructure for building stateful, realtime and collaborative applications.
tags:
  - Web
draft: true
headings:
  - depth: 2
    title: The mental model
    slug: the-mental-model
  - depth: 2
    title: Persist state with the storage API
    slug: persist-state-with-the-storage-api
  - depth: 2
    title: The alarm API
    slug: the-alarm-api
---

## The mental model

## Persist state with the `storage` API

Although you can set arbitrary properties on a durable object similar to how you would do so on a regular JavaScript object, e.g., _js`this.userAgent = request.headers.get("User-Agent")`_, they are not meant for persistence. This is because a durable object will be garbage collected during a period of inactivity, and the next time you call _js`MY_DURABLE_OBJECT.get(id)`_ a new instance will be returned.

<code-switcher>

```typescript
#| filename: counter.ts
import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject {
  async getCounterValue() {
    let value = (await this.ctx.storage.get("value")) || 0;
    return value;
  }

  async increment(amount = 1) {
    let value: number = (await this.ctx.storage.get("value")) || 0;
    value += amount;
    await this.ctx.storage.put("value", value);
    return value;
  }

  async decrement(amount = 1) {
    let value: number = (await this.ctx.storage.get("value")) || 0;
    value -= amount;
    await this.ctx.storage.put("value", value);
    return value;
  }
}
```

```typescript
#| filename: index.ts
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
      case "/decrement":
        count = await stub.decrement();
        break;
      case "/":
        // Serves the current value.
        count = await stub.getCounterValue();
        break;
      default:
        return new Response("Not found", { status: 404 });
    }

    return new Response(`Durable Object '${name}' count: ${count}`);
  }
}
```

```toml
#| filename: wrangler.toml
name = "my-counter"

[[durable_objects.bindings]]
name = "COUNTERS"
class_name = "Counter"

[[migrations]]
tag = "v1"
new_classes = ["Counter"]
```

</code-switcher>

## The `alarm` API
