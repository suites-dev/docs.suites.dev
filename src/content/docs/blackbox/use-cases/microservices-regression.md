---
title: "Microservices Regression"
description: "Verify HTTP, database, cache, and queue behavior behind one Playwright system flow across an isolated microservice topology."
sidebar_position: 4
keywords:
  [
    "microservices system testing",
    "distributed system regression",
    "queue effect testing",
    "service boundary verification",
  ]
---

A microservice endpoint can return the expected response while the distributed workflow behind it changes. Blackbox makes selected cross-service effects part of the review.

## What One Flow Can Prove

The subscription showcase drives `POST /subscriptions` through:

```text
Playwright -> BFF -> Redis
                  -> Postgres
                  -> payment HTTP
                  -> fraud-check
                  -> order-service -> SQS
```

The success flow can require a payment request, subscription insert, cache update, and queue publication. The unknown-user flow can require the lookup while forbidding payment, persistence, and publication.

That is more precise than "all services were healthy" and more behavior-oriented than asking a reviewer to reconstruct the workflow from a trace waterfall.

## Choose the Topology

Use managed dependencies where possible:

- one Compose or Testcontainers stack per Playwright worker;
- Docker-assigned ports;
- resettable database, cache, and queue state;
- local or sandboxed substitutes for unmanaged vendors;
- explicit waits for asynchronous completion.

Broader E2E runs can include real identity, email, or vendor systems, but their variability makes strict merge gates harder to diagnose.

## Contract Example

```ts
await expect(capture).toObserveEffects({
  requires: [
    effect.http("POST", { path: "/v1/payment_intents" }),
    effect.postgres("INSERT", { table: "subscriptions" }),
    effect.sqs("SendMessage", { queue: "subscription-orders" }),
  ],
  forbids: [
    effect.http("POST", { path: "/v1/refunds" }),
    effect.postgres("DELETE"),
  ],
});
```

Qualify shapes with `service` in the catalog when multiple services can produce the same operation.

## Async Effects

Do not assert a queue or worker effect before the flow has a durable completion signal. Poll a managed dependency, wait for an application-visible state transition, or expose a test synchronization endpoint. Sleeping for a fixed duration makes both capture and failure diagnosis weaker.

## Limits

Blackbox does not replace distributed tracing, service contracts, fault injection, production monitoring, or network resilience testing. It converts selected runtime evidence into a behavioral gate for selected flows.

Continue with [Playwright Flows, Isolation, and Parallelism](/docs/blackbox/guides/playwright-isolation-and-parallelism) and [Reports and CI Gates](/docs/blackbox/guides/reports-and-ci-gates).
