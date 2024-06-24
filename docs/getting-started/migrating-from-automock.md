---
sidebar_position: 3
title: Migrating from Automock
description: Migrating from Automock to Suites
---

## Introduction

Automock has evolved into Suites, marking a significant leap forward in our quest to provide a comprehensive testing
framework. This transition from Automock's culmination at version `2.1.0` to Suites' inaugural launch at version `3.0.0`
brings forth expanded functionality and enhanced support.

- To facilitate a smooth transition, Automock will continue to receive critical fixes, but its development will cease
  with version `2.1.0`, making way for the future with Suites.

- For detailed insights into this transition, including comparisons and additional context, please refer to
  our [the shift from Automock to Suites](/docs/overview/the-shift-from-automock) documentation.

## Migration Tool

**We will release a migration tool very soon to assist Automock users in migrating to Suites! 🙌**

## Changes

Transitioning from Automock to Suites introduces minimal disruptions. The primary change involves the `TestBed`
factory's migration, which now resides within `@suites/unit` instead of the individual `@suites/jest` or `@suites/sinon`
packages, previously under `@automock`.

## Historical Releases, Tags and NPM Packages

The release history and tags under the `@automock` scope will be preserved for historical reference. However, from
version `3.0.0` onwards, the focus will shift to `@suites`, reflecting our new direction and expanded scope.
