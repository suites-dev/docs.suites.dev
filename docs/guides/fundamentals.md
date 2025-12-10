---
sidebar_position: 1
title: Unit Testing Fundamentals
description: Master unit testing fundamentals with the IoC principle. Learn solitary vs sociable testing, test doubles, and how Suites eliminates mock boilerplate for dependency injection and beyond.
---

# Unit Testing Fundamentals

> **What this covers:** Core principles of unit testing with the IoC principle and how Suites eliminates testing complexity \
> **Time to read:** ~10 minutes \
> **Prerequisites:** Basic TypeScript knowledge, familiarity with basic testing concepts \
> **Best for:** Understanding unit testing foundations and IoC testing patterns before diving into solitary and sociable testing

Unit testing verifies software quality and maintainability. This guide covers essential unit testing concepts, IoC
testing principles, and how Suites simplifies testing component logic and interactions in applications using
dependency injection, constructor injection.

## Overview

This guide covers:
1. What unit testing is and its core principles
2. Prerequisites for using Suites effectively
3. Understanding units in class-based applications
4. Characteristics of good unit tests (FIRST principles)
5. How Suites solves IoC testing challenges
6. Two testing approaches: solitary and sociable tests

## What is Unit Testing?

Unit testing verifies individual components in isolation. Each test checks that a specific piece of code works
correctly.

**Core principles:**
- **Isolation:** Test one component at a time
- **Fast:** Tests run in milliseconds
- **Repeatable:** Same input, same output
- **Independent:** Tests don't affect each other

**Advantages:**
- Catch bugs early (when they're cheap to fix)
- Enable safe refactoring
- Serve as executable documentation
- Improve code design

## What is Inversion of Control (IoC)?

**Inversion of Control** is a design principle where dependencies are passed into a component rather than created inside it.

```typescript
// ❌ Without IoC - creates own dependency
class UserService {
  private repo = new UserRepository();
}

// ✅ With IoC - dependency passed in (class-based)
class UserService {
  constructor(private repo: UserRepository) {}
}

// ✅ With IoC - dependency passed in (functional)
function createUserService(repo: UserRepository) {
  return {
    getUser: (id: number) => repo.findById(id)
  };
}
```

This principle applies to any architectural choice: dependency injection frameworks, plain constructor injection, functional composition, or factory patterns. The key is that dependencies flow in from outside.

:::info
Suites' testing theory builds on Martin Fowler's work on Inversion of Control and test doubles. Read more in his articles: [Inversion of Control](https://martinfowler.com/bliki/InversionOfControl.html) and [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html).
:::

## Prerequisites

Suites supports the IoC principle through multiple implementations:

**Currently Supported:**
- Dependency injection frameworks
- Constructor injection with `@Injectable()` decorators
- Plain TypeScript classes with constructor parameters (manually)
- Standalone mocking with the `mock()` function (manually)

## "Units" in Class-Based Applications

In class-based architectures following the IoC principle, a unit is typically a class:

```typescript
@Injectable()
class PaymentService {
  constructor(private gateway: PaymentGateway) {}
}
```

Each class is a logical component with specific responsibilities.

## Characteristics of Good Unit Tests

**Effective unit tests follow the FIRST principles:**

* **Fast** - Tests run in milliseconds. Quick feedback enables frequent testing during development.
* **Isolated** - Each test is independent. One test failing doesn't cascade to others.
* **Repeatable** - Same conditions produce same results. No flaky tests.
* **Self-Validating** - Tests clearly pass or fail. No manual verification needed.
* **Timely** - Write tests as code develops, not after. Catches issues immediately.

## Unit Testing with IoC Patterns

Testing applications with IoC patterns presents several challenges:

**The Pain:**
- Manually create mock objects and test doubles for every dependency
- Wire dependencies together with type casts
- Update every test when constructor changes
- No compile-time safety (`as any` / `as unknown as ..` hides bugs)

**How Suites Solves It:**

- Auto-generates all mocks and test doubles (no manual creation)
- Auto-wires dependencies (no type casts)
- Type-safe mocks (TypeScript catches mismatches)
- One call creates a complete test environment
- Single canonical pattern for AI agents (minimal token cost)

```typescript
// Manual: many many lines of mocks setup
// Suites: 1 line
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
```

:::tip 🤖 LLM-Friendly Design
Suites provides one canonical pattern that teaches the entire API. AI agents need a single
example in context instead of dozens of lines showing different manual mocking approaches. This reduces token
consumption and improves generation accuracy.
:::

## Testing Approaches Comparison

Suites offers different testing approaches based on architecture:

| Feature               | `TestBed` (DI Only) | `mock()` / `stub()` |
|-----------------------|---------------------|---------------------|
| Type Safety           | ✅                   | ✅                   |
| Auto Mock Creation    | ✅                   | ❌ Manual            |
| Auto Injection        | ✅                   | ❌ Manual            |
| Reference Tracking    | ✅ `unitRef.get()`   | ❌ Manual variables  |
| Requires DI Framework | ✅                   | ❌ Any TypeScript    |
| Works Today           | ✅                   | ✅                   |

**Choose based on project architecture:**

- **Using Dependency Injection?** Use `TestBed` for the best testing experience
- **Plain TypeScript?** Use `mock()` and `stub()` (manual wiring required)

## Types of Unit Tests in Suites

Suites supports two approaches based
on [Martin Fowler's distinction between solitary and sociable unit tests](https://martinfowler.com/bliki/UnitTest.html):

* **Solitary Unit Tests** - Test one class in complete isolation. All collaborators are replaced with test doubles to ensure a fault in a dependency does not cause the primary class's tests to fail. \
See [Solitary Unit Tests](/docs/guides/solitary) for examples and usage.

* **Sociable Unit Tests** - Test multiple component classes together with their real collaborators. External I/O 
  (databases, APIs, file systems) is replaced with test doubles (mocks and stubs) to keep tests fast and deterministic. \
See [Sociable Unit Tests](/docs/guides/sociable) for examples and usage.

Suites follows Fowler's pragmatic approach: use test doubles when collaboration is awkward (external services, I/O), but allow real collaborators when interactions are fast and stable.

## What Suites Provides

- Automatic mock generation for all dependencies
- Solitary and sociable testing approaches
- Type-safe test code with full TypeScript support
- Framework-agnostic API

## Quick Reference

| Term                | Definition                                                                           | Learn More                                |
|---------------------|--------------------------------------------------------------------------------------|-------------------------------------------|
| Unit Test           | Verifies individual components in isolation                                          | [See above](#what-is-unit-testing)        |
| Integration Test    | Tests how multiple components work together with real external systems including I/O | N/A - Suites focuses on unit testing      |
| Solitary Test       | Unit test with all dependencies mocked                                               | [Solitary Guide](/docs/guides/solitary)   |
| Sociable Test       | Unit test with selected real dependencies, external I/O mocked                       | [Sociable Guide](/docs/guides/sociable)   |
| Dependency          | A collaborator object that a component needs to function                             | Soon                                      |

## Next Steps

Now that you understand the fundamentals of unit testing with Suites, explore specific testing approaches:

- **[Solitary Unit Testing](/docs/guides/solitary)**: Write tests with complete isolation using automatic mocking
- **[Sociable Unit Testing](/docs/guides/sociable)**: Test multiple classes together with controlled collaboration
- **[Test Doubles in Suites](/docs/guides/test-doubles)**: Learn about mocks, stubs, spies, and when to use each

## Additional Resources

- **[GitHub Discussions](https://github.com/suites-dev/suites/discussions)**: Ask questions and share experiences with the community
- **[GitHub Issues](https://github.com/suites-dev/suites/issues)**: Report bugs or request features
