---
sidebar_position: 2
title: Test Doubles (Mocks & Stubs)
description: Understanding test doubles in Suites like mocks and stubs
---

# Mocks and Stubs

> **What this covers:** Understanding mocks, stubs, and other test doubles \
> **Time to read:** ~10 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals) \
> **Best for:** Understanding the theory behind test doubles after hands-on experience with solitary testing

When you write unit tests, you need to replace real dependencies with fake versions you can control. These fake versions are called **test doubles**. This guide explains the different types of test doubles, with a focus on **mocks** and **stubs**, and shows you how Suites automatically create them for you.

## Overview

This guide covers:

1. What test doubles are and the common types
2. How Suites uses the terms "mocks" and "stubs"
3. Why some dependencies can be replaced and others cannot
4. Two ways to verify your tests work correctly
5. How Suites automatically generates mocks for you
6. When to use real implementations instead of test doubles

## What Are Test Doubles?

A **test double** is a fake version of a dependency that you use in your tests. Think of it like a stunt double in a movie - it stands in for the real thing so you can control what happens.

Test doubles help you:
- Control what your dependencies return
- Isolate the code you want to test
- Avoid side effects like database writes or API calls

**Common types of test doubles:**

- **Stub**: Returns a predetermined response when called
- **Mock**: A fake class where you can verify method calls
- **Spy**: Records information about how it was called (wraps the real object)
- **Fake**: A simplified working version (like an in-memory database)

:::info
Suites follows [Martin Fowler's test double patterns](https://martinfowler.com/bliki/TestDouble.html), using the vocabulary from Gerard Meszaros's xUnit Test Patterns.
:::

## How Suites Uses "Mocks" and "Stubs"

Suites uses these terms in a specific way:

**Mock:** A fake replacement of an entire class. When Suites creates a mock, all the methods in that class become stubs.

```typescript
const repo: Mocked<UserRepository> = unitRef.get(UserRepository);
// repo is a mock - a fake version of UserRepository
// All its methods (findById, save, etc.) are now stubs
```

**Stub:** A single method that returns a value you specify.

```typescript
repo.findById.mockResolvedValue(testUser);
// findById is now a stub that returns testUser
```

**Simple rule:** When you see `Mocked<UserRepository>`, it means you have a mock (fake class) where all methods are stubs (fake methods).

## Dependencies: What Can Be Replaced?

Suites can only create test doubles for **explicit dependencies** - dependencies that are passed in through the constructor or method parameters. It cannot replace **implicit dependencies** - things that are imported directly at the top of a file.

**Explicit dependencies** (Suites can replace these):

```typescript
@Injectable()
export class UserService {
  constructor(
    private database: Database,        // ✅ Suites can create a mock
    private emailService: EmailService // ✅ Suites can create a mock
  ) {}
}
```

**Implicit dependencies** (Suites cannot replace these):

```typescript
import { sendEmail } from './email-utils';  // ❌ Direct import

@Injectable()
export class UserService {
  createUser(data: UserData) {
    sendEmail(data.email);  // ❌ Always runs the real code
  }
}
```

When there are implicit dependencies, they always execute the real code during tests because Suites has no way to intercept them.

:::tip
Not all implicit dependencies are a problem. Simple utility functions like `Math.floor()` or `formatDate()` are fine. 
But operations that touch the network, database, or file system should be explicit dependencies so you can replace them in tests.
:::

## Two Ways to Verify Tests

You can verify that your code works correctly in two different ways:

**State Verification:**
Check what the final result is, not how you got there.

```typescript
repo.findById.mockResolvedValue(testUser);
const result = await service.getUserName(1);
expect(result).toBe('John Doe');  // Did we get the right answer?
```

**Behavior Verification:**
Check that the right methods were called with the right arguments.

```typescript
await service.createUser(userData);
expect(repo.save).toHaveBeenCalledWith(userData);  // Was save() called correctly?
```

Both approaches work well with Suites. Choose the one that makes sense for what you're testing.

:::note Common Pitfalls
Using `spyOn()` or manual mocks (`jest.mock()`/`vitest.mock()`) frequently, usually means the code has too many 
implicit dependencies. Consider refactoring to use explicit dependencies instead (pass dependencies in through the constructor)
:::

## Using Mocks in Suites

Suites automatically creates mocks for all dependencies.

```typescript
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
const repo = unitRef.get(UserRepository);  // Automatically a mock!

// Now configure what the stub methods should return
repo.findById.mockResolvedValue(testUser);
```

For more details on configuration options, see:

- [Mock Configuration](/docs/api-reference/mock-configuration) - Using `.mock().final()` and `.mock().impl()`
- [Types](/docs/api-reference/types) - Details about the `Mocked<T>` type
- [mock() function](/docs/api-reference/mock) - Creating mocks manually

## Testing with Real Implementations

Sometimes you want to test how multiple components work together using real code, not mocks. Use sociable tests for this:

```typescript
const { unit } = await TestBed.sociable(UserService)
  .expose(UserRepository)  // Use the real UserRepository
  .compile();

// Now both UserService and UserRepository use real implementations
const result = await unit.createUser(userData);
expect(result.id).toBeDefined();  // Real database logic executed
```

See [Sociable Unit Tests](/docs/guides/sociable) for more information.

## Summary

### Quick Reference

| Term                    | What It Means                                                | Example                                 |
|-------------------------|--------------------------------------------------------------|-----------------------------------------|
| **Test Double**         | Any fake replacement for a real dependency                   | Any mock, stub, spy, fake, or dummy     |
| **Mock**                | A fake version of an entire class (all methods are stubs)    | `Mocked<UserRepository>`                |
| **Stub**                | A fake method that returns a predetermined value             | `repo.findById.mockResolvedValue(user)` |
| **Spy**                 | A stub that also records how it was called                   | `jest.spyOn()` - not recommended        |
| **Explicit Dependency** | Passed in through constructor or parameters                  | `constructor(private db: Database)`     |
| **Implicit Dependency** | Imported directly at the top of the file                     | `import { sendEmail } from './utils'`   |

### Takeaways

- **Test doubles** are fake versions of dependencies that enable control during tests
- **In Suites**: A "mock" is a fake class where all methods are "stubs"
- **Two verification styles**: Check the final result (state) or check method calls (behavior)
- **Automatic mocking**: Suites creates mocks for all dependencies automatically with full type safety
- **Explicit dependencies**: Only dependencies passed through constructors or parameters can be mocked

## Next Steps

Learn more about using test doubles in practice:

- **[Solitary Unit Tests](./solitary)**: Test components in complete isolation using automatic mocking
- **[Sociable Unit Tests](./sociable)**: Test multiple components together with real implementations

## Additional Resources

- **[Martin Fowler - Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)**: Classic article explaining different testing approaches