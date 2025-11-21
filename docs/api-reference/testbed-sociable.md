---
sidebar_position: 3
title: TestBed.sociable()
description: Test business logic interactions with real and mocked dependencies
---

# TestBed.sociable()

Creates a test environment that mixes real implementations with mocked dependencies for testing interactions between business logic classes.

:::info Sociable Tests Are Still Unit Tests
Even with multiple real classes, sociable tests remain unit tests because external I/O (databases, HTTP, caches) are
injected via tokens (`@Inject('DATABASE')`) which are automatically mocked. You're testing business logic interactions,
not actual I/O.  See the [Sociable Unit Tests Guide](/docs/guides/sociable) for concepts.
:::

## Signature

```typescript
TestBed.sociable<T>(targetClass: Type<T>): SociableTestBuilder<T>
```

## Parameters

| Parameter   | Type      | Description                   |
|-------------|-----------|-------------------------------|
| targetClass | `Type<T>` | The class constructor to test |

## Returns

`SociableTestBuilder<T>` with the following configuration method:

- **`.expose()`** - List classes to keep real. Everything else is mocked.
- **`.mock(dependency)`** - Configure specific mock behavior before compilation
- **`.compile()`** - Finalizes configuration and creates the test environment

### The `.expose()` Method

```typescript
expose<D>(dependency: Type<D>): SociableTestBuilder<T>
```

* `.expose()` only accepts class constructors, not tokens. Tokens represent abstractions (interfaces, types) following
the Dependency Inversion Principle - there is no concrete implementation to "expose". Additionally, tokens typically
represent external I/O (databases, HTTP clients) and are always mocked to keep sociable tests fast and side-effect-free.

* `.expose()` method only controls explicit, injected dependencies. Implicit dependencies (direct imports) are not
intercepted by `TestBed` and will execute as normal. Read more about 
[explicit vs implicit dependencies](/docs/guides/collaborations-and-dependencies)

## Example

```typescript
const { unit, unitRef } = await TestBed.sociable(UserService)
  .expose(UserValidator)  // Only this is real
  .compile();

// Can retrieve non-exposed (mocked)
const database = unitRef.get(Database);

// Cannot retrieve exposed
// const validator = unitRef.get(UserValidator);  // ERROR - it's real
```

## What's Retrievable

**With `.expose()`:**
- ✅ Non-exposed dependencies (mocked by default)
- ✅ Tokens (auto-mocked)
- ✅ Explicitly mocked dependencies
- ❌ Exposed dependencies (real, not retrievable)

## See Also

- [Sociable Unit Tests Guide](/docs/guides/sociable) - When to use, concepts, detailed examples
- [Understanding Collaborations and Dependencies](/docs/guides/collaborations-and-dependencies) - Explicit vs implicit dependencies, decision framework
- [TestBed.solitary()](/docs/api-reference/testbed-solitary) - For fully isolated tests
- [Mock Configuration](/docs/api-reference/mock-configuration) - Configuring mock behavior
