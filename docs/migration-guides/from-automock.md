---
sidebar_position: 5
title: From Automock
description: Migrating from Automock to Suites
---

## Introduction

As technology and development practices evolve, so do the tools that support them. Building on the strong
foundation laid by Automock, we are excited to introduce its successor: Suites.
This evolution marks a significant milestone in our journey to enhance and expand the capabilities of our testing tools
to better meet the needs of modern software development.

## The Shift from Automock

Version `3.0.0` of Suites was the first release after Automock's `v2.1.0` completion, with subsequent improvements in `3.0.1` and beyond. Each new version comes with more features
and better support. Automock will continue to receive critical fixes for version `v2.1.0`, but all new development will focus on Suites.

## Migration Guide

:::info
**A migration tool is coming soon to assist Automock users in migrating to Suites! 🙌**
:::

### Step 1: Update Dependencies

Replace your Automock dependencies with their Suites equivalents:

```bash
# Remove Automock packages
npm uninstall @automock/jest @automock/sinon

# Install Suites core
npm install --save-dev @suites/unit

# Install adapters based on your setup
npm install --save-dev @suites/doubles.jest @suites/di.nestjs
# OR
npm install --save-dev @suites/doubles.sinon @suites/di.inversify
# OR
npm install --save-dev @suites/doubles.vitest @suites/di.nestjs
```

### Step 2: Update Imports

Change all imports from Automock packages to the unified Suites import:

```typescript
// Before
import { TestBed } from "@automock/jest";
// OR
import { TestBed } from "@automock/sinon";

// After
import { TestBed, Mocked } from "@suites/unit";
```

### Step 3: Update TestBed API Calls

Update your TestBed API calls to match the new syntax:

```typescript
// Before
const { unit } = TestBed.create(Service).compile();

// After
const { unit } = await TestBed.solitary(Service).compile();
```

### Step 4: Update Mock Implementation

Update any mock implementation code to use the new syntax:

```typescript
// Before
TestBed.create(UserService)
  .mock(UserRepository)
  .using({
    getUserById: () => Promise.resolve({ id: 1, name: "John" }),
  })
  .compile();

// After
await TestBed.solitary(UserService)
  .mock(UserRepository)
  .final({
    getUserById: () => Promise.resolve({ id: 1, name: "John" }),
  })
  .compile();

// OR using .impl() for more flexibility
await TestBed.solitary(UserService)
  .mock(UserRepository)
  .impl((stubFn) => ({
    getUserById: stubFn().mockResolvedValue({ id: 1, name: "John" }),
  }))
  .compile();
```

## Key Changes from Automock to Suites

### Versioning

- Automock stopped at version `2.1.0`, and will receive critical bug fixes only.
- Suites started at version `3.0.0` and is currently at `3.0.1+`, continuing active development.

### Breaking Changes

**`TestBed.compile()` is now async**: Due to dynamic importing, you must use `async`/`await` with `compile()`:

```typescript
// Before
const { unit } = TestBed.create(Service).compile();

// After
const { unit } = await TestBed.solitary(Service).compile();
```

**`TestBed.create()` is now `TestBed.solitary()`**: This change supports the distinction between solitary and sociable testing approaches.

**New `.sociable()` method**: Added to the TestBed API for testing with real implementations of select dependencies.

**Unified TestBed import**: TestBed is now exported from `@suites/unit` regardless of the installed adapters.
Instead of importing from `@automock/jest` or `@automock/sinon`, now import from `@suites/unit`.

**Mocked type**: The new `Mocked<T>` type from `@suites/unit` provides deep partial mock capabilities,
allowing for deep mocks of properties within the class.

**API Changes in TestBed**:

- `.mock.using` is now `.mock.impl` and `.mock.final`.
- `.mock.impl` provides runtime stubs within the callback, eliminating the need for library-specific mock functions
  like `jest.fn()` or `sinon.stub()`.
- `.mock.final` is similar but without stubs and cannot be retrieved from the unit reference.

### New Features

- **Support for Vitest and ESM**: Suites now supports Vitest and ECMAScript Modules (ESM).
- **Sociable Unit Testing**: Test with real implementations of selected dependencies.
- **Enhanced Type Safety**: Improved TypeScript support with the `Mocked<T>` type.

## Troubleshooting Common Migration Issues

### Async/Await Errors

If you see errors like `TypeError: Cannot read properties of undefined (reading 'get')`, ensure you're using `await` with `TestBed.solitary().compile()`.

### Type Errors with Mocked

If you encounter type errors with mocked dependencies, make sure you're using the new `Mocked<T>` type from `@suites/unit`:

```typescript
// Before
import { UserRepository } from "./user.repository";
let userRepo: jest.Mocked<UserRepository>;

// After
import { Mocked } from "@suites/unit";
import { UserRepository } from "./user.repository";
let userRepo: Mocked<UserRepository>;
```

### Missing Dependencies

If you're seeing errors about missing dependencies, ensure you've installed all the necessary adapter packages for your setup.

## Historical Releases and NPM Packages

The release history and NPM packages under the `@automock` scope will be preserved for historical reference. However, all new features and improvements will be released under the `@suites` scope.

For more information, see the [Suites release notes](https://github.com/suites-dev/suites/releases).
