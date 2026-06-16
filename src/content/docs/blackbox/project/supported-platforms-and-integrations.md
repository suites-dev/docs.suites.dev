---
title: "Supported Platforms and Integrations"
description: "State what Blackbox supports today, what is experimental, and what belongs on the roadmap."
sidebar_position: 2
keywords: ["blackbox supported platforms", "blackbox integrations", "blackbox compatibility"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Supported Platforms and Integrations"
  secondary_keywords: ["blackbox supported platforms", "blackbox integrations"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

State what Blackbox supports today, what is experimental, and what belongs on the roadmap.

This page should prevent users from guessing whether their language, test runner, tracing stack, CI system, or SDD workflow is supported.

## Audience

Teams evaluating whether Blackbox fits their current stack.

## Compatibility Matrix

Document the tested stacks in a matrix with `status`, `version`, and `date checked`.

1. Supported.
2. Experimental.
3. Planned.
4. Unsupported.

Make the wording concrete. If a stack is supported, say what was tested and when. If it is experimental, say what the current limits are. If it is unsupported, say so directly.

## Integration Policy

1. Supported alpha stack: Node, TypeScript, Playwright, Docker, and OpenTelemetry prerequisites.
2. CI providers: state what is tested and what is only known to work in principle.
3. SDD tools: distinguish generic SDD workflow compatibility from any direct integration.
4. Container environments: state what images, volumes, and network assumptions are covered.

## Content Outline

1. List the supported alpha stack: Node, TypeScript, Playwright, Docker, and OpenTelemetry prerequisites.
2. Separate supported, experimental, planned, and unsupported integrations.
3. Cover CI providers, SDD tools, package managers, and container environments.
4. Explain what users can still do with custom wiring when an integration is not first-class.
5. Link to the configuration reference and release notes only where they help with compatibility decisions.

## Evidence To Add

- A compatibility matrix with tested versions and dates.
- Integration status labels that distinguish support from experimentation.
- Notes about direct Spec Kit support versus generic SDD workflow support.
