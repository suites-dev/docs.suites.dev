---
sidebar_position: 5
title: Fundamentals of Unit Testing
description: Core concepts and principles of effective unit testing with Suites
---

# Unit Testing Fundamentals

Unit testing is a critical practice for ensuring software quality and maintainability. This guide explores the essential concepts of unit testing and how Suites enhances these practices specifically for applications that use dependency injection.

## What is Unit Testing?

Unit testing tests individual components in isolation. Each test verifies a specific piece of code works correctly.

**Core principles:**
- **Isolation:** Test one component at a time
- **Fast:** Tests run in milliseconds
- **Repeatable:** Same input, same output
- **Independent:** Tests don't affect each other

**Benefits:**
- Catch bugs early (when they're cheap to fix)
- Enable safe refactoring
- Serve as executable documentation
- Improve code design

## Units in DI Applications

In dependency injection frameworks, a unit is typically a class:

```typescript
@Injectable()
class PaymentService {
  constructor(private gateway: PaymentGateway) {}
}
```

Each class is a logical component with specific responsibilities.

## Characteristics of Good Unit Tests

Effective unit tests follow the FIRST principles:

**Fast**
Tests run in milliseconds. Quick feedback enables frequent testing during development.

**Isolated**
Each test is independent. One test failing doesn't cascade to others.

**Repeatable**
Same conditions produce same results. No flaky tests.

**Self-Validating**
Tests clearly pass or fail. No manual verification needed.

**Timely**
Write tests as you develop code, not after. Catches issues immediately.

## Testing Pyramid

Unit tests form the foundation of your testing strategy:

```
        /\
       /E2E\        ← Few (slow, expensive)
      /------\
     /Integration\   ← Some (moderate speed)
    /------------\
   /  Unit Tests  \  ← Many (fast, cheap)
  /----------------\
```

**Most of your tests should be unit tests** because they're:
- Fastest to run
- Easiest to maintain
- Pinpoint failures precisely
- Cheapest to write and maintain

Integration and E2E tests verify the system works together, but unit tests verify individual pieces work correctly.

## Unit Testing with Dependency Injection

Testing DI applications creates specific challenges:

**The Pain:**
- Manually create mock objects for every dependency
- Wire dependencies together with type casts
- Update every test when constructor changes
- No compile-time safety (`as any` hides bugs)

**How Suites Solves It:**
- Auto-generates all mocks (no manual creation)
- Auto-wires dependencies (no type casts)
- Type-safe mocks (TypeScript catches mismatches)
- One call creates complete test environment

```typescript
// Manual: 40+ lines of mock setup
// Suites: 1 line
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
```

## Types of Unit Tests in Suites

Suites supports two approaches:

**Solitary Tests**
Test one class in complete isolation. All dependencies are mocked.

See [Solitary Unit Tests](/docs/guides/solitary) for examples and usage.

**Sociable Tests**
Test multiple business logic classes together. Use `.boundaries()` to list classes you want to avoid.

See [Sociable Unit Tests](/docs/guides/sociable) for examples and usage.

## What Suites Provides

- Automatic mock generation for all dependencies
- Solitary and sociable testing approaches
- Type-safe test code with full TypeScript support
- Framework-agnostic API (NestJS, InversifyJS)

## Next Steps

Now that you understand the fundamentals of unit testing with Suites, you can explore more specific topics:

- [Test Doubles in Suites](/docs/guides/test-doubles)
- [Solitary Unit Testing](/docs/guides/solitary)
- [Sociable Unit Testing](/docs/guides/sociable)
