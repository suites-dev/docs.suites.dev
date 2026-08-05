---
title: "No Spans Captured"
description: "Diagnose uninstrumented systems, missing trace propagation, and empty reports."
sidebar_position: 1
keywords: ["no spans captured", "opentelemetry troubleshooting", "empty reports"]
toc_min_heading_level: 2
seo:
  primary_keyword: "no spans captured"
  secondary_keywords: ["opentelemetry troubleshooting", "blackbox empty report", "node options require"]
  search_intent: "troubleshooting intent from users whose system test ran but produced empty Blackbox evidence"
  snippet_angle: "walk through topology, bootstrap, node wrapper, trace propagation, and artifact checks for empty span reports"
---

Diagnose uninstrumented systems, missing trace propagation, and empty reports.

If the report is empty, the run may still have happened, but Blackbox did not see the runtime evidence it needed. This page helps you separate "the system did nothing" from "the instrumentation path was missing."

## Common Causes

1. The test hit a code path that never crossed an instrumented boundary.
2. The bootstrap image was not available to the testbed.
3. The generated compose overlay did not mount `/blackbox-otel` into the SUT container.
4. The service did not start through the Node binary path Blackbox shadowed.
5. `NODE_OPTIONS` was explicitly set empty for the app process, bypassing the wrapper behavior.
6. Another tracing agent registered first and blocked the Blackbox tracer.
7. Trace propagation broke before the request reached the service that should emit spans.
8. The scenario ended before evidence was collected or flushed.

## First Checks

1. Confirm the test actually exercised the boundary you expected.
2. Confirm the testbed built or pulled the bootstrap image.
3. Confirm the SUT container has `/blackbox-otel/bootstrap.cjs` and `/blackbox-otel/bin/node-wrap` mounted.
4. Confirm the service command invokes the Node binary path Blackbox is configured to shadow.
5. Inspect the debug output or report for trace IDs and span counts.
6. Compare the empty run with a known-good sample if you have one.

## Wrapper-Specific Checks

The wrapper has one intentional bypass: if `NODE_OPTIONS` is set and its value is empty, it executes the real Node binary without the Blackbox preload. This allows healthchecks such as `NODE_OPTIONS= node -e "..."` to avoid starting a second debug server inside the same container.

That bypass should be used for healthchecks, not for the app process itself. If the main service command or compose environment sets `NODE_OPTIONS` to an explicit empty value, Blackbox will not load.

If your service already uses `NODE_OPTIONS`, Blackbox should preserve it. The wrapper prepends `--require=/blackbox-otel/bootstrap.cjs` to the resolved value rather than replacing it in the compose file.

## Existing Tracing Agents

Production-shaped images sometimes include `dd-trace/init`, Sentry tracing, or another OpenTelemetry provider. In a test environment, those agents can compete with Blackbox for the process tracer.

If spans are empty or startup fails with a tracer-provider error, disable the production tracer for the test topology. Common examples are setting `DD_TRACE_ENABLED=false` or clearing `SENTRY_DSN` in the test compose override.

## Recovery

1. Re-run with debug logging enabled.
2. Reduce the scenario to the smallest boundary that should emit spans.
3. Verify the container or testbed config that carries the bootstrap and trace propagation.
4. Temporarily disable competing tracing agents in the test environment.
5. If the path is still empty, compare against the showcase system before filing a bug.

## What To Report If It Still Fails

1. The command you ran.
2. The expected boundary.
3. The actual output or log excerpt.
4. The config that controls instrumentation or tracing.
