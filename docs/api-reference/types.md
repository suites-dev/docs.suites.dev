---
sidebar_position: 6
title: Types
description: TypeScript types and interfaces used in Suites
---

# Types

TypeScript type definitions used throughout Suites.

## Core Types

### `Mocked<T>`

A deeply nested mock type. All methods become mock functions, nested objects are mocked recursively.

```typescript
interface UserService {
  repository: {
    find(id: string): User;
    save(user: User): void;
  };
  validate(user: User): boolean;
}

const service: Mocked<UserService> = unitRef.get(UserService);

// All methods mocked, including nested
service.validate.mockReturnValue(true);
service.repository.find.mockResolvedValue(testUser);
service.repository.save.mockReturnValue(undefined);
```

## How `Mocked<T>` Works: Module Augmentation

The `Mocked<T>` type is **always imported from `@suites/unit`**, never from adapter packages. Suites uses TypeScript's module augmentation to automatically provide the correct library-specific types.

### Single Import Point

```typescript
// ✅ Always import from @suites/unit
import { Mocked } from '@suites/unit';

// ❌ Never import from adapter packages
// import { Mocked } from '@suites/doubles.jest';  // Wrong!
```

### Automatic Type Resolution

When an adapter package (like `@suites/doubles.jest`) is installed, it automatically augments the `@suites/unit` module with library-specific types:

```typescript
// @suites/doubles.jest/unit.d.ts (internal - you never see this)
declare module '@suites/unit' {
  export type Mocked<T> = jest.Mocked<T>;  // Overrides base type
}
```

This means the same `Mocked<T>` import resolves to different concrete types based on which adapter is installed.

:::tip Zero Configuration
This works automatically when you install an adapter package. No manual configuration needed - TypeScript resolves the correct types based on your installed dependencies.
:::

### Why This Architecture Matters

**Because Suites is framework agnostic**. The same test code works across Jest, Vitest, and Sinon without changes. Only the installed adapter package determines which library-specific types and methods are available.

**Maintains Dependency Inversion**: The `@suites/unit` package never depends on adapter packages. Instead, adapters augment the base package - following proper dependency inversion principle.

```typescript
// This exact code works with any adapter installed
describe('UserService', () => {
  let service: UserService;
  let database: Mocked<Database>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    service = unit;

    // Return Mocked type corresponding to installed adapter
    database = unitRef.get(Database); 
  });
});
```

## See Also

- [UnitReference](/docs/api-reference/unit-reference) - Using the UnitReference interface
- [Mock Configuration](/docs/api-reference/mock-configuration) - Configuring mocks with proper types
- [TypeScript Configuration](/docs/get-started/installation#typescript-configuration) - Setting up TypeScript for Suites