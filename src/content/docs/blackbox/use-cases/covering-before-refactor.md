---
title: "Covering Before Refactor"
description: "Use characterization testing and Blackbox runtime evidence to capture behavior before changing internals."
sidebar_position: 1
keywords: ["characterization testing", "golden master testing", "refactor safety", "cover before refactor"]
toc_min_heading_level: 2
seo:
  primary_keyword: "characterization testing"
  secondary_keywords: ["golden master testing", "refactor safety", "cover before refactor"]
  search_intent: "legacy and refactor safety intent from teams capturing current behavior before changing internals"
  snippet_angle: "capture current system behavior before a refactor, then compare runtime effects after the change"
---

Covering before refactor means capturing current behavior before changing the implementation. This is the classic characterization testing move: when the system is valuable but hard to reason about, first document what it does.

Blackbox applies that idea to system behavior. It records runtime effects before the refactor, then lets the team compare what changed after the implementation moves.

Teams about to rewrite, extract, modularize, upgrade, or clean up a system that already has user value and should not accidentally change behavior.

## Why Refactors Need Behavior Proof

Refactors often begin with a risky assumption: if the existing tests are green, behavior is safe. That can be true for local logic and still false for system behavior.

A refactor can keep unit tests green while changing:

1. A downstream HTTP call.
2. An emitted event.
3. A database write.
4. A queue message.
5. A cache invalidation.
6. A forbidden side effect that should never happen.

When those effects matter, line coverage and passing tests are not enough. The team needs a behavior baseline.

## Characterization Testing And Golden Masters

Characterization testing captures what a system currently does so future changes can be compared against it. Golden master testing often captures a larger output snapshot and treats it as a baseline.

Blackbox uses the same instinct but produces more reviewable artifacts:

1. Runtime evidence from a real system run.
2. Effects derived from that evidence.
3. Feature files that summarize behavior in readable form.
4. Catalogs and reports that mark required, forbidden, missing, and newly observed effects.

That makes the baseline easier to review than a raw snapshot alone.

## Refactor Workflow

A practical workflow is:

1. Pick one high-risk behavior before changing internals.
2. Run a system test that exercises the behavior.
3. Capture the Blackbox artifacts as the baseline.
4. Perform the refactor.
5. Run the same scenario again.
6. Review the effect drift.
7. Accept intentional behavior changes and reject accidental ones.

This gives reviewers a concrete artifact instead of only a diff and a green test suite.

## What Counts As Success

A good refactor run does not prove that the new design is better. It proves that selected externally visible behavior stayed stable or changed intentionally.

Success looks like:

1. Required effects still appear.
2. Forbidden effects still stay absent.
3. Newly observed effects are reviewed.
4. Missing effects are investigated before merge.
5. The final artifact explains why behavior is still acceptable.

## What Not To Claim

Blackbox does not make refactors risk-free. It does not replace unit tests for local logic, and it does not prove that every behavior in the system was covered. It gives the team stronger evidence for the workflows it actually exercised.

## What To Read Next

1. [Runtime Evidence](/docs/blackbox/concepts/runtime-evidence)
2. [System Effects](/docs/blackbox/concepts/effects-and-catalogs)
3. [Reading Coverage Reports](/docs/blackbox/guides/reading-coverage-reports)
4. [Feature Drift](/docs/blackbox/troubleshooting/feature-drift)
