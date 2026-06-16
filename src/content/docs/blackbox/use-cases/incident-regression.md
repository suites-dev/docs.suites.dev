---
title: "Incident Regression"
description: "Turn an incident into a durable catalog entry and behavioral gate."
sidebar_position: 4
keywords: ["incident regression", "semantic regression", "postmortem testing", "forbidden effects"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Incident Regression"
  secondary_keywords: ["semantic regression", "incident regression", "postmortem testing"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Turn an incident into a durable catalog entry and behavioral gate.

The point is not root-cause analysis. The point is to make the failure visible again if the behavior comes back.

## Audience

Teams that want a known incident to become a recurring behavioral check.

## The Problem

An incident often exposes a missing assertion, a silent boundary change, or a behavior the team never encoded explicitly.

## When It Helps

1. The failure mode is known and repeatable enough to gate.
2. The team wants to prevent regression, not just discuss the postmortem.
3. The runtime effect is observable in a real run.
4. The check should fail before trust is granted.

## What Blackbox Adds

1. The failing effect becomes a catalog entry.
2. The scenario becomes a regression gate.
3. The report shows whether the behavior is back or still fixed.

## What Not To Claim

1. Blackbox does not do incident management.
2. Blackbox does not replace observability, alerting, or root-cause analysis.
3. Blackbox does not prevent every future incident.

## Semantic Regression

An incident regression is often a semantic regression: the system still runs, but the meaning of the behavior changed. A response may still be successful while the wrong effect was emitted, skipped, duplicated, or no longer forbidden.

Blackbox is useful when the postmortem can name the runtime effect that should become a permanent gate.

## Evidence To Add

- A concrete post-incident regression example.
- Links to Requires and Forbids, The Blackbox Lifecycle, and Feature Files and Staleness.

## Figure Placeholder

**Caption:** An incident becoming a recurring regression gate.

**Slot:** `<!-- TODO: insert incident-to-gate before/after demo here -->`
