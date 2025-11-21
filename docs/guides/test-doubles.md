---
sidebar_position: 3
title: Test Doubles
description: Understanding test doubles in Suites
---

# Test Doubles

> **What this covers:** Deep dive into test double concepts (stubs, mocks, spies, fakes) and when to use each \
> **Time to read:** ~10 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals), [Solitary Unit Tests](/docs/guides/solitary) \
> **Best for:** Understanding the theory behind test doubles after hands-on experience with solitary testing

Test doubles replace real dependencies in your tests with fake versions you can control. This guide explains the
different types of test doubles and how Suites automatically generates them for you.

## Overview

This guide covers:

1. What test doubles are and common types (stubs, mocks, spies, fakes)
2. Terminology used in Suites
3. Understanding explicit vs implicit dependencies
4. Two testing approaches: state vs behavior verification
5. Using mocks in Suites with automatic generation
6. Testing interactions with real implementations

## What Are Test Doubles?

Test doubles replace real dependencies in tests. They let you control inputs and isolate the code you're testing.

**Common types:**

- **Stub**: Returns predefined responses
- **Mock**: Verifies interactions (method calls)
- **Spy**: Wraps real object to track calls
- **Fake**: Simplified working implementation

:::info
Suites' test double implementation follows [Martin Fowler's test double patterns](https://martinfowler.com/bliki/TestDouble.html), using Gerard Meszaros's vocabulary from xUnit Test Patterns.
:::

## Terminology in Suites

Suites uses specific terminology:

**Mock:** A complete replacement of a dependency class where each method becomes a stub.

```typescript
const repo: Mocked<UserRepository> = unitRef.get(UserRepository);
// All methods are stubs you can configure
```

**Stub:** An individual method that returns predefined responses.

```typescript
repo.findById.mockResolvedValue(testUser);  // This method is a stub
```

**When you see `Mocked<UserRepository>`, it means a class where all methods are stubs.**

## Understanding Dependencies

Test doubles only work with **explicit dependencies**, those passed through constructor or method parameters. TestBed
cannot intercept **implicit dependencies** that are imported directly.

**Explicit dependencies** (TestBed has control):

```typescript

@Injectable()
export class UserService {
  constructor(
    private database: Database,        // ✅ TestBed can mock or expose
    private emailService: EmailService // ✅ TestBed can mock or expose
  ) {
  }
}
```

**Implicit dependencies** (`TestBed` cannot control):

```typescript
import { sendEmail } from './email-utils';  // ❌ Direct import

@Injectable()
export class UserService {
  createUser(data: UserData) {
    sendEmail(data.email);  // ❌ Always executes real code
  }
}
```

When you have implicit dependencies, they become **implicit collaborations**. They always execute during tests because
TestBed has no way to intercept them.

:::tip
Not all implicit collaborations are bad. Pure functions (like `Math.floor()` or `formatDate()`) are fine. But I/O
operations (network, database, files) should be explicit dependencies.
:::

## Two Testing Approaches

Suites supports both state and behavior verification:

**State Verification:**
Test the outcome, not how you got there.

```typescript
repo.findById.mockResolvedValue(testUser);
const result = await service.getUserName(1);
expect(result).toBe('John Doe');  // Verify state
```

**Behavior Verification:**
Test the interactions between objects.

```typescript
await service.createUser(userData);
expect(repo.save).toHaveBeenCalledWith(userData);  // Verify interaction
```

Both work with Suites. Choose based on what you're testing.

:::note Common Pitfalls
Traditional testing often relies on `spyOn()` and manual mocks (`jest.mock()`/`vitest.mock()`), which can indicate
architectural issues with implicit dependencies.
:::

## Using Mocks in Suites

Suites automatically generates mocks for all dependencies:

```typescript
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
const repo = unitRef.get(UserRepository);  // Auto-generated mock

// Configure stub responses
repo.findById.mockResolvedValue(testUser);
```

For configuration options, see:

- [Mock Configuration](/docs/api-reference/mock-configuration) - `.mock().final()` and `.mock().impl()`
- [Types](/docs/api-reference/types) - `Mocked<T>` type details
- [mock() function](/docs/api-reference/mock) - Creating standalone mocks

## Testing Interactions

To test how components work together, use sociable tests with real implementations:

```typescript
const { unit } = await TestBed.sociable(UserService)
  .expose(UserRepository)  // Real implementation
  .compile();

// Test real interaction between UserService and UserRepository
const result = await unit.createUser(userData);
expect(result.id).toBeDefined();  // Real logic executed
```

See [Sociable Unit Tests](/docs/guides/sociable) for details.

## Summary

### Quick Reference

| Term                    | Definition                                                   | Example                                 |
|-------------------------|--------------------------------------------------------------|-----------------------------------------|
| **Test Double**         | Generic term for any dependency replacement                  | Any mock, stub, spy, fake, or dummy     |
| **Mock**                | Complete class replacement with stubbed methods              | `Mocked<UserRepository>`                |
| **Stub**                | Individual method returning predefined value                 | `repo.findById.mockResolvedValue(user)` |
| **Spy**                 | Stub that records call information (Suites avoids spies)     | `jest.spyOn()` - not recommended        |
| **Explicit Dependency** | Constructor/parameter injected                               | `constructor(private db: Database)`     |
| **Implicit Dependency** | Direct import                                                | `import { sendEmail } from './utils'`   |

### 

- **Test doubles** replace real dependencies to isolate code and control test inputs
- **Suites terminology**: A "mock" is a class replacement where all methods are "stubs"
- **Two approaches**: State verification (test outcomes) vs behavior verification (test interactions)
- **Automatic generation**: Suites auto-generates mocks for all dependencies with type safety

## Next Steps

Explore related topics to deepen your understanding:

- **[Solitary Unit Tests](./solitary.md)**: Test components in complete isolation using automatic mocking
- **[Sociable Unit Tests](./sociable.md)**: Test multiple components together with controlled collaboration

## Additional Resources

- **[Martin Fowler - Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)**: Classic article on testing approaches