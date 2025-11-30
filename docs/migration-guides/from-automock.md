---
sidebar_position: 5
title: Migrating from Automock
description: Step-by-step guide to migrate from Automock to Suites. Covers dependency updates, API changes, and new features in v3.
---

# Migrating from Automock to Suites

## Introduction

Suites succeeds Automock as the actively developed testing framework. Automock stopped at version `2.1.0` and receives
critical fixes only. All new development continues in Suites, starting from version In `3.0.0`.

This guide covers the migration process from Automock to Suites, including dependency updates, API changes, and new
features.

For detailed setup instructions, see the [Installation Guide](/docs/get-started/installation).

## The Shift from Automock

Version `3.0.0` of Suites was the first release after Automock's `v2.1.0` completion, with subsequent improvements in `3.0.1` and beyond. Each new version comes with more features
and better support. Automock will continue to receive critical fixes for version `v2.1.0`, but all new development will focus on Suites.

## Migration Guide

:::info
**Automated Migration:** Codemods to automate the migration process are under development and planned for release in Q1 2025.
:::

### Step 1: Update Dependencies

Replace Automock dependencies with Suites equivalents.

See [Installation Guide](/docs/get-started/installation) for detailed adapter information:

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
import { TestBed } from '@automock/jest';
// OR
import { TestBed } from '@automock/sinon';

// After
import { TestBed, type Mocked } from '@suites/unit';
```

### Step 3: Update TestBed API Calls

Update TestBed API calls to match the new syntax. The `beforeAll` or `beforeEach` callback must be `async`:

```typescript
// Before
beforeAll(() => {
  const { unit } = TestBed.create(Service).compile();
});
```

```typescript
// After
beforeAll(async () => {
  const { unit } = await TestBed.solitary(Service).compile();
});
```

### Step 4: Update Mock Implementation

Update any mock implementation code to use the new syntax:

```typescript
// Before
TestBed.create(UserService)
  .mock(UserRepository)
  .using({
    getUserById: () => Promise.resolve({ id: 1, name: 'John' }),
  })
  .compile();

// After
await TestBed.solitary(UserService)
  .mock(UserRepository)
  .final({
    getUserById: () => Promise.resolve({ id: 1, name: 'John' }),
  })
  .compile();

// OR using .impl() for more flexibility
await TestBed.solitary(UserService)
  .mock(UserRepository)
  .impl((stubFn) => ({
    getUserById: stubFn().mockResolvedValue({ id: 1, name: 'John' }),
  }))
  .compile();
```

## Major Changes from Automock to Suites

### Versioning

- Automock stopped at version `2.1.0`, and will receive critical bug fixes only.
- Suites started at version `3.0.0` and is currently at `3.0.1+`, continuing active development.

### Breaking Changes

**`TestBed.compile()` is now async**: Due to dynamic importing, you must use `async`/`await` with `compile()`:

```typescript
// Before
const { unit } = TestBed.create(Service).compile();
```

```typescript
// After
const { unit } = await TestBed.solitary(Service).compile();
```

**`TestBed.create()` is now `TestBed.solitary()`**: This change supports the distinction between solitary and sociable testing approaches. See [Solitary API](/docs/api-reference/testbed-solitary).

* **New `.sociable()` method**: Added to the TestBed API for testing with real implementations of select dependencies. See [Sociable API](/docs/api-reference/testbed-sociable).

* **Unified TestBed import**: TestBed is now exported from `@suites/unit` regardless of the installed adapters.
Instead of importing from `@automock/jest` or `@automock/sinon`, now import from `@suites/unit`.

* **Mocked type**: The new `Mocked<T>` type from `@suites/unit` provides deep partial mock capabilities,
allowing for deep mocks of properties within the class.

**API Changes in TestBed**:

- `.mock.using` is now `.mock.impl` and `.mock.final`.
- `.mock.impl` provides runtime stubs within the callback, eliminating the need for library-specific mock functions
  like `jest.fn()` or `sinon.stub()`.
- `.mock.final` is similar but without stubs and cannot be retrieved from the unit reference.

See [Mock Configuration API](/docs/api-reference/mock-configuration) for complete details.

### New Features

- **Support for Vitest and ESM**: Suites now supports Vitest and ECMAScript Modules (ESM).
- **Sociable Unit Testing**: Test with real implementations of selected dependencies. See [Sociable Unit Tests](/docs/guides/sociable).
- **Enhanced Type Safety**: Improved TypeScript support with the `Mocked<T>` type. See [Types API](/docs/api-reference/types).

## Troubleshooting Common Migration Issues

### Async/Await Errors

Errors like `TypeError: Cannot read properties of undefined (reading 'get')` indicate missing `await` with `TestBed.solitary().compile()`.

### Type Errors with Mocked

Type errors with mocked dependencies require using the new `Mocked<T>` type from `@suites/unit`.

See [Types API Reference](/docs/api-reference/types) for details:

```typescript
// Before
import { UserRepository } from './user.repository';
let userRepo: jest.Mocked<UserRepository>;
```

```typescript
// After
import { Mocked } from '@suites/unit';
import { UserRepository } from './user.repository';
let userRepo: Mocked<UserRepository>;
```

### Missing Dependencies

Errors about missing dependencies indicate that adapter packages need installation.

See [Installation Guide](/docs/get-started/installation#supported-libraries-adapters) for the complete list of adapters.

## Historical Releases and NPM Packages

The release history and NPM packages under the `@automock` scope will be preserved for historical reference. However, all new features and improvements will be released under the `@suites` scope.

For more information, see the [Suites release notes](https://github.com/suites-dev/suites/releases).
