---
sidebar_position: 7
title: Migrating from Automock
description: Migrating from Automock to Suites
---

## Introduction

As technology and development practices evolve, so too must the tools that support them. Automock has been at the
forefront of simplifying unit testing by providing a streamlined approach to creating mocks and stubs within various
dependency injection frameworks. Building on the strong foundation laid by Automock, we are excited to introduce its
successor: Suites. This evolution marks a significant milestone in our journey to enhance and expand the capabilities of
our testing tools to better meet the needs of modern software development.

## The Shift from Automock

Version `3.0.0` of Suites is the first release after Automock's `v2.1.0` completion, and it comes with it more features and
better support. Automock will still get critical fixes until version `v2.1.0`, when development will stop to make way for
Suites. This will help with the transition.

## Migration

:::info
**We will release a migration tool very soon to assist Automock users in migrating to Suites! 🙌**
:::

## Changes

Transitioning from Automock to Suites introduces minimal disruptions. The primary change involves the `TestBed`
factory's migration, which now resides within `@suites/unit` instead of the individual `@suites/jest` or `@suites/sinon`
packages, previously under `@automock`.

## Key Changes from Automock to Suites

### Versioning

- Automock stopped at version `2.1.0`, and will receive critical bug fixes only.
- Suites will continue from version `3.0.0` to avoid confusion.

### Change Log

**`TestBed.compile()` is now async**: Due to dynamic importing, thus, need `async` / `await`.

**`TestBed.create()` is now `TestBed.solitary()`**: This is because there is also sociable and for strong semantics.

**New `.sociable()` method**: Added to the TestBed API.

**Unified TestBed import**: TestBed is now exported from the same package regardless of the installed adapters.
  Instead of importing from `@automock/jest` or `@automock/sinon`, now import from `@suites/unit`.

**Mocked type**: Introducing the `Mocked` type from `@suites/unit`, which provides deep partial mock capabilities,
  allowing for deep mocks of properties within the class.

**API Changes in TestBed**:
 - `.mock.using` is now `.mock.impl` and `.mock.final`.
 - `.mock.impl` provides runtime stubs within the callback, eliminating the need for library-specific mock functions
    like `jest.fn()` or `sinon.stub()`.
 - `.mock.final` is similar but without stubs and cannot be retrieved from the unit reference.

### New Features

- **Support for Vitest and ESM**: Suites now supports Vitest and ECMAScript Modules (ESM).

## Historical Releases, Tags, and NPM Packages

The release history and tags under the `@automock` scope will be preserved for historical reference. However, from
version `3.0.0` onwards, the focus will shift to `@suites`, reflecting our new direction and expanded scope.
  