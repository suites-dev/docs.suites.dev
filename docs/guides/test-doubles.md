---
sidebar_position: 4
title: Test Doubles
description: Understanding test doubles in Suites
---

# Test Doubles

## What Are Test Doubles?

Test doubles replace real dependencies in tests. They let you control inputs and isolate the code you're testing.

**Common types:**
- **Stub**: Returns predefined responses
- **Mock**: Verifies interactions (method calls)
- **Spy**: Wraps real object to track calls
- **Fake**: Simplified working implementation

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

When you see `Mocked<UserRepository>`, it means a class where all methods are stubs.

## Two Testing Approaches

Suites supports both state and behavior verification (as described in [Martin Fowler's "Mocks Aren't Stubs"](https://martinfowler.com/articles/mocksArentStubs.html)):

**State Verification (with stubs):**
Test the outcome, not how you got there.

```typescript
repo.findById.mockResolvedValue(testUser);
const result = await service.getUserName(1);
expect(result).toBe('John Doe');  // Verify state
```

**Behavior Verification (with spies):**
Test the interactions between objects.

```typescript
await service.createUser(userData);
expect(repo.save).toHaveBeenCalledWith(userData);  // Verify interaction
```

Both work with Suites. Choose based on what you're testing.

## Why spyOn() Is Problematic

`jest.spyOn(object, 'method')` wraps a method to track calls. **By default, it calls the real implementation.**

**The problem:**
```typescript
// ❌ Want to verify validateUser is called
jest.spyOn(service, 'validateUser');
await service.createUser(data);
expect(service.validateUser).toHaveBeenCalled();

// But validateUser RUNS FOR REAL!
// - Might have side effects
// - Might throw errors
// - Might have its own dependencies
// - Test becomes fragile
```

**Why this happens:**
Developers use spyOn to track calls, but forget it executes real code unless you add `.mockImplementation()`. This leads to:
- Unexpected side effects in tests
- Tests breaking when implementation changes
- Confusion about what's real vs mocked

**Suites alternative - Sociable tests:**
```typescript
// ✅ Test REAL business logic interactions properly
const { unit } = await TestBed.sociable(UserService)
  .expose(UserValidator)  // Real validator
  .compile();

await unit.createUser(data);
// Real validation runs in controlled test environment
// Token-injected I/O still mocked
// Tests actual business logic interaction
```

**Or behavior verification on mocks:**
```typescript
// ✅ Verify calls on auto-mocked dependencies
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
const validator = unitRef.get(UserValidator);  // Mocked

await unit.createUser(data);
expect(validator.validate).toHaveBeenCalledWith(data);  // Safe - it's a mock
```

**Why sociable is better than spyOn:**
- Sociable: Real business logic runs, I/O mocked via tokens, controlled
- spyOn: Real method runs, unclear what else runs, uncontrolled
- Sociable: Intentional testing of real interactions
- spyOn: Accidental execution of real code

See [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) for deeper discussion on state vs behavior verification trade-offs.

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

## Next Steps

- [Solitary Unit Tests](/docs/guides/solitary) - Testing in complete isolation
- [Sociable Unit Tests](/docs/guides/sociable) - Testing with real dependencies
- [API Reference](/docs/api-reference/) - Technical details