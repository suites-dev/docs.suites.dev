---
sidebar_position: 3
title: API Reference
description: "Explore the Suites API for solitary and sociable tests, typed mock creation, dependency lookups, mock configuration, and TypeScript adapter declarations."
meta_title: "TestBed, Mock Configuration, and Types API Reference"
---

API reference for setting up and managing unit tests with Suites.

<div class="in-this-section">

### Core APIs

- [**TestBed.solitary()**](/docs/api-reference/testbed-solitary/) - Create isolated unit tests where all dependencies are automatically mocked
- [**TestBed.sociable()**](/docs/api-reference/testbed-sociable/) - Test business logic interactions, keep specific dependencies real
- [**Mock Configuration**](/docs/api-reference/mock-configuration/) - Configure mock behavior with `.mock().final()` and `.mock().impl()`
- [**UnitReference**](/docs/api-reference/unit-reference/) - Access mocked dependencies in tests
- [**Standalone mocks and stubs**](/docs/api-reference/mock/) - Create test doubles outside the `TestBed` API
- [**Types**](/docs/api-reference/types/) - TypeScript type definitions

</div>

## Quick Reference

### Creating a Solitary Test
```typescript
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
```

### Creating a Sociable Test
```typescript
const { unit, unitRef } = await TestBed.sociable(UserService)
  .expose(UserApi)  // Keep UserApi real
  .compile();
```

### Configuring Mocks
```typescript
// Final configuration (injected as supplied, not retrievable via unitRef)
await TestBed.solitary(UserService)
  .mock(UserApi)
  .final({ getRandom: async () => ({ id: 1, name: 'John' }) })
  .compile();

// Flexible configuration
await TestBed.solitary(UserService)
  .mock(UserApi)
  .impl(stubFn => ({ getRandom: stubFn().mockResolvedValue({ id: 1 }) }))
  .compile();
```

### Creating Standalone Mocks
```typescript
import { mock, stub } from '@suites/doubles.jest';
// Vitest: import from '@suites/doubles.vitest'.

// Mock a full class
const userRepo = mock<UserRepository>();
userRepo.findById.mockResolvedValue(testUser);

// Create a stub function
const stubFn = stub();
stubFn.mockReturnValue(42);
```

## Quick Terminology

- **Mock**: A complete replacement of a dependency class where each method has been replaced with a stub
- **Stub**: An individual method replacement that provides predefined responses
- **Mocked\<T\>**: The type representing a mocked dependency with stubbed methods
