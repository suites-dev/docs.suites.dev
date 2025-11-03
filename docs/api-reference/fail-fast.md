---
sidebar_position: 7
title: Fail-Fast Behavior
description: Prevent false positives with automatic error detection
---

# Fail-Fast Behavior <span class="version-badge version-badge--new">v4.0.0+</span>

:::warning Breaking Change in v4.0.0
Fail-fast is **enabled by default** in v4.0.0+. Tests that relied on unconfigured dependencies returning `undefined` will now throw errors.
:::

## What is Fail-Fast?

Fail-fast ensures that unconfigured dependencies throw clear errors instead of silently returning `undefined`. This prevents false positives - tests that pass incorrectly due to missing mock configurations.

## The Problem: False Positives

### Before v4.0.0 (Silent Failure)

```typescript
// Unconfigured dependency returns undefined
const { unit, unitRef } = await TestBed.solitary(PaymentService).compile();
const gateway = unitRef.get(PaymentGateway);

// ❌ False positive: Test passes but shouldn't!
it("processes payment", async () => {
  const result = await unit.processPayment(100);

  // gateway.charge is undefined, not mocked
  // processPayment might handle undefined incorrectly
  // Test passes but production code would fail
  expect(result).toBeDefined();
});
```

### With v4.0.0 (Fail-Fast)

```typescript
// Same test now fails immediately with clear error
it("processes payment", async () => {
  const result = await unit.processPayment(100);

  // 🔴 Throws during compile():
  // Dependency 'PaymentGateway' was not configured.
  //
  // No mode configured - dependencies are mocked by default.
  //
  // To fix this:
  //   - Use .expose(PaymentGateway) to make it real
  //   - Or use .mock(PaymentGateway).impl(...) for custom mock behavior
  //   - Use .disableFailFast() to restore v3.x behavior (not recommended)
  //
  // Learn more: https://suites.dev/docs/v4-migration
});
```

## How It Works

When fail-fast is enabled (default in v4.0.0):

1. Unconfigured mock methods throw `DependencyNotConfiguredError`
2. Error message identifies the exact method that needs configuration
3. Test fails immediately, preventing false positives

## Configuration

### Default Behavior

```typescript
// v4.0.0+ - Fail-fast is ON by default
const { unit } = await TestBed.solitary(Service).compile();
// Unconfigured methods will throw
```

### Disabling Fail-Fast

Use `.disableFailFast()` for backward compatibility:

```typescript
const { unit } = await TestBed.solitary(Service)
  .disableFailFast()  // Return to v3.x behavior
  .compile();
// Unconfigured methods return undefined
```

:::caution Deprecated
`.disableFailFast()` is deprecated and will be removed in v5.0.0. It's only intended as a migration helper.
:::

## Migration Strategies

### Option 1: Temporary Fix (Not Recommended)

Add `.disableFailFast()` to restore v3.x behavior:

```typescript
// Quick fix to make tests pass
const { unit } = await TestBed.sociable(Service)
  .expose(RealDependency)
  .disableFailFast()  // ⚠️ Temporary only!
  .compile();
```

### Option 2: Configure All Dependencies (Recommended)

Properly configure all mocked dependencies:

```typescript
const { unit, unitRef } = await TestBed.solitary(PaymentService)
  .mock(PaymentGateway)
  .impl(stubFn => ({
    charge: stubFn().mockResolvedValue({ status: "success" }),
    refund: stubFn().mockResolvedValue({ status: "refunded" })
  }))
  .compile();

// Configure other mocks as needed in tests
const logger = unitRef.get(Logger);
logger.log.mockReturnValue(undefined);
```

### Option 3: Use .boundaries() (Best for Sociable)

Switch to boundaries pattern for cleaner configuration:

```typescript
// Instead of configuring many real dependencies
const { unit } = await TestBed.sociable(OrderService)
  .boundaries([ComplexTaxEngine])  // Avoid complex logic
  .compile();

// Note: Token-injected deps (DATABASE, HTTP) are auto-mocked
```


## Why Fail-Fast Matters Most in Expose Mode

### The Risk in Expose Mode

With `.expose()`, the default is **everything mocked**:

```typescript
await TestBed.sociable(PaymentService)
  .expose(Logger)  // Only Logger is real
  .compile();

// All other deps (DatabaseService, GatewayService, etc.) are MOCKED
// If unconfigured → return undefined → false positives (tests pass incorrectly)
```

**Without fail-fast (v3.x):**
- Unconfigured mocks return `undefined`
- Code handles `undefined` incorrectly
- Test passes, production fails ❌

**With fail-fast (v4.0.0):**
- Unconfigured mocks throw immediately
- Bug caught at test time ✅

### Less Critical in Boundaries Mode

With `.boundaries()`, the default is **everything real**:

```typescript
await TestBed.sociable(OrderService)
  .boundaries([ComplexMLService])  // Avoid complex logic
  .compile();

// All other deps try to instantiate as real
// If deps missing → natural constructor failure (already caught)
```

Fail-fast still helps, but boundaries mode naturally fails if dependencies are misconfigured.

## Differences Between Test Types

### Solitary Tests

Fail-fast is effectively disabled for solitary tests:

```typescript
const { unit } = await TestBed.solitary(Service).compile();
// All dependencies auto-mocked with default stubs
```

### Sociable Tests

Fail-fast is fully enabled, especially important for `.expose()` mode:

```typescript
// Expose mode: Default is mocked → high false positive risk
const { unit } = await TestBed.sociable(Service)
  .expose(RealService)
  .compile();

// Boundaries mode: Default is real → natural failures
const { unit } = await TestBed.sociable(Service)
  .boundaries([ComplexService])
  .compile();
```



## Best Practices

1. **Configure used methods**: Only mock methods your test actually calls
2. **Use .boundaries() for test scope**: List classes to avoid (complex logic tested elsewhere, legacy code, third-party SDKs)
3. **Tokens are auto-mocked**: Token-injected dependencies (`@Inject('DB')`) are automatically mocked
4. **Migrate gradually**: Use `.disableFailFast()` temporarily
5. **Remove .disableFailFast()**: Complete migration before v5.0.0

## See Also

- [TestBed.sociable()](/docs/api-reference/testbed-sociable) - Sociable test configuration (includes `.expose()` and `.boundaries()`)
- [Mock Configuration](/docs/api-reference/mock-configuration) - Configuring mock behavior
- [Migration Guide](/docs/migration-guides/from-automock) - Migrating to Suites