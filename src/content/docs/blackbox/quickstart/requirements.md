---
title: "Requirements and Supported Stacks"
description: "List the runtime, OpenTelemetry, Playwright, Docker, and project assumptions before the first run."
sidebar_position: 1
keywords: ["blackbox requirements", "opentelemetry requirement", "playwright docker"]
toc_min_heading_level: 2
seo:
  primary_keyword: "blackbox requirements"
  secondary_keywords: ["playwright docker testing", "opentelemetry system tests", "blackbox supported stacks"]
  search_intent: "pre-install evaluation from developers checking whether Blackbox can run in their project"
  snippet_angle: "list the Node, Docker, Playwright, and container assumptions before the first Blackbox run"
---

## Abstract

This page is the gate before the first proof run. It explains what Blackbox needs from your system-test environment before it can collect runtime evidence and produce coverage artifacts.

## Audience

Developers who want to know whether Blackbox can run in their repo right now.

## Supported Alpha Stack

The current alpha path is aimed at Node services that can be started as containers and driven by Playwright system tests.

| Requirement | Why Blackbox needs it |
| --- | --- |
| Node services | The current bootstrap instruments Node processes by loading a Blackbox OpenTelemetry bootstrap before app code starts. |
| Docker or Docker Compose | Blackbox layers a generated test overlay on top of your runnable topology. |
| Playwright system tests | Playwright drives the workflow while Blackbox collects the runtime evidence caused by that workflow. |
| A service image with a shell | The current node wrapper is a POSIX shell script. Distroless images need a different wrapper and are a known limitation. |
| A normal service command | Blackbox expects your service to start through `node`, for example `CMD ["node", "src/server.js"]`. |
| Managed local dependencies | Databases, queues, caches, and local services should be owned by the test topology when possible. |
| Isolated parallel execution | Parallel Playwright workers are supported through the Blackbox test API and testbed isolation model. |

Remote end-to-end environments can still be valuable, but they usually include unmanaged dependencies such as auth providers, email systems, payment providers, shared queues, or vendor APIs. Blackbox is strongest as a behavioral gate when the system under test and its dependencies are controlled enough for a failure to mean something specific.

## Parallelism Requirement

Blackbox does not require a serial-only Playwright suite.

The requirement is isolated ownership of state and evidence. When the suite runs with multiple Playwright workers, Blackbox can use per-worker testbeds, isolation groups, trace attribution, and worker partial reports so concurrent system tests remain attributable.

Use the Blackbox API path for parallel proof: `defineSystemTest`, `system`, `capture`, `scenario.isolated`, `scenario.shared`, and the testbed isolation configuration. Read [Playwright, Isolation, and Parallelism](/docs/blackbox/guides/playwright-isolation-and-parallelism) before turning a first proof run into a broad CI gate.

## What Blackbox Does Not Require

You do not need to add OpenTelemetry code to production services. You also do not need to create a second test-only Dockerfile for each service in the default path.

At test time, Blackbox uses an OpenTelemetry bootstrap image, a generated Docker Compose overlay, and a `node` wrapper mounted into the SUT container. The production-shaped service image remains the image being tested.

## What Must Be True Before You Continue

1. You can build and start the app or service under test.
2. You can run at least one system test that reaches a real boundary.
3. Your service starts through a Node binary path Blackbox can shadow.
4. Docker can start the topology locally or in CI.
5. You know which dependencies are managed by the test run and which are external.
6. You have a writable artifact directory for reports such as `.blackbox-coverage/`.

## Known Alpha Limits

1. The current bootstrap path is Node-focused.
2. Distroless service images are not the happy path because the wrapper needs a shell.
3. Services with existing tracing agents such as Datadog or Sentry may need test-environment overrides.
4. Remote E2E environments with unmanaged dependencies can produce noisy failures and should not be the first proof run.

## What To Read Next

1. [Install Blackbox](/docs/blackbox/quickstart/install)
2. [Run with the Testbed](/docs/blackbox/guides/using-the-testbed)
3. [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts)
