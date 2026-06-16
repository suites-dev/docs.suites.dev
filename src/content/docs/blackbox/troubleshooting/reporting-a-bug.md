---
title: "Reporting a Bug"
description: "List the command output, config, environment, artifacts, and reproduction details maintainers need."
sidebar_position: 5
keywords: ["report bug", "debug blackbox", "issue template"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Reporting a Bug"
  secondary_keywords: ["report bug", "debug blackbox"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

List the command output, config, environment, artifacts, and reproduction details maintainers need.

This page explains the minimum useful bug report. If maintainers cannot reproduce the issue or understand the run context, the report is not complete enough yet.

## Audience

These pages help users recover from common failures without opening an issue.

## What A Useful Bug Report Includes

1. The command or scenario that failed.
2. The expected result and the actual result.
3. The environment and configuration used.
4. The relevant artifacts, logs, and screenshots.
5. The exact steps needed to reproduce the issue.

## What To Redact

1. Secrets or tokens.
2. Private URLs if they are not required to understand the issue.
3. Sensitive customer data.
4. Anything else that is not needed to reproduce the failure.

## When To Report

Report the issue after you have reduced it as far as you reasonably can and confirmed it is not just a setup mismatch or a missing local prerequisite.

## Content Outline

1. Identify the symptom.
2. List likely causes in order.
3. Provide diagnostic commands and artifact checks.
4. Explain when to report a bug and what to include.

## What Maintainers Need First

1. The failure mode.
2. The config and version details.
3. The artifact or log that shows the issue.
4. A reproducible path if you have one.

## Evidence To Add

- Real commands, APIs, or artifacts from the Blackbox showcase system.
- Links to related concept, guide, reference, or troubleshooting pages.
- Clear limits and prerequisites where the page touches alpha behavior.
