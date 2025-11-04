---
sidebar_position: 3
title: API Reference
description: Complete API reference for Suites testing framework
---

# API Reference

API reference for setting up and managing unit tests with Suites.

<div class="in-this-section">

## Core APIs

- [**TestBed.solitary()**](/docs/api-reference/testbed-solitary) - Create isolated unit tests where all dependencies are automatically mocked
- [**TestBed.sociable()**](/docs/api-reference/testbed-sociable) - Test business logic interactions with `.boundaries()` <span class="version-badge version-badge--new">v4.0.0+</span> or `.expose()`
- [**Mock Configuration**](/docs/api-reference/mock-configuration) - Configure mock behavior with `.mock().final()` and `.mock().impl()`
- [**mock() and stub()**](/docs/api-reference/mock) - Create standalone mocks outside TestBed
- [**UnitReference**](/docs/api-reference/unit-reference) - Access mocked dependencies in tests
- [**Types**](/docs/api-reference/types) - TypeScript type definitions
- [**Fail-Fast Behavior**](/docs/api-reference/fail-fast) <span class="version-badge version-badge--new">v4.0.0+</span> - Prevent false positives

</div>

## Quick Reference

### Creating a Solitary Test
```typescript
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
```

### Creating a Sociable Test
```typescript
// Recommended: boundaries (v4.0.0+)
const { unit, unitRef } = await TestBed.sociable(UserService)
  .boundaries([ComplexService])  // List what to avoid
  .compile();

// Alternative: expose
const { unit, unitRef } = await TestBed.sociable(UserService)
  .expose(UserApi)  // List what to keep
  .compile();
```

### Configuring Mocks
```typescript
// Final configuration (immutable)
await TestBed.solitary(UserService)
  .mock(UserApi)
  .final({ getRandom: async () => ({ id: 1, name: "John" }) })
  .compile();

// Flexible configuration
await TestBed.solitary(UserService)
  .mock(UserApi)
  .impl(stubFn => ({ getRandom: stubFn().mockResolvedValue({ id: 1 }) }))
  .compile();
```

### Creating Standalone Mocks
```typescript
import { mock, stub } from "@suites/unit";

// Mock a full class
const userRepo = mock<UserRepository>();
userRepo.findById.mockResolvedValue(testUser);

// Create a stub function
const stubFn = stub();
stubFn.mockReturnValue(42);
```

## Terminology

- **Mock**: A complete replacement of a dependency class where each method has been replaced with a stub
- **Stub**: An individual method replacement that provides predefined responses
- **Mocked\<T\>**: The type representing a mocked dependency with stubbed methods