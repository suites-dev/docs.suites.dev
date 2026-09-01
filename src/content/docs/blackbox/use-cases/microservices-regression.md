---
draft: true
title: "Verify a Microservice Workflow"
description: "Verify database, HTTP, cache, and queue behavior behind one system flow across an isolated service topology."
sidebar_position: 4
keywords:
  [
    "microservices system testing",
    "distributed regression",
    "queue effect testing",
  ]
---

A distributed endpoint can return the expected response while the workflow behind it changes. Blackbox makes selected cross-service effects part of the contract.

## Protect One Behavioral Path

For a subscription flow, the running topology might cross:

```text
runner -> BFF -> Redis
              -> Postgres
              -> payment HTTP
              -> order service -> queue
```

The success flow can require payment, persistence, cache, and publication effects. The unknown-user flow can require the lookup while forbidding every downstream write.

This is more precise than proving that every service was healthy. It also avoids asking a reviewer to reconstruct accepted behavior from a trace waterfall.

## Isolate the Topology

Provision the sidecar, SUT services, and managed infrastructure in one capture cell. Use `flow` isolation by default.

Use broader isolation only when:

- Databases, caches, and queues reset predictably.
- Background traffic does not contaminate flow evidence.
- Asynchronous work has a durable completion signal.
- Parallel runner workers cannot share the wrong identity.

## Keep Capture Language-Specific

Node and Playwright are the first implementations, not an architectural pair. The Playwright runner adapter can coordinate a topology containing multiple services, while each supported SUT language uses its own capture implementation.

All observations enter the same language-neutral sealed evidence bundle before offline analysis.

## Wait for Durable Completion

Do not analyze a queue or worker effect before the workflow reaches a durable completion signal. Poll controlled infrastructure or wait for an application-visible state transition.

Fixed sleeps weaken both evidence integrity and failure diagnosis.

## Limits

Blackbox does not replace distributed tracing, service contracts, fault injection, monitoring, or resilience testing. It turns selected runtime evidence into a behavioral verdict for selected flows.

## Next Steps

- [Configure Flows and Runtime Isolation](/docs/blackbox/guides/playwright-isolation-and-parallelism)
- [Add Verification Gates to CI](/docs/blackbox/guides/reports-and-ci-gates)
