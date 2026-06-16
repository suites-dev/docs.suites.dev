---
title: "Troubleshooting First Run"
description: "Help users recover from the common first-run failures before they leave the quickstart."
sidebar_position: 4
keywords: ["blackbox troubleshooting", "no spans captured", "first run"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Troubleshooting First Run"
  secondary_keywords: ["blackbox troubleshooting", "no spans captured"]
  search_intent: "debugging intent from developers whose first Blackbox run did not produce evidence"
  snippet_angle: "classify first-run failures by install, Docker, Playwright, missing spans, missing catalog entries, and report output"
---

## Abstract

Use this page when the first proof run does not produce a useful effect catalog or coverage report.

## Audience

Developers who hit a first-run error and need a fast way to classify it.

## Common First-Run Failures

| Symptom | Likely cause | First check |
| --- | --- | --- |
| `pnpm exec blackbox --help` fails | CLI package is not installed in the package where you ran it | Install `@suites/blackbox-cli`, or run from the workspace package that owns the dependency |
| `pnpm test:system` fails before tests start | Docker, image build, or testbed startup failed | Run the app topology without Blackbox, then run `pnpm build:otel-image` in the Blackbox repo or configure the bootstrap image |
| Playwright cannot find tests | Wrong test directory or config | Check the Playwright config and confirm it matches `*.system.test.ts` files |
| HTTP assertion passes but no effects appear | The request did not carry trace context or the service process was not instrumented | Use the wrapped Playwright `request` fixture or pass the capture trace headers, then confirm the service starts through `node` |
| No effect catalog appears | The matcher was not reached or the capture had no label | Confirm the flow is inside `test.system('<slug>', ...)` and the test calls `await expect(capture).toMatchCatalog()` |
| Catalog exists but the run fails | A required effect disappeared or a forbidden effect appeared | Inspect the failure message before updating the catalog; the app may have regressed |
| Reports are missing | Reporter/output config did not run or teardown failed | Check `.blackbox-coverage/` and the Playwright reporter configuration |

## Recovery Pattern

1. Confirm the baseline command runs: `pnpm test:system`.
2. Confirm Docker can build and start the service topology.
3. Confirm the test enters a `test.system('<slug>', ...)` block.
4. Confirm the request is connected to the active capture.
5. Confirm the test reaches `toMatchCatalog()`.
6. Inspect the generated effects file before changing app code or catalog code.
7. Inspect `.blackbox-coverage/` for reports and per-test evidence.

## Missing Baseline

On a new flow, `toMatchCatalog()` is allowed to pass when no catalog entry exists. The observation is recorded and materialized at fixture teardown.

If no baseline is written:

1. Make sure the test calls `await expect(capture).toMatchCatalog()`.
2. Make sure the test is inside `test.system('<slug>', '<description>', () => { ... })`.
3. Make sure the test completes teardown; a hard process failure can prevent artifact writing.
4. Check whether the effects file already exists. Existing entries are not silently overwritten.

## Missing Spans

When the HTTP assertion passes but the effect catalog is empty, the system was exercised but the behavior was not captured.

Check these first:

1. The service starts through a `node` command that the wrapper can shadow.
2. The test uses the Blackbox Playwright runner or fixtures.
3. The request carries trace context from the active capture.
4. Each service exposes the debug endpoint expected by the testbed.
5. The dependency you expected to see is inside the managed test topology.

## When To File An Issue

File an issue when the topology starts, the request carries trace context, the service is instrumented, and Blackbox still fails to write a baseline or report. Include the command, Node version, Docker version, Playwright config, test file, generated effects file if any, and the contents of `.blackbox-coverage/`.
