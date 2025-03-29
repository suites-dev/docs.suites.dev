---
sidebar_position: 1
title: Fundamentals of Unit Testing
description: Core concepts and principles of effective unit testing with Suites
---

# Unit Testing Fundamentals

Unit testing is a critical practice for ensuring software quality and maintainability. This guide explores the essential concepts of unit testing and how Suites enhances these practices specifically for applications that use dependency injection.

## Theoretical Foundations 🧠

Suites draws inspiration from the best ideas in the testing world. Here's a friendlier look at where our approach comes from:

### Standing on the Shoulders of Giants

We didn't invent testing from scratch! Suites builds on ideas from industry experts who've been thinking about testing for decades:

**Martin Fowler's Practical Insights** 💡
Martin Fowler introduced helpful concepts like "solitary" tests (isolating the unit completely) and "sociable" tests (allowing some real collaborators). Suites embraces both approaches, letting you choose what works best for your situation.

**Test-Driven Development** ✨
Kent Beck's TDD approach taught us the value of writing tests before code and keeping tests small and focused. These ideas influenced how Suites helps you structure your tests.

**Finding the Right Balance** ⚖️
Whether you prefer using real objects when possible (classical testing) or mocking everything (mockist testing), Suites supports your style. We focus on testing behavior that matters rather than getting caught up in implementation details.

## What is Unit Testing?

Unit testing is a software testing approach where individual units or components of an application are tested in isolation to verify that each part functions correctly on its own. It serves as the foundation of a robust testing strategy by ensuring that the basic building blocks of your application work as expected.

### What Constitutes a "Unit"?

In traditional software testing literature, a "unit" refers to the smallest testable part of an application—typically a function, method, or class. However, in the context of dependency injection frameworks, the definition becomes more nuanced:

**In Suites, a unit is typically a class that represents a logical component of your application.**

This definition acknowledges that in DI-based applications, classes are the natural boundaries for business logic and functionality. By focusing on classes as units, Suites aligns with how developers naturally structure their applications.

## The Value of Unit Testing

Unit testing delivers several key benefits that improve both your codebase and development process:

1. **Early Bug Detection** - Catch issues at the earliest possible stage of development, when they're least expensive to fix. By testing individual components in isolation, you can identify and resolve problems before they ripple through your application.

2. **Improved Design** - Writing tests for individual units encourages better software design. When a unit is easy to test, it's often because it has clear responsibilities, minimal dependencies, and a well-defined interface—all hallmarks of good design.

3. **Safer Refactoring** - With a comprehensive suite of unit tests, you can refactor code with confidence. Tests serve as a safety net, immediately alerting you if changes break existing functionality.

4. **Documentation Through Examples** - Unit tests provide executable documentation that demonstrates how each component is intended to be used. This documentation is guaranteed to stay up-to-date, as outdated tests will fail when the code changes.

5. **Accelerated Development** - While writing tests requires an initial investment, it typically saves time in the long run by reducing debugging time, preventing regressions, and facilitating faster onboarding for new team members.

## Types of Unit Tests in Suites

Suites distinguishes between two main types of unit tests, each serving different testing needs:

### Solitary Tests

**Solitary tests** examine a unit in complete isolation, with all dependencies replaced by mocks. These tests focus on a single unit's behavior under controlled conditions, verifying that it correctly handles various inputs and edge cases.

```typescript
// Example of a solitary test using Suites
describe('UserService Tests', () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it('should return user details when user exists', async () => {
    userRepository.findById.mockResolvedValue({ id: 1, name: 'John' });
    const result = await userService.getUserDetails(1);
    expect(result.name).toBe('John');
  });
});
```

### Sociable Tests

**Sociable tests** verify how multiple real components interact with each other. These tests use real implementations for key dependencies while still mocking external dependencies. This approach helps validate integration points between closely related components.

```typescript
// Example of a sociable test using Suites
describe('UserService Integration', () => {
  let userService: UserService;
  let database: Mocked<Database>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.sociable(UserService)
      .expose(UserRepository) // Use real UserRepository
      .compile();
      
    userService = unit;
    database = unitRef.get(Database);
  });

  it('should integrate with real repository layer', async () => {
    database.query.mockResolvedValue([{ id: 1, name: 'John' }]);
    const result = await userService.getUserDetails(1);
    expect(result.name).toBe('John');
  });
});
```

## Characteristics of Effective Unit Tests

Whether solitary or sociable, effective unit tests share these key qualities:

1. **Fast** - Unit tests should execute quickly—ideally in milliseconds. This speed enables frequent test runs during development, providing immediate feedback on code changes.

2. **Reliable** - Tests should produce consistent results when run repeatedly under the same conditions. Flaky tests that sometimes pass and sometimes fail undermine confidence in the test suite.

3. **Isolated** - Each test should be independent of other tests. One test should not affect the state or behavior of another test, as this can lead to unpredictable test runs and difficult debugging.

4. **Readable** - Tests should clearly express their intent. A well-written test serves as documentation, helping other developers understand what the code should do.

5. **Maintainable** - As the codebase evolves, tests should be easy to update. Overly complex or brittle tests can become a maintenance burden that slows development.

## Suites' Approach to Unit Testing

Suites enhances unit testing for dependency injection by providing:

1. **Automatic Mocking**: Automatically creates mocks for all dependencies
2. **Flexible Testing Styles**: Supports both solitary and sociable testing approaches
3. **Declarative API**: Offers a clear, expressive API for setting up tests
4. **Type Safety**: Leverages TypeScript for type-safe test code
5. **Framework Agnostic**: Works with various DI frameworks and testing libraries

By adopting these principles and leveraging Suites' tools, you can create effective unit tests that ensure the reliability and maintainability of your application.

## Next Steps

Now that you understand the fundamentals of unit testing with Suites, you can explore more specific topics:

- [Test Doubles in Suites](/docs/developer-guide/unit-tests/test-doubles)
- [Solitary Unit Testing](/docs/developer-guide/unit-tests/solitary)
- [Sociable Unit Testing](/docs/developer-guide/unit-tests/sociable)
