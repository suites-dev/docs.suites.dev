---
title: "Environment Variables"
description: "List supported environment variables and how they affect capture, reports, and testbed behavior."
sidebar_position: 7
keywords: ["environment variables", "blackbox env vars", "otel config"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Environment Variables"
  secondary_keywords: ["environment variables", "blackbox env vars"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

List supported environment variables and how they affect capture, reports, and testbed behavior.

This page should explain which variables influence capture, reporting, and the testbed, and how they interact with config files and CLI flags.

## Audience

These pages are complete references for commands, APIs, configuration, files, reports, and exit codes.

## What This Page Should Contain

1. Each supported variable and its purpose.
2. Whether it affects capture, reporting, or testbed behavior.
3. Whether it is required, optional, or experimental.
4. The precedence relative to config files and CLI flags.

## Content Outline

1. List the complete surface area.
2. Mark stable public API versus internal or alpha behavior.
3. Document inputs, outputs, defaults, errors, and versioning.
4. Point back to guides for examples.

## Practical Guidance

1. Group variables by subsystem.
2. State defaults clearly.
3. Call out the variables that are only for debugging or CI.
4. Explain what happens if a variable is missing or conflicting.

## Evidence To Add

- Real commands, APIs, or artifacts from the Blackbox showcase system.
- Links to related concept, guide, reference, or troubleshooting pages.
- Clear limits and prerequisites where the page touches alpha behavior.
