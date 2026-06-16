---
title: "API Reference"
description: "Define the public package API surface, stability expectations, and how it maps to the CLI."
sidebar_position: 2
keywords: ["blackbox api reference", "blackbox package api", "effect coverage api"]
toc_min_heading_level: 2
seo:
  primary_keyword: "API Reference"
  secondary_keywords: ["blackbox api reference", "blackbox package api"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Define the public package API surface, stability expectations, and how it maps to the CLI.

This page is the boundary between supported public APIs and internal implementation details. If a symbol or import path is not described here, treat it as unstable unless the project says otherwise.

## Audience

Developers who want to call Blackbox from code, build wrappers, or understand which exports are supported across releases.

## What This Page Should Contain

1. Stable public imports.
2. Exported types and helpers.
3. Async behavior and error shape.
4. Mapping to the CLI.
5. Explicit internal boundaries.

## Content Outline

1. State whether a stable public library API ships in the current alpha.
2. List the supported imports, exported types, async behavior, and error shape.
3. Map common API calls to their equivalent CLI workflows.
4. Explain versioning guarantees and which modules are internal.
5. Link to the Testbed API, Scenario DSL, catalog schema, and report format pages.

## Practical Guidance

1. Show a minimal import and call example.
2. Explain which exports are safe for external code.
3. Keep the internal modules clearly labeled.
4. Call out any alpha-only behavior explicitly.

## Evidence To Add

- Minimal runnable package API examples.
- Type signatures generated from the published package.
- Clear alpha disclaimers for any API that is not yet stable.
