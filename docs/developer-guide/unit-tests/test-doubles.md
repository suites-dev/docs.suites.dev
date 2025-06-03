---
sidebar_position: 5
title: Test Doubles
description: Understanding test doubles and Suites' approach to testing
---

# Test Doubles

## Introduction

When writing unit tests, we often need to replace real dependencies with simpler objects that we can control. These replacements are called "test doubles" (think stunt doubles in movies). This is especially crucial for dependencies that perform I/O or have complex internal logic, which should be [isolated behind clear boundaries](../design-for-testability/boundaries-interactions.md). While there are several types of test doubles in testing literature, Suites takes an opinionated approach to help you write more maintainable tests.

## Origins in Testing Theory

The terminology and concepts around test doubles were formalized by Gerard Meszaros and popularized by Martin Fowler in his influential article [Test Double](https://martinfowler.com/bliki/TestDouble.html). Fowler defines a test double as "any case where you replace a production object for testing purposes."

In Fowler's article [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html), he distinguishes between different types of test doubles:

> "Meszaros uses the term Test Double as the generic term for any kind of pretend object used in place of a real object for testing purposes. The name comes from the notion of a Stunt Double in movies."

Fowler describes different types of test doubles, including dummies, fakes, stubs, spies, and mocks, each serving distinct purposes in testing. He also highlights a key distinction between:

- **State verification**: Testing the resulting state after a method is called (used with stubs)
- **Behavior verification**: Testing the interactions between objects (used with mocks)

Suites builds upon these theoretical foundations but adopts a simpler, more pragmatic approach focused on outcomes rather than implementation details.

## Terminology Clarification

Before diving deeper, let's clarify some terminology as it's used in Suites:

- **Test Double**: Generic term for any object that replaces a real dependency in tests
- **Stub**: A replacement that provides predefined responses to method calls
- **Mock**: In traditional testing literature, a mock is a type of test double that verifies interactions. In Suites, we use the term "mock" to refer to a collection of stubs that replaces a dependency class. Each method in the mock is a stub with controllable behavior.

When you see `Mocked<UserRepository>` in Suites, it refers to a complete replacement of the `UserRepository` class where each method has been replaced with a stub.

## Suites' Philosophy on Test Doubles

In Suites, we believe that the best unit tests focus on behavior and outcomes rather than implementation details. This belief shapes our approach to test doubles and is strongly supported by [designing for testability](../design-for-testability/index.md) from the outset:

1. We generate **mocks** (collections of stubs) for dependencies in solitary tests. This is most effective when dependencies are [injected via constructors](../design-for-testability/dependencies-side-effects.md#constructor-only-injection) and units have [clear responsibilities](../design-for-testability/unit-clarity-responsibility.md).
2. We use **real implementations** with [sociable tests](/docs/developer-guide/unit-tests/sociable) for testing interactions
3. We discourage interaction verification with stubs as it often leads to brittle tests

### Why We Focus on Stubs for Responses

Stubs provide predefined responses to method calls, which allows tests to:
- Focus on the "what" (behavior) rather than the "how" (implementation)
- Make tests more resilient to implementation changes
- Create simpler and more maintainable tests

### Why We Avoid Interaction Verification

While some testing approaches emphasize verifying how methods are called (sometimes called "behavior verification"), we find this often leads to:
- Tests that are tightly coupled to implementation details
- Brittle tests that break when internal implementations change
- More complex test maintenance

Instead of verifying method call patterns, we recommend:
1. Using stubs to control responses in solitary tests
2. Using [sociable unit tests](/docs/developer-guide/unit-tests/sociable) with real implementations when you need to test interactions

## Using Mocks in Suites

### Basic Example

Here's a simple example of using mocks in a solitary test:

```typescript
import { TestBed, Mocked } from '@suites/unit';

describe('UserService Tests', () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>; // A mock with stubbed methods

  beforeAll(async () => {
    // Create test environment with automatic mocking
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    
    userService = unit;
    userRepository = unitRef.get(UserRepository); // Get the mock
  });

  it('should return user name when user exists', async () => {
    // Configure the stubbed method's response
    userRepository.findById.mockResolvedValue({
      id: 1,
      name: 'John Doe'
    });

    // Test the behavior
    const result = await userService.getUserName(1);
    expect(result).toBe('John Doe');
  });
});
```

### Configuring Mock Behavior

Suites provides two ways to configure the behavior of methods in your mocks:

1. **Using `.mock().final()`** - For immutable responses:
```typescript
const { unit } = await TestBed.solitary(UserService)
  .mock(UserRepository) // Specify which dependency to configure
  .final({
    // Define behavior for specific methods
    findById: async () => ({ id: 1, name: 'John Doe' })
  })
  .compile();
```

2. **Using `.mock().impl()`** - For flexible responses:
```typescript
const { unit, unitRef } = await TestBed.solitary(UserService)
  .mock(UserRepository) // Specify which dependency to configure
  .impl(stubFn => ({
    // Use the underlying mock library's function to create stubs
    findById: stubFn().mockResolvedValue({ id: 1, name: 'John Doe' })
  }))
  .compile();
```

### The `Mocked<T>` Type

Suites provides the `Mocked<T>` type to ensure type safety when working with mocks:

```typescript
import { Mocked } from '@suites/unit';

let repository: Mocked<UserRepository>;
// All methods in repository are now stubs with proper TypeScript types
```

## Testing Interactions

When you need to verify how components interact, instead of using interaction verification on stubs, use a sociable test with real implementations:

```typescript
describe('UserService Integration', () => {
  let userService: UserService;
  
  beforeAll(async () => {
    // Create test environment with real UserRepository
    const { unit } = await TestBed.sociable(UserService)
      .expose(UserRepository)  // Use real implementation
      .compile();
    
    userService = unit;
  });

  it('should integrate with real repository', async () => {
    const result = await userService.getUserName(1);
    expect(result).toBe('John Doe');
  });
});
```

## What's Next?

Now that you understand Suites' approach to test doubles:

- Learn how to write [solitary unit tests](/docs/developer-guide/unit-tests/solitary) using mocks with stubbed methods
- Discover when and how to use [sociable unit tests](/docs/developer-guide/unit-tests/sociable) for testing interactions
- Explore the [Suites API](/docs/developer-guide/unit-tests/suites-api) for advanced mock configuration
