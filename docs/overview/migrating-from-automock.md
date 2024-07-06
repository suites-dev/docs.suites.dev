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

This transition from Automock's culmination at version `2.1.0` to Suites' inaugural launch at version `3.0.0` brings
forth expanded functionality and enhanced support. To facilitate a smooth transition, Automock will continue to receive
critical fixes, but its development will cease with version `2.1.0`, making way for the future with Suites.

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

## Looking Ahead

The shift from Automock to Suites is not just a change of tools but a step towards a more integrated and efficient
approach to software testing. Suites is committed to retaining all the strengths of Automock while opening new avenues
for testing capabilities.

For existing Automock users, transitioning to Suites has been made as smooth as possible. We have developed
comprehensive migration tools and documentation to ensure that your move to Suites is straightforward and beneficial.

> **Learn More**: To understand the detailed changes and how to migrate your existing projects from Automock to Suites,
> please refer to our [Migration Guide](/docs/migration-from-automock-to-suites).

We are excited about the possibilities that Suites brings to the software testing landscape and are committed to
continuing our support for the developer community in creating high-quality software more efficiently.

Thank you for being an early adopter and supporting our journey from Automock to Suites!
