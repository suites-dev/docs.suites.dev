---
title: "What Blackbox Runs"
description: "Explain local commands, Playwright integration, container interaction, and generated artifacts."
sidebar_position: 1
keywords: ["security", "what blackbox runs", "local execution"]
toc_min_heading_level: 2
seo:
  primary_keyword: "what blackbox runs"
  secondary_keywords: ["blackbox security", "test container instrumentation", "opentelemetry bootstrap"]
  search_intent: "trust evaluation from developers who need to know what code executes in their repo and containers"
  snippet_angle: "explain the local commands, generated compose overlays, bootstrap image, container mounts, and artifacts Blackbox uses"
---

## Abstract

This page defines the execution boundary. Blackbox runs the commands you ask it to run, usually through Playwright or your chosen system-test entrypoint, and then observes the resulting system behavior.

## Audience

These pages explain what Blackbox executes, reads, writes, and requires from the local or CI environment.

## What Runs

During the default containerized testbed flow, Blackbox may run or generate these pieces:

1. The system-test command you invoked, usually a Playwright command or project script.
2. Your SUT containers and managed dependencies from Docker Compose or the testbed config.
3. A generated Docker Compose overlay that adds instrumentation mounts, debug ports, and isolation wiring.
4. A one-shot init container from the Blackbox OpenTelemetry bootstrap image.
5. A mounted `node-wrap` script that shadows the SUT Node binary during the test run.
6. A local debug HTTP endpoint inside each instrumented SUT process for span collection.
7. Reporters and artifact sinks after the scenario finishes.

The generated overlay is test infrastructure. Your compose file and service Dockerfiles are not rewritten on disk by the default flow.

## What Is Mounted Into Containers

The bootstrap image provides a `/blackbox-otel` directory with the Blackbox preload entrypoint, OpenTelemetry dependencies, a Node wrapper, and a real Node binary for the wrapper to execute.

For each SUT container, the testbed overlay mounts:

1. `/blackbox-otel:ro`, the bootstrap runtime tree.
2. `bin/node-wrap` over the configured Node binary path, commonly `/usr/local/bin/node`.
3. A debug port used by the runner to fetch spans for the active trace.

The service still runs its normal command. The difference is that when that command invokes `node`, the wrapper adds the Blackbox preload before app code starts.

## What Blackbox Does Not Run

1. It does not replace your app server.
2. It does not replace your test framework.
3. It does not require production code to import OpenTelemetry.
4. It does not require a second test-only Dockerfile in the default path.
5. It does not send collected evidence to a hosted service by default.

## What It Reads And Writes

Blackbox reads testbed configuration, the runnable topology, scenarios, effect catalogs, and runtime spans exposed by the instrumented SUTs during the test run.

Blackbox writes generated artifacts such as coverage reports, catalog summaries, OMC/DC reports, diagnostics, and CI annotations depending on the configured reporters and sinks. The default durable output is the local artifact directory, commonly `.blackbox-coverage/`.

See [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts) for the full inventory.

## Trust Boundary

Blackbox is deliberately intrusive inside the test container process: it preloads code before the app starts so it can observe boundaries without production changes. That is why it belongs in local and CI test environments, not in production runtime unless you explicitly choose to experiment there.

The trust tradeoff is the point of the framework: in exchange for a controlled test-only preload, you get runtime evidence about what the system actually did.

## Safe Operating Defaults

1. Keep the testbed isolated from unrelated local services.
2. Use the least amount of credential scope needed for the run.
3. Treat generated artifacts as reviewable outputs, not as trusted inputs.
4. Prefer explicit configuration over environment guesswork.

## Figure Placeholder

**Caption:** What Blackbox adds to the test environment: generated compose overlay, bootstrap volume, Node wrapper, debug spans, and local artifacts.

**Slot:** `<!-- TODO: insert security/trust execution-boundary diagram here -->`
