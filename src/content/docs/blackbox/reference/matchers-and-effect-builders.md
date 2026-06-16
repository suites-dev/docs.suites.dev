---
title: "Matchers and Effect Builders"
description: "Document matchers, effect builders, shape helpers, and stable public imports."
sidebar_position: 3
keywords: ["effect builders", "matchers", "toMatchCatalog"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Matchers and Effect Builders"
  secondary_keywords: ["effect builders", "matchers"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Document matchers, effect builders, shape helpers, and stable public imports.

This page should explain how tests express effect assertions and how those assertions connect to the catalog and report formats.

## Audience

These pages are complete references for commands, APIs, configuration, files, reports, and exit codes.

## What This Page Should Contain

1. The supported matcher functions.
2. The supported effect builders or shape helpers.
3. Examples of asserting required and forbidden effects.
4. The stable import surface versus internal helpers.

## Content Outline

1. List the complete surface area.
2. Mark stable public API versus internal or alpha behavior.
3. Document inputs, outputs, defaults, errors, and versioning.
4. Point back to guides for examples.

## Practical Guidance

1. Show the simplest matcher first.
2. Pair each matcher with one effect example.
3. Keep the output shape consistent with the report pages.
4. Explain the failure mode when a matcher does not find the expected effect.

## Evidence To Add

- Real commands, APIs, or artifacts from the Blackbox showcase system.
- Links to related concept, guide, reference, or troubleshooting pages.
- Clear limits and prerequisites where the page touches alpha behavior.
