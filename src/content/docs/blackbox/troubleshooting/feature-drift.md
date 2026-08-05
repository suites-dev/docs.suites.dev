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

Feature drift means the generated or checked feature file no longer matches the run the team expects. The file may be stale, missing, orphaned, or impossible to parse cleanly.

## Common Causes

1. The system behavior changed but the feature file was not regenerated.
2. The generator produced a file for a run the repo no longer recognizes.
3. A rename or refactor broke the link between scenario and artifact.
4. The file format changed enough that the parser or checker no longer accepts it.

## First Checks

1. Compare the generated file with the current scenario or behavior.
2. Check whether the source of truth is the latest runtime evidence.
3. Confirm the file name and path match the current page or scenario slug.
4. Inspect whether the artifact is stale, orphaned, or malformed.

## Recovery

1. Regenerate the feature file from the current run.
2. Update the catalog or scenario naming if the behavior is intentionally new.
3. Delete or quarantine orphaned files that no longer correspond to live scenarios.
4. If the file is unparseable, reduce it to the smallest reproducible example.

## What To Report If It Still Fails

1. The feature file path and scenario name.
2. The run that produced it.
3. The expected versus actual behavior.
4. Any parser or checker error text.
