---
title: "Effect Contract Failures"
description: "Diagnose missing required effects, forbidden effects, unsupported observations, mismatches, and incomplete evidence."
sidebar_position: 3
keywords:
  ["effect contract failures", "requires forbids", "effect assertion failure"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Effect Contract Failures"
  secondary_keywords: ["effect contract failures", "requires forbids"]
  search_intent: "troubleshooting intent from users whose required effects are missing, forbidden effects appeared, or catalog matching failed"
  snippet_angle: "compare observed effects to the contract, decide whether implementation or contract changed, then rerun the scenario"
---

An effect contract failure means offline analysis could not prove the behavior the team accepted. Start from the sealed evidence and contract used for that verdict.

## Common Causes

1. A required effect did not happen.
2. A forbidden effect appeared in the run.
3. Capture cannot normalize an observation the declared capability should support.
4. The normalized observation and contract shape cannot be compared.
5. Bundle integrity cannot support the verdict.

## First Checks

1. Compare the observed run with the effect contract.
2. Decide whether the contract or the implementation changed.
3. Confirm whether the missing effect is truly required or just incidental.
4. Check the bundle's declared capture capabilities and integrity.
5. Confirm the analyzer and protocol versions are compatible.

## Recovery

1. Update the effect contract if the new behavior is intentional and reviewed.
2. Fix the implementation if the old effect is still required.
3. Fix capture or protocol compatibility when an observation is unsupported or mismatched.
4. Record a new run and analyze the new sealed bundle.

Unsupported capture and mismatches fail. A valid normalized observation that matches no required or forbidden clause remains evidence and is not a contract failure.

## What To Report If It Still Fails

1. The scenario or flow ID.
2. The required or forbidden effect that failed.
3. The normalized observation and accepted contract clause.
4. The bundle integrity, protocol, runner, and capture versions.
