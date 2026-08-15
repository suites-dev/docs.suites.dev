---
title: "Matchers and Effect Builders"
description: "Reference for toObserveEffects, toMatchCatalog, effect builders, required and forbidden contracts, patterns, and count constraints."
sidebar_position: 4
keywords:
  [
    "toObserveEffects",
    "toMatchCatalog",
    "effect builders",
    "required forbidden effects",
    "Playwright matcher",
  ]
---

Import Playwright matchers through the Blackbox runner and effect vocabulary through the core entry point:

```ts
import { atLeast, between, effect, exactly, glob } from "@suites/blackbox/core";
import { expect } from "./testbed.js";
```

## `toObserveEffects()`

All forms normalize to `{ requires, forbids }`.

```ts
await expect(capture).toObserveEffects(effect.redis("SET"));

await expect(capture).toObserveEffects([
  effect.postgres("INSERT", { table: "subscriptions" }),
  effect.forbid(effect.redis("DEL")),
]);

await expect(capture).toObserveEffects({
  requires: [effect.sqs("SendMessage", { queue: "subscription-orders" })],
  forbids: [effect.http("POST", { path: "/v1/refunds" })],
});
```

The matcher fails when a required shape is missing, a forbidden shape matches, or a count constraint is violated. Every call feeds effect-shape coverage, including failures.

## `toMatchCatalog()`

```ts
await expect(capture).toMatchCatalog();
```

The matcher reads the active flow ID, loads `features/<flow>.effects.yaml`, and evaluates the same contract kernel as `toObserveEffects()`.

A direct `toMatchCatalog()` assertion fails when its selected contract is missing. A facade run can still create observed effects and report the effect layer as `not-configured` before policy exists. `blackbox verify` writes evidence and reports, not accepted behavior files.

Matchers are not required for `blackbox verify` to evaluate an accepted YAML contract. Use them when the Playwright test should fail at the assertion site or when policy belongs inline in test source. The facade and both matchers use the same effect-evaluation kernel.

## `toMatchEffectsSnapshot()`

Use the snapshot matcher when a raw normalized effect snapshot is useful for diagnostics or migration. Prefer effect contracts for reviewed required and forbidden behavior because a contract expresses intent instead of preserving every observed detail.

## Effect Builders

| Builder                     | Options                                      |
| --------------------------- | -------------------------------------------- |
| `effect.redis(op, opts)`    | `key`, `ttl`, `count`                        |
| `effect.postgres(op, opts)` | `key` or `table`, `schema`, `count`          |
| `effect.http(op, opts)`     | `key` or `path`, `host`, `status`, `count`   |
| `effect.sqs(op, opts)`      | `key` or `queue`, `count`                    |
| `effect.s3(op, opts)`       | `bucket`, `key`, `count`                     |
| `effect.rabbitmq(op, opts)` | `key`, `exchange`, `routingKey`, `count`     |
| `effect.forbid(shape)`      | Wraps a shape for single/array matcher input |

HTTP and HTTPS both normalize to the `http` boundary.

## String Patterns

```ts
equals("user:alice:tier");
glob("user:*:tier");
regex("^user:[a-z]+:tier$");
```

Bare strings use catalog glob semantics. Use `equals()` when `*` or path matching must not be interpreted as a pattern.

## Numeric and Count Constraints

```ts
eq(1);
lt(5);
lte(5);
gt(0);
gte(1);
between(60, 3600);

exactly(1);
atLeast(1);
atMost(3);
never();
```

Bare numbers mean exact equality.

For concepts and examples, read [Effects, Contracts, and Coverage](/docs/blackbox/concepts/effects-and-catalogs).
