---
sidebar_position: 3
title: TestBed.sociable()
description: Test business logic interactions with real and mocked dependencies
---

# TestBed.sociable()

Creates a test environment that mixes real implementations with mocked dependencies for testing interactions between business logic classes.

:::info Sociable Tests Are Still Unit Tests
Token-injected dependencies (`@Inject('PRISMA')`, `@Inject('HTTP_CLIENT')`) are automatically mocked. Tests never reach external systems.

See [Sociable Unit Tests Guide](/docs/guides/sociable) for concepts and when to use.
:::

## Signature

```typescript
TestBed.sociable<T>(ClassUnderTest: Type<T>): SociableTestBuilder<T>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| ClassUnderTest | `Type<T>` | The class constructor to test |

## Returns

`SociableTestBuilder<T>` with two configuration modes:

### .boundaries() <span class="version-badge version-badge--new">v4.0.0+</span>

Recommended approach. List classes to avoid - everything else runs real.

```typescript
boundaries(): SociableTestBuilder<T>
boundaries(dependencies: Type[]): SociableTestBuilder<T>
```

:::tip Token Auto-Mocking
Token-injected dependencies are automatically mocked. Use .boundaries() for class dependencies you want to avoid.
:::

### .expose() - Alternative

List classes to keep real. Everything else is mocked.

```typescript
expose<D>(dependency: Type<D>): SociableTestBuilder<T>
```

:::warning Classes Only
Both methods only accept class constructors, not tokens.
:::

## Examples

### Using .boundaries()

```typescript
const { unit, unitRef } = await TestBed.sociable(OrderService)
  .boundaries([ComplexTaxEngine])  // Avoid complex logic
  .compile();

// Can retrieve boundaries (mocked)
const taxEngine = unitRef.get(ComplexTaxEngine);

// Cannot retrieve real dependencies
// const calculator = unitRef.get(PriceCalculator);  // ERROR - it's real
```

### Using .expose()

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

**Boundaries mode:**
- ✅ Classes in .boundaries() array (mocked)
- ✅ Tokens (auto-mocked)
- ✅ Explicitly mocked dependencies
- ❌ Real dependencies (auto-exposed, leaf classes)

**Expose mode:**
- ✅ Non-exposed dependencies (mocked)
- ✅ Tokens (auto-mocked)
- ✅ Explicitly mocked dependencies
- ❌ Exposed dependencies (real)

## Mode Comparison

| Aspect | .boundaries() | .expose() |
|--------|---------------|-----------|
| Default | Everything real | Everything mocked |
| You list | What to avoid | What to keep |
| Use when | Many deps should be real | Few deps should be real |
| Future-proof | ✅ New deps auto-tested | ⚠️ New deps ignored |

**Example:** eight `.expose()` calls vs one `.boundaries()` call achieves the same outcome. See [Sociable Guide]
(/docs/guides/sociable) for the comparison.

## See Also

- [Sociable Unit Tests Guide](/docs/guides/sociable) - When to use, concepts, detailed examples
- [TestBed.solitary()](/docs/api-reference/testbed-solitary) - For fully isolated tests
- [Mock Configuration](/docs/api-reference/mock-configuration) - Configuring mock behavior
- [Fail-Fast](/docs/api-reference/fail-fast) - Configuration enforcement
