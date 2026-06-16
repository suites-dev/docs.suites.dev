---
title: "Requires and Forbids"
description: "Explain positive requirements, forbidden effects, and proving the negative through physical absence."
sidebar_position: 4
keywords: ["behavioral assertions", "behavior assertions", "requires forbids", "forbidden effects"]
toc_min_heading_level: 2
seo:
  primary_keyword: "behavioral assertions"
  secondary_keywords: ["behavior assertions", "requires forbids", "forbidden effects"]
  search_intent: "brand-building intent for teams looking for assertions over runtime behavior rather than implementation details"
  snippet_angle: "behavioral assertions include both required effects and forbidden effects at the system boundary"
---

## Abstract

Explain positive requirements, forbidden effects, and proving the negative through physical absence.

This page explains the two halves of a behavior contract: what must happen and what must not happen.

## Audience

These pages define the nouns and mental models behind effect coverage and behavioral verification.

## Behavioral Assertions

Behavioral assertions are assertions over what the running system did at the boundary. They are different from unit-level expectations because they describe externally visible behavior: events, writes, calls, messages, emails, and other effects.

Blackbox splits behavioral assertions into two families: requires and forbids.

## Requires

Required effects are the behaviors the team needs to see in a successful run.

## Forbids

Forbidden effects are the behaviors that should not appear at the boundary.

## Why The Negative Matters

The absence of a forbidden effect is often the thing the team cares about most. Blackbox makes that absence reviewable by comparing the run against the contract.

## How It Fits The Workflow

1. The scenario defines the expected behavior.
2. The run emits effects.
3. The catalog or report compares observed behavior to required and forbidden effects.
4. The team decides whether the change is acceptable.

## Content Outline

1. Define the concept in one paragraph.
2. Explain how it appears in the Blackbox workflow.
3. Connect it to stale specs, runtime evidence, or behavioral gates where relevant.
4. Link to the guide or reference page that makes it practical.

## Practical Guidance

1. Keep requires and forbids specific.
2. Tie them to a real boundary effect.
3. Avoid wording that only tests internal implementation details.
4. Prefer contracts that a reviewer can understand quickly.

## Evidence To Add

- Real commands, APIs, or artifacts from the Blackbox showcase system.
- Links to related concept, guide, reference, or troubleshooting pages.
- Clear limits and prerequisites where the page touches alpha behavior.
