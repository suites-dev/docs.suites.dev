---
title: "Data and Telemetry"
description: "Explain what Blackbox reads, what it writes, and whether anything leaves the machine."
sidebar_position: 2
keywords: ["data handling", "telemetry", "privacy"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Data and Telemetry"
  secondary_keywords: ["data handling", "telemetry"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Explain what Blackbox reads, what it writes, and whether anything leaves the machine.

This page is about data flow. Users should understand which inputs Blackbox reads, which outputs it writes, and whether anything is transmitted beyond the local machine or CI environment.

## Audience

These pages explain what Blackbox executes, reads, writes, and requires from the local or CI environment.

## Data Blackbox Reads

1. Source files needed for the run.
2. System-test configuration.
3. Runtime evidence from the test process and container boundary.
4. Existing artifacts when comparing or replaying coverage.

## Data Blackbox Writes

1. Coverage and propagation reports.
2. Feature files and catalog artifacts.
3. Debug logs and diagnostic outputs when requested.
4. Exit status and CI-facing annotations.

## Telemetry And Transmission

Blackbox should make it clear whether anything leaves the machine, what is sent, and why. If telemetry exists, the docs need to state:

1. What data is sent.
2. Where it is sent.
3. Whether it is optional.
4. How to disable it, if that is supported.

## Content Outline

1. State what happens locally and in CI.
2. List data read and written.
3. Clarify secrets, credentials, network access, and telemetry.
4. Give safe operating defaults.

## Safe Operating Defaults

1. Prefer local-only collection where possible.
2. Keep telemetry off unless the feature depends on it.
3. Do not place secrets in generated artifacts.
4. Treat debug logs as potentially sensitive if they include payloads or tokens.

## Evidence To Add

- Real commands, APIs, or artifacts from the Blackbox showcase system.
- Links to related concept, guide, reference, or troubleshooting pages.
- Clear limits and prerequisites where the page touches alpha behavior.
