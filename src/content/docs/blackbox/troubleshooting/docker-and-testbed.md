---
title: "Docker and Testbed"
description: "Diagnose container startup, ports, waits, compose overlays, and local environment failures."
sidebar_position: 4
keywords: ["docker troubleshooting", "testbed errors", "compose testing"]
toc_min_heading_level: 2
seo:
  primary_keyword: "docker testbed troubleshooting"
  secondary_keywords: ["docker troubleshooting", "testbed errors", "docker compose testing"]
  search_intent: "troubleshooting intent from developers whose Blackbox container topology fails before evidence can be trusted"
  snippet_angle: "diagnose compose startup, bootstrap image, init container, mounted node wrapper, ports, waits, and stale volumes"
---

Diagnose container startup, ports, waits, compose overlays, and local environment failures.

This page covers the failures that happen before the run can even be trusted: containers not starting, ports colliding, waits never resolving, or the local testbed not matching the scenario.

## Common Causes

1. The compose stack did not start cleanly.
2. A port mapping collided with another local process.
3. A wait condition never became true.
4. The local environment and the testbed configuration diverged.
5. The OpenTelemetry bootstrap image was not built or could not be pulled.
6. The init container did not populate the bootstrap volume.
7. The SUT image does not have a shell for the current `node-wrap` script.
8. The configured Node binary path does not match the SUT image.

## First Checks

1. Confirm the containers are healthy before the test starts.
2. Check for port collisions and stale containers.
3. Verify the wait conditions and any startup dependencies.
4. Compare the local configuration with the CI configuration if the failure only appears in one place.
5. Confirm the bootstrap image exists locally or is reachable from CI.
6. Confirm the generated overlay mounted `/blackbox-otel` and `bin/node-wrap` into the SUT.

## Bootstrap Image Checks

In local development, the bootstrap image is commonly tagged as `blackbox-instr-node:local`. In packaged or CI usage, the image may come from a registry or from `BLACKBOX_INSTR_IMAGE`.

The image must contain:

1. `/blackbox-otel/bootstrap.cjs`
2. `/blackbox-otel/node_modules/`
3. `/blackbox-otel/bin/node-wrap`
4. `/blackbox-otel/bin/real-node`

If the image is missing, malformed, or built for the wrong architecture, the SUT may start without instrumentation or fail before it becomes healthy.

## Node Binary Path Checks

The default instrumentation path shadows `/usr/local/bin/node`. That matches common official Node images, but it is still an assumption.

If your image puts Node somewhere else, configure the testbed to shadow the correct path. If your image is distroless, the current shell wrapper is not enough because there is no `/bin/sh` to execute it.

## Recovery

1. Restart the testbed from a clean state.
2. Remove stale containers or volumes if the setup expects a fresh run.
3. Rebuild or repull the bootstrap image.
4. Fix the compose overlay, Node binary path, or port mapping that caused the failure.
5. Re-run the sample project before trying the full system again.

## What To Report If It Still Fails

1. The compose or testbed command.
2. The failing container or port.
3. The wait condition or startup step that timed out.
4. Any logs that show why the testbed never reached a ready state.
