---
title: "Diagnostics and Debug Logs"
description: "Explain how to collect useful logs, debug failed runs, and decide whether the issue is setup, traces, catalog drift, or Blackbox."
sidebar_position: 5
keywords:
  [
    "blackbox diagnostics",
    "blackbox debug logs",
    "effect coverage troubleshooting",
  ]
toc_min_heading_level: 2
seo:
  primary_keyword: "Diagnostics and Debug Logs"
  secondary_keywords: ["blackbox diagnostics", "blackbox debug logs"]
  search_intent: "troubleshooting intent from users collecting logs and artifacts for failed Blackbox runs"
  snippet_angle: "separate setup, no-span, catalog, feature drift, and report generation failures before filing an issue"
---

Use the facade before opening raw logs. It separates project readiness, connected-artifact state, and a live verification failure.

```bash
blackbox doctor --json
blackbox status --flow subscribe-unknown-user --json
blackbox verify --flow subscribe-unknown-user --json
```

Run `blackbox explain <finding-rule>` when the JSON output includes an unfamiliar diagnostic code.

## Common Failure Classes

1. Setup failures.
2. No-span failures.
3. Catalog or feature drift.
4. Report generation failures.
5. Integration or environment failures.

## First Checks

1. Run `blackbox doctor --json` without starting the SUT.
2. Run `blackbox status --flow <flow-id> --json` to detect stale or disconnected artifacts.
3. Re-run only the affected flow with `blackbox verify --flow <flow-id> --json`.
4. Save the layered result, report directory, logs, and generated artifacts from that run.
5. Identify whether the failure is in setup, execution, evidence collection, comparison, or rendering.
6. Reduce the case to a minimal reproduction before filing a bug.

## What To Keep

1. The command that failed.
2. The smallest relevant log excerpt.
3. The artifact or report that proves the failure.
4. The configuration that reproduces it.
