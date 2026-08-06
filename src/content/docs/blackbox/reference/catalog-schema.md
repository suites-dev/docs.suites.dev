---
title: "Catalog Schema"
description: "Effect catalog v0.1 envelope, flow entries, required and forbidden shapes, matching patterns, and write behavior."
sidebar_position: 7
keywords:
  [
    "effect catalog schema",
    "effect catalog v0.1",
    "Blackbox YAML",
    "requires forbids",
  ]
---

The live effect catalog format is a per-test-file YAML sidecar.

```text
tests/checkout.system.test.ts
tests/__effects__/checkout.system.effects.yaml
```

## Complete Example

```yaml
specVersion: "0.1"
entries:
  subscribe-flow:
    requires:
      - { boundary: redis, op: GET, service: bff }
      - { boundary: postgres, op: INSERT, key: subscriptions, service: bff }
      - {
          boundary: sqs,
          op: SendMessage,
          key: subscription-orders,
          service: order-service,
        }
    forbids:
      - { boundary: http, op: POST, key: /v1/refunds, service: bff }

  subscribe-unknown-user:
    requires:
      - { boundary: postgres, op: SELECT, key: users, service: bff }
    forbids:
      - { boundary: http, op: POST, key: /v1/payment_intents, service: bff }
      - { boundary: postgres, op: INSERT, service: bff }
      - { boundary: sqs, op: SendMessage, key: subscription-orders }
```

## Envelope

| Field         | Meaning                                            |
| ------------- | -------------------------------------------------- |
| `specVersion` | Catalog format version; current writer emits `0.1` |
| `entries`     | Map from stable flow ID to a contract              |

The loader also accepts the legacy flat-map form and ignores recognized metadata keys such as `$schema`, `otelSchemaUrl`, and `catalogId`. New docs and recorder output use the `entries` envelope.

## Contract

| Field      | Required | Meaning                                                            |
| ---------- | -------- | ------------------------------------------------------------------ |
| `requires` | Yes      | Shapes that must match at least once unless constrained by `count` |
| `forbids`  | No       | Shapes that must match zero times                                  |

## Shape Fields

`boundary` is structurally required. Other fields depend on the boundary:

- common: `op`, `key`, `service`, `count`;
- Redis: `ttl`;
- Postgres: `schema`;
- HTTP: `host`, `status`;
- S3: `bucket`;
- RabbitMQ: `exchange`, `routingKey`.

Unknown fields remain forward-compatible in the parsed shape, but only fields understood by the evaluator affect matching.

## Pattern Syntax

```yaml
key: "user:*:tier"          # bare string uses glob matching
key: { equals: "literal" }  # exact match
key: { regex: "^user:" }    # regular expression
count: 1                     # exact numeric match
count: { gte: 1 }
ttl: { gte: 60, lte: 3600 }
```

## Recorder Behavior

Missing flow entries can be added during local snapshot update modes. Refreshing an entry updates observed `requires`; existing `forbids` remain sticky. Verify-only CI mode writes nothing.

Catalog files are review artifacts. Format changes during alpha may require regeneration or migration.
