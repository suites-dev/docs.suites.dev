---
title: "Diagnostics and Debug Logs"
description: "Explain how to collect useful logs, debug failed runs, and decide whether the issue is setup, traces, catalog drift, or Blackbox."
sidebar_position: 5
keywords: ["blackbox diagnostics", "blackbox debug logs", "effect coverage troubleshooting"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Diagnostics and Debug Logs"
  secondary_keywords: ["blackbox diagnostics", "blackbox debug logs"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Explain how to collect useful logs, debug failed runs, and decide whether the issue is setup, traces, catalog drift, or Blackbox.

This page is the triage hub. It should show users which logs to look at first, what each failure class looks like, and how to reduce the run to something debuggable.

## Audience

Developers and CI owners investigating failed Blackbox runs.

## Common Failure Classes

1. Setup failures.
2. No-span failures.
3. Catalog or feature drift.
4. Report generation failures.
5. Integration or environment failures.

## First Checks

1. Re-run with verbose or debug output.
2. Save the report, logs, and any generated artifacts from the failing run.
3. Identify whether the failure is in setup, evidence collection, comparison, or rendering.
4. Reduce the case to a minimal reproduction before filing a bug.

## Content Outline

1. Show the first diagnostic commands to run after a failure.
2. Separate setup failures, no-span failures, catalog assertion failures, and report generation failures.
3. Explain verbose or debug output, where logs live, and what files are safe to attach to bug reports.
4. Describe how to reduce a failing run to a minimal reproduction.
5. Link to reporting a bug when local diagnostics are not enough.

## What To Keep

1. The command that failed.
2. The smallest relevant log excerpt.
3. The artifact or report that proves the failure.
4. The configuration that reproduces it.

## Evidence To Add

- Real debug command output.
- A table of common symptoms and likely causes.
- Redaction guidance for traces, URLs, headers, and secrets.
