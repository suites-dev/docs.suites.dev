---
title: "Catalog Failures"
description: "Explain missing required effects, forbidden effects, and inline shapes that should be promoted."
sidebar_position: 3
keywords: ["catalog failures", "requires forbids", "effect assertion failure"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Catalog Failures"
  secondary_keywords: ["catalog failures", "requires forbids"]
  search_intent: "troubleshooting intent from users whose required effects are missing, forbidden effects appeared, or catalog matching failed"
  snippet_angle: "compare observed effects to the catalog, decide whether implementation or contract changed, then rerun the scenario"
---

Explain missing required effects, forbidden effects, and inline shapes that should be promoted.

Catalog failures mean the run did not satisfy the effect contract the team wrote down. The system may have behaved differently, omitted a required boundary effect, or emitted something that should have been forbidden.

## Common Causes

1. A required effect did not happen.
2. A forbidden effect appeared in the run.
3. The catalog is too narrow for the real behavior.
4. The catalog is too broad and should be split into smaller shapes.

## First Checks

1. Compare the observed run with the catalog entry.
2. Decide whether the catalog or the implementation changed.
3. Confirm whether the missing effect is truly required or just incidental.
4. Check whether the effect belongs in an inline shape or a promoted catalog entry.

## Recovery

1. Update the catalog if the new behavior is intentional.
2. Fix the implementation if the old effect is still required.
3. Promote repeated inline shapes into named catalog entries when they become part of the workflow.
4. Re-run the scenario to confirm the gate now matches the intended behavior.

## What To Report If It Still Fails

1. The scenario or catalog entry name.
2. The required or forbidden effect that failed.
3. The observed output from the run.
4. Any report or propagation artifact that explains the mismatch.
