---
title: "Effect Contract Schema"
description: "Effect contract v0.1 YAML format for required and forbidden runtime behavior."
sidebar_position: 7
keywords:
  ["effect contract schema", "effect YAML", "Blackbox YAML", "requires forbids"]
---

An **effect contract** records the required and forbidden runtime effects for one flow. It is the only Blackbox-owned public YAML artifact.

```text
features/subscribe-unknown-user.feature
features/subscribe-unknown-user.effects.yaml
```

## Complete Example

```yaml
specVersion: "0.1"
flow: subscribe-unknown-user
requires:
  - { boundary: postgres, op: SELECT, key: users, service: bff }
forbids:
  - { boundary: http, op: POST, key: /v1/payment_intents, service: bff }
  - { boundary: postgres, op: INSERT, key: subscriptions, service: bff }
  - { boundary: sqs, op: SendMessage, key: subscription-orders }
```

## Envelope

| Field         | Meaning                                                               |
| ------------- | --------------------------------------------------------------------- |
| `specVersion` | Contract format version. The current public version is `"0.1"`.       |
| `flow`        | Stable flow ID. Must match the feature basename and `@flow:<id>` tag. |
| `requires`    | Effects that must match at least once unless constrained by `count`.  |
| `forbids`     | Effects that must match zero times.                                   |

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
key: "user:*:tier"
key: { equals: "literal" }
key: { regex: "^user:" }
count: 1
count: { gte: 1 }
ttl: { gte: 60, lte: 3600 }
```

Bare strings use glob matching. Use `equals` for exact matches and `regex` only when a glob would be ambiguous.

## Review Rules

Effect contracts are accepted behavior. A Skill may propose a contract from runtime evidence, but a human decides whether each observed effect is required, forbidden, incidental, or a defect.

`blackbox verify` writes evidence and reports. It does not silently update accepted effect contracts.

## Summary

- **One effect YAML file describes one flow.**
- **The `flow` field must match the Gherkin and Playwright flow ID.**
- **`requires` proves expected runtime behavior appeared.**
- **`forbids` proves unsafe runtime behavior stayed absent.**
