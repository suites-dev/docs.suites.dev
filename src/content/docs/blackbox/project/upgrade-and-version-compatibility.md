---
title: "Upgrade and Version Compatibility"
description: "Document upgrade commands, compatibility guarantees, and breaking-change handling."
sidebar_position: 3
keywords: ["blackbox upgrade", "blackbox versions", "blackbox breaking changes"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Upgrade and Version Compatibility"
  secondary_keywords: ["blackbox upgrade", "blackbox versions"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Document upgrade commands, compatibility guarantees, and breaking-change handling.

This page should explain how users keep CLI behavior, report formats, schemas, and generated artifacts aligned across versions.

## Audience

Users maintaining Blackbox in a long-lived repository or CI workflow.

## What This Page Owns

1. How to check the installed version.
2. How to upgrade each supported installation path.
3. Which artifacts or schemas can change across versions.
4. How to tell whether a change is a breaking one.

## Compatibility Areas

1. CLI flags and command behavior.
2. Config file parsing and defaults.
3. Report and artifact formats.
4. Catalog and effects file schemas.
5. Package API or import surface where applicable.

## Practical Guidance

1. Read release notes before upgrading.
2. Check whether the change affects CI or generated artifacts.
3. Keep a rollback path if the repo depends on a specific format.
4. Validate the upgrade in the sample project before using it on a production repo.

## Content Outline

1. Show how to check the installed version.
2. Show the upgrade command for each supported package manager.
3. Explain compatibility across CLI flags, config files, catalog schema, report schema, and package APIs.
4. Call out migration steps for breaking changes.
5. Link release notes to upgrade guidance.

## What To Say Clearly

1. What is backward compatible.
2. What may require a migration.
3. What should be pinned in CI.
4. What users should test after upgrading.

## Evidence To Add

- Version compatibility table.
- Example upgrade and rollback commands.
- Migration notes for the first major breaking change.
