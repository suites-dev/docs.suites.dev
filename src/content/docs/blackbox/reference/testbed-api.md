---
title: "Testbed API"
description: "Document the supported helpers for running Blackbox against an isolated testbed."
sidebar_position: 3
keywords: ["blackbox testbed api", "testbed reference", "blackbox integration testing"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Testbed API"
  secondary_keywords: ["blackbox testbed api", "testbed reference"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Document the supported helpers for running Blackbox against an isolated testbed.

This page should explain the testbed as an integration boundary and show the supported helpers that manage startup, readiness, evidence, and cleanup.

## Audience

Teams that need repeatable local or CI runs against a controlled system under test.

## What This Page Should Contain

1. The supported testbed helpers.
2. The lifecycle they own.
3. The inputs they expect and the outputs they produce.
4. The difference between a testbed and a plain compose stack.

## Content Outline

1. Define what the testbed owns: process startup, containers, service readiness, trace collection, and cleanup.
2. List the supported helpers and the lifecycle they participate in.
3. Show how a scenario starts, exercises, observes, and tears down a testbed.
4. Explain how the testbed differs from using an existing Docker Compose stack.
5. Link to troubleshooting pages for Docker, readiness, and missing spans.

## Practical Guidance

1. Show one minimal helper flow.
2. Call out the supported defaults before customization.
3. Explain what the testbed cleans up for the user.
4. State what to do when readiness or trace capture fails.

## Evidence To Add

- Minimal code example from the showcase system.
- Table of supported options and defaults.
- Failure examples with the diagnostic output users should expect.
