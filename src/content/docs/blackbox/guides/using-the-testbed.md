---
title: "Run with the Testbed"
description: "Run a controlled Playwright and OpenTelemetry testbed so Blackbox can collect system-test evidence."
sidebar_position: 5
keywords: ["playwright opentelemetry", "testcontainers playwright", "docker compose testing", "blackbox testbed"]
toc_min_heading_level: 2
seo:
  primary_keyword: "playwright opentelemetry"
  secondary_keywords: ["testcontainers playwright", "docker compose testing", "blackbox testbed"]
  search_intent: "practical setup intent from teams running Playwright against containerized or composed systems"
  snippet_angle: "show how a controlled testbed collects OpenTelemetry evidence during a Playwright system test"
---

## Abstract

The Blackbox testbed is the controlled path for running a real system test and collecting runtime evidence. It stands up the system topology, runs the workflow through Playwright or a compatible runner, and routes OpenTelemetry evidence into Blackbox artifacts.

Use this page when you want a repeatable first topology before adapting Blackbox to your own Docker Compose or Testcontainers setup.

## Audience

Developers wiring Blackbox into a local system-test environment, CI job, or sample project.

## What The Testbed Proves

The testbed is not only a demo harness. It teaches the shape Blackbox expects from a useful system test:

1. A running service or service topology.
2. Managed dependencies such as databases, queues, caches, local services, or containers.
3. Runtime instrumentation that emits OpenTelemetry spans during the run.
4. A scenario that exercises a real boundary.
5. Generated artifacts that can be reviewed after the run.

That is why the testbed is the best first step before trying to wire Blackbox into a larger system.

## Playwright And OpenTelemetry

Playwright is the runner that drives the workflow. OpenTelemetry is the evidence channel that shows what happened across boundaries. Blackbox uses the run and the spans together:

1. Playwright performs the action.
2. The application emits spans and other observable facts.
3. Blackbox maps those facts into effects.
4. Reports and feature artifacts make the result reviewable.

This is the practical meaning of a Playwright OpenTelemetry workflow in Blackbox: the test does not only pass or fail. It leaves behind evidence about the system behavior it caused.

## What Happens During A Run

The important user-facing point is that Blackbox does not ask you to rewrite your service images for observability. It runs your production-shaped containers with a generated test overlay.

1. You run the Blackbox system-test command, usually through the project script that invokes Playwright.
2. Your system-test setup builds or selects the OpenTelemetry bootstrap image.
3. Playwright global setup reads the testbed config and the user's Docker Compose topology.
4. Blackbox generates temporary compose overlays for instrumentation, debug ports, and worker isolation.
5. An init container copies `/blackbox-otel` from the bootstrap image into a Docker volume.
6. Each SUT container mounts that volume and shadows its Node binary with `bin/node-wrap`.
7. The SUT still starts with its normal command, such as `node src/server.js`.
8. `node-wrap` prepends `--require=/blackbox-otel/bootstrap.cjs` and then execs the real Node binary from the bootstrap volume.
9. The bootstrap loads before app code and registers OpenTelemetry instrumentations.
10. The test drives a workflow, spans are captured, and Blackbox writes reports after the run.

The user-owned compose file is not modified on disk. The overlays are generated for the test run and then treated as testbed plumbing.

## Why The Bootstrap Image Exists

The bootstrap travels as a Docker image instead of a host `node_modules` bind mount. That matters because package managers such as pnpm can represent dependencies as symlinks that do not survive cleanly when mounted into another container filesystem.

The image contains real files:

1. `bootstrap.cjs`, the OpenTelemetry preload entrypoint.
2. `node_modules/`, with the OpenTelemetry SDK and instrumentations.
3. `bin/node-wrap`, the shell wrapper mounted over the SUT `node` binary.
4. `bin/real-node`, the Node binary the wrapper delegates to.

This keeps the user's package manager out of the instrumentation path.

## Why Blackbox Shadows `node`

Docker Compose environment merging is key-based. If Blackbox simply set `NODE_OPTIONS=--require=/blackbox-otel/bootstrap.cjs`, it could overwrite a value the user's image, compose file, or env file already set.

Instead, the wrapper composes `NODE_OPTIONS` inside the container after the final environment has already been resolved. It preserves existing flags, prepends the Blackbox bootstrap, and avoids double-prepending when child Node processes start.

Blackbox also avoids overriding the service entrypoint. Overriding entrypoint can drop the image command, which would force the testbed to reconstruct every service command. Shadowing `node` keeps the service startup path closer to what the image already declares.

## Testcontainers And Docker Compose

Blackbox does not require one topology tool. The important distinction is whether the dependencies are managed by the test run.

| Setup | Best for | Blackbox concern |
| --- | --- | --- |
| Testbed | Fastest known-good path | Learn the expected topology and artifacts |
| Testcontainers | Per-test managed dependencies | Keep services isolated and observable |
| Docker Compose | Existing multi-service local stack | Make sure services, networks, and telemetry are wired consistently |
| Remote E2E environment | Production-like journey | Expect more unmanaged dependency noise |

System tests usually make better behavioral gates when dependencies are controlled. E2E environments are still useful, but failures may come from auth, email, payment, vendor APIs, or shared infrastructure rather than the behavior under test.

## Minimal Workflow

A good first run should answer four questions:

1. Did the topology start?
2. Did the scenario exercise the boundary?
3. Did spans arrive?
4. Did Blackbox write artifacts?

Do not start by optimizing the whole pipeline. Start with one behavior and one output directory. Once the first proof run works, expand the catalog, reports, and CI gate.

## Expected Artifacts

A successful run should produce some combination of:

1. Runtime evidence from the scenario.
2. Feature files or observation output.
3. Effect catalog or catalog coverage output.
4. OMC/DC coverage artifacts such as `omcdc-propagation.json`, `omcdc-propagation.md`, and `omcdc.html`.
5. Logs or diagnostics for the run.

The exact filenames depend on the command and configuration. The reference page [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts) owns the complete inventory.

## Common Failure Points

If the first run fails, check these in order:

1. The service did not start or was not reachable from the runner.
2. The scenario passed through the wrong host, port, or network.
3. The bootstrap image was not built, pulled, or mounted into the SUT container.
4. The service did not start through the Node binary path Blackbox shadowed.
5. The wrapper loaded, but existing tracing configuration conflicted with the Blackbox bootstrap.
6. Artifacts were written somewhere different from the path you inspected.

## Figure Placeholder

**Caption:** A system-test run from Playwright to Docker Compose overlays, `node-wrap`, OpenTelemetry spans, and `.blackbox-coverage/` artifacts.

**Slot:** `<!-- TODO: insert testbed run-flow diagram or short animated walkthrough here -->`

Use [No Spans Captured](/docs/blackbox/troubleshooting/no-spans-captured) when the test runs but no runtime evidence appears. Use [Docker and Testbed](/docs/blackbox/troubleshooting/docker-and-testbed) when the topology itself fails.

## What To Read Next

1. [Runtime Evidence](/docs/blackbox/concepts/system-tests-and-runtime-evidence)
2. [Writing Scenarios](/docs/blackbox/guides/writing-scenarios)
3. [Reading Coverage Reports](/docs/blackbox/guides/reading-coverage-reports)
4. [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts)
