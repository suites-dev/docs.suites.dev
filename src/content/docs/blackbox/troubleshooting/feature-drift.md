---
title: "Feature Drift"
description: "Explain stale, missing, orphan, and unparseable feature files and how to recover."
sidebar_position: 2
keywords: ["feature drift", "stale feature files", "gherkin drift"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Feature Drift"
  secondary_keywords: ["feature drift", "stale feature files"]
  search_intent: "troubleshooting intent from users whose generated Gherkin files are stale, missing, orphaned, or unparseable"
  snippet_angle: "identify feature-file drift, regenerate from executable tests, and keep readable behavior specs synchronized"
---

Explain stale, missing, orphan, and unparseable feature files and how to recover.

Feature drift means the reviewed feature file no longer matches the executable suite or requirement bindings. The file may be stale, missing, orphaned, or impossible to parse cleanly.

## Common Causes

1. The system behavior changed but the feature file was not regenerated.
2. An emitted baseline was never reviewed and moved into the accepted test directory.
3. A rename or refactor broke the link between scenario and artifact.
4. The file format changed enough that the parser or checker no longer accepts it.

## First Checks

1. Run `blackbox suites discover e2e/tests --json`.
2. Run `blackbox suites check e2e/tests --json`.
3. Confirm the filename, `@flow:` tag, and suite flow ID agree.
4. Inspect whether the artifact is stale, orphaned, or malformed.

## Recovery

1. Run `features emit` to recover a new baseline from an existing suite.
2. Review the baseline before replacing the accepted feature.
3. Delete or quarantine orphaned files that no longer correspond to live scenarios.
4. If the file is unparseable, reduce it to the smallest reproducible example.

## What To Report If It Still Fails

1. The feature file path and scenario name.
2. The suite or requirement source connected to it.
3. The expected versus actual behavior.
4. Any parser or checker error text.
