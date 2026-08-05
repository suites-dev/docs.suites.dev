---
title: "Reporting a Bug"
description: "List the command output, config, environment, artifacts, and reproduction details maintainers need."
sidebar_position: 5
keywords: ["report bug", "debug blackbox", "issue template"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Reporting a Bug"
  secondary_keywords: ["report bug", "debug blackbox"]
  search_intent: "support intent from users preparing a reproducible Blackbox bug report"
  snippet_angle: "list the command, expected result, actual result, environment, artifacts, logs, and redactions maintainers need"
---

List the command output, config, environment, artifacts, and reproduction details maintainers need.

This page explains the minimum useful bug report. If maintainers cannot reproduce the issue or understand the run context, the report is not complete enough yet.

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

## What Maintainers Need First

1. The failure mode.
2. The config and version details.
3. The artifact or log that shows the issue.
4. A reproducible path if you have one.
