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

### .collaborate() + .exclude() <span class="version-badge version-badge--new">v4.0.0+</span>

Recommended approach. Enable natural collaboration, then exclude specific classes.

```typescript
collaborate(): SociableTestBuilderInCollaborateMode<T>
exclude(dependencies: [Type, ...Type[]]): SociableTestBuilderInCollaborateMode<T>
```

:::tip Token Auto-Mocking
Token-injected dependencies are automatically mocked. Use `.exclude()` for class dependencies you want to opt-out of collaboration.
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

### Using .collaborate() + .exclude()

```typescript
const { unit, unitRef } = await TestBed.sociable(OrderService)
  .collaborate()
  .exclude([ComplexTaxEngine])  // Exclude from collaboration
  .compile();

// Can retrieve excluded dependencies (mocked)
const taxEngine = unitRef.get(ComplexTaxEngine);

// Cannot retrieve collaborating dependencies
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

**Collaborate mode:**
- ✅ Classes in .exclude() array (mocked)
- ✅ Tokens (auto-mocked)
- ✅ Explicitly mocked dependencies
- ❌ Collaborating dependencies (real, auto-exposed)

**Expose mode:**
- ✅ Non-exposed dependencies (mocked)
- ✅ Tokens (auto-mocked)
- ✅ Explicitly mocked dependencies
- ❌ Exposed dependencies (real)

## Mode Comparison

| Aspect | .collaborate() + .exclude() | .expose() |
|--------|----------------------------|-----------|
| Default | Everything collaborates | Everything mocked |
| You list | What to exclude | What to keep |
| Use when | Many deps should be real | Few deps should be real |
| Refactoring-stable | ✅ New deps auto-collaborate | ⚠️ New deps ignored |

**Example:** eight `.expose()` calls vs one `.collaborate()` call achieves the same outcome. See [Sociable Guide](/docs/guides/sociable) for the comparison.

## See Also

- [Sociable Unit Tests Guide](/docs/guides/sociable) - When to use, concepts, detailed examples
- [TestBed.solitary()](/docs/api-reference/testbed-solitary) - For fully isolated tests
- [Mock Configuration](/docs/api-reference/mock-configuration) - Configuring mock behavior
- [Fail-Fast](/docs/api-reference/fail-fast) - Configuration enforcement
