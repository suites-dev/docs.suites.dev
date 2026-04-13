---
sidebar_position: 2
title: "Test Doubles in Suites: Mocks, Stubs, Spies, Fakes Explained"
description: Test doubles are stand-ins for real dependencies in unit tests. This guide explains mocks, stubs, spies, and fakes, with TypeScript examples using Suites.
keywords: [ test doubles, mocks, stubs, spies, fakes, mocks vs stubs, typescript testing, unit testing, martin fowler test doubles ]
---

# Test Doubles: Mocks, Stubs, Spies, and Fakes

> **What this covers:** What test doubles are, the four main types, when to use each, and how Suites generates them
> automatically for TypeScript backends. \
> **Time to read:** ~10 minutes \
> **Prerequisites:** Familiarity with unit testing concepts. New to Suites? Start with
> the [Quickstart](/docs/get-started/quickstart). \
> **Best for:** Understanding the theory behind test doubles after hands-on experience with solitary testing

A **test double** is a stand-in object you use in a unit test in place of a real dependency (a database, an HTTP client,
a third-party SDK), so the test stays fast, deterministic, and isolated from the outside world.

The term comes from [Gerard Meszaros's _xUnit Test Patterns_](http://xunitpatterns.com/Test%20Double.html) and was
popularised by [Martin Fowler's "Mocks Aren't Stubs"](https://martinfowler.com/articles/mocksArentStubs.html). Both
works distinguish four common kinds of test double:

| Type     | What it does                                                          | Typical use                                                                             |
|----------|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| **Stub** | Returns a hard-coded value when called. No verification.              | Make a dependency return what your test needs.                                          |
| **Mock** | Records calls so the test can assert *how* the dependency was used.   | Verify the system-under-test called `repo.save()` exactly once with the right argument. |
| **Spy**  | Wraps a real object, records calls, but lets the real method execute. | Observe behaviour without changing it.                                                  |
| **Fake** | A working but simplified implementation (e.g. in-memory database).    | When the real dependency is too heavy but a stub would lose too much realism.           |

The distinction that catches most people out: a **stub** answers *queries*, a **mock** verifies *commands*. Fowler calls
this _state verification_ vs _behaviour verification_. If you're unsure which you need, you almost always want a stub.

## Why test doubles matter

Without them, a "unit" test ends up exercising your entire dependency tree: the database, the network, the file system.
The result is slow, flaky, and tells you very little about the unit you actually changed. Test doubles let you isolate
one piece of code, make its environment deterministic, and assert on it precisely.

## Test doubles in Suites

Writing test doubles by hand is repetitive: for every dependency, you build a fake class, stub each method, wire it into
your DI container. Suites does this automatically. Given a class with constructor-injected dependencies, Suites
generates a fully-mocked version of every dependency, no manual `jest.fn()` calls, no hand-rolled fakes.

```typescript
import { TestBed, Mocked } from '@suites/unit';

const { unit, unitRef } = await TestBed.solitary(UserService).compile();
const repo: Mocked<UserRepository> = unitRef.get(UserRepository);

repo.findById.mockResolvedValue(testUser);  // stub a return value
await unit.activateUser('123');
expect(repo.save).toHaveBeenCalledWith(testUser);  // verify a call
```

That's it - `UserRepository` was generated as a mock with every method pre-stubbed. No setup file, no manual mock
factory.

> **Try it:** Set up Suites and write your first test in under five minutes. See
> the [Quickstart](/docs/get-started/quickstart).

The rest of this guide explains how Suites uses the terms _mock_ and _stub_, which dependencies it can and can't
replace, and how to choose between state and behaviour verification in practice.

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

**Simple rule:** When you see `Mocked<UserRepository>`, it means you have a mock (fake class) where all methods are
stubs (fake methods).

## Dependencies: What Can Be Replaced?

Suites can only create test doubles for **explicit dependencies** - dependencies that are passed in through the
constructor or method parameters. It cannot replace **implicit dependencies** - things that are imported directly at the
top of a file.

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
import { sendEmail } from './email-utils'; // ❌ Direct import

@Injectable()
export class UserService {
  createUser(data: UserData) {
    sendEmail(data.email); // ❌ Always runs the real code
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
const repo = unitRef.get(UserRepository); // Automatically a mock!

// Now configure what the stub methods should return
repo.findById.mockResolvedValue(testUser);
```

For more details on configuration options, see:

- [Mock Configuration](/docs/api-reference/mock-configuration) - Using `.mock().final()` and `.mock().impl()`
- [Types](/docs/api-reference/types) - Details about the `Mocked<T>` type
- [mock() function](/docs/api-reference/mock) - Creating mocks manually

## Testing with Real Implementations

Sometimes you want to test how multiple components work together using real code, not mocks. Use sociable tests for
this:

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

| Term                    | What It Means                                             | Example                                 |
|-------------------------|-----------------------------------------------------------|-----------------------------------------|
| **Test Double**         | Any fake replacement for a real dependency                | Any mock, stub, spy, fake, or dummy     |
| **Mock**                | A fake version of an entire class (all methods are stubs) | `Mocked<UserRepository>`                |
| **Stub**                | A fake method that returns a predetermined value          | `repo.findById.mockResolvedValue(user)` |
| **Spy**                 | A stub that also records how it was called                | `jest.spyOn()` - not recommended        |
| **Explicit Dependency** | Passed in through constructor or parameters               | `constructor(private db: Database)`     |
| **Implicit Dependency** | Imported directly at the top of the file                  | `import { sendEmail } from './utils'`   |

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

- **[Martin Fowler - Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)**: Classic article
  explaining different testing approaches