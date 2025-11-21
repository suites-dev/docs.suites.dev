---
sidebar_position: 2
title: Solitary Unit Tests
description: Testing in isolation with Suites
---

# Solitary Unit Tests

> **What this covers:** Writing unit tests that isolate a single component (class) using automatic mocking \
> **Time to read:** ~8 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals) \
> **Best for:** Testing component logic in complete isolation, controlling all inputs for predictable results

Solitary unit tests evaluate a single unit of work in complete isolation from its external dependencies. These tests use
mocks (collections of stubs) to replace dependencies, enabling testing of component behavior without influence from its
collaborators.

**Solitary tests are ideal when:**

- Testing the logic and behavior of a single component (class)
- Controlling all inputs to ensure predictable test results
- Developing new components and ensuring they work correctly in isolation

In contrast to [sociable unit tests](/docs/guides/sociable), where certain dependencies are real implementations, solitary tests replace all dependencies with mocks to ensure true isolation.

## Terminology

Before diving in, it is important to understand these core concepts:


* **Stub:** An individual method that returns predefined values. Configure stubs using `.mockResolvedValue()` or
  `.mockReturnValue()` (like `jest.fn()`).
* **Mock:** A replacement for a dependency class where all methods are stubs - simply a collection of stubs
* **`Mocked<T>:`** A type representing a class where all methods are stubs ([see `Mocked<T>` type](/docs/api-reference/types#mockedt)).

For a deeper understanding of test doubles, see [Test Doubles](/docs/guides/test-doubles) after completing this guide.

## Overview

This tutorial walks you through:
1. Setting up a class to test with dependencies
2. Writing your first solitary test with automatic mocking
3. Configuring mock behavior for different test scenarios

## Step 1: Set Up the Class Under Test

This example tests `UserService` which depends on `UserApi` and `Database`:

```typescript title="user.service.ts"
@Injectable()
class UserService {
  constructor(
    private readonly userApi: UserApi,  // < This considered dependency
    private readonly database: Database // < This considered dependency
  ) {}

  async generateRandomUser(): Promise<number> {
    const randomUser = await this.userApi.getRandom();
    return this.database.saveUser(randomUser);
  }
}
```

## Step 2: Write the First Solitary Test

This example demonstrates writing a solitary unit test for the `UserService` class:

```typescript title="user.service.spec.ts" {1,13,15,18-19} showLineNumbers
import { TestBed, type Mocked } from '@suites/unit';
import { UserService, UserApi, Database } from './services';

describe('UserService Tests', () => {
  let userService: UserService; // Class under test

  // Declare the mock instances
  let userApi: Mocked<UserApi>; 
  let database: Mocked<Database>;

  beforeAll(async () => {
    // Create the test environment with automatic mocking
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();

    userService = unit;
    
    // Retrieve the mock instances
    userApi = unitRef.get(UserApi);
    database = unitRef.get(Database);
  });

  it('should generate a random user and save to the database', async () => {
    // Configure the stubbed methods to return predefined values
    userApi.getRandom.mockResolvedValue({ id: 1, name: 'John' } as User);
    database.saveUser.mockResolvedValue(42);

    // Test the outcome, not the implementation details
    const result = await userService.generateRandomUser();
    
    // Verify the result is what we expect (the return value from database.saveUser)
    expect(result).toBe(42);
  });
});
```

### What Just Happened?

The test setup uses `TestBed.solitary()` to create an isolated testing environment:

1. **TestBed analyzes the class** - Reads `UserService` constructor to find `UserApi` and `Database` dependencies
2. **Automatic mocks are created** - Generates mock instances of `UserApi` and `Database` with all methods as stubs
3. **Dependencies are injected** - Wires the mocks into `UserService` constructor automatically
4. **Type-safe access** - Use `unitRef.get()` to retrieve mocks with full TypeScript support

No manual mock creation needed. `TestBed` handles dependency discovery, mock generation, and wiring automatically.

### Automatic Mocking of Dependencies

When using `TestBed.solitary()`, all dependencies are automatically mocked. Each method becomes a stub with no predefined responses. Configure stub responses in tests as needed.

```typescript
// These stubs start with no return values
userApi.getRandom  // Returns undefined by default
database.saveUser  // Returns undefined by default

// Configure them in your tests
userApi.getRandom.mockResolvedValue({ id: 1, name: 'John' });
database.saveUser.mockResolvedValue(42);
```

:::info Suites Virtual Test Container
See [Virtual Test Container](/docs/guides/virtual-test-container) for how this works under the hood.
:::

## Step 3: Configure Mock Behavior

Configure mocks before or after calling `.compile()` depending on test needs:

```typescript
// Configure after compile (most common)
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.solitary(UserService).compile();
  userService = unit;
  userApi = unitRef.get(UserApi);
});

it('test case', () => {
  userApi.getRandom.mockResolvedValue({ id: 1, name: 'John' });
  // ... test logic
});
```

:::info
For advanced configuration options, see [Mock Configuration](/docs/api-reference/mock-configuration).
:::

## Summary

- **Solitary tests** evaluate a single unit in complete isolation from dependencies
- **Automatic mocking** with `TestBed.solitary()` eliminates manual mock setup
- **Virtual container** creates only the mocks needed, not the full framework
- **Type safety** with `Mocked<T>` ensures stub methods are properly typed
- **Configure stubs** in your tests to control dependency behavior
- **Use solitary tests** when you need complete control over inputs and want predictable results

## Next Steps

For testing how components work together, explore different approaches:

- **[Sociable Unit Tests](/docs/guides/sociable)**: Test multiple classes together with controlled collaboration
- **[Test Doubles](/docs/guides/test-doubles)**: Understand mocks, stubs, and spies in depth

## Additional Resources

- **[API Reference - TestBed.solitary](/docs/api-reference/testbed-solitary)**: Complete API documentation for TestBed.solitary()
- **[API Reference - Mock Configuration](/docs/api-reference/mock-configuration)**: Advanced mock configuration options
- **[API Reference - Types](/docs/api-reference/types)**: TypeScript type definitions including `Mocked<T>`
