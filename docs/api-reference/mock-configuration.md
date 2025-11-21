---
sidebar_position: 4
title: Mock Configuration
description: Configure mock behavior with .final() and .impl()
---

# Mock Configuration

Suites provides two methods for configuring mock behavior:
* `.mock().final()` for immutable configurations
* `.mock().impl()` for flexible implementations

:::note
This page describes the `.mock()` configuration method for `TestBed`. For creating standalone mocks manually, see the [`mock()` and `stub()` utility functions](/docs/api-reference/mock).
:::

## Methods

### `.mock().final()`

Creates an immutable mock configuration. Once set, the mock cannot be retrieved or modified. Use `.final()` for:
- Fixed behavior that won't change across tests
- Configuration objects and primitives (non-class tokens)
- Values that don't need runtime control or verification

#### Signature

```typescript
mock<D>(dependency: Type<D> | string | symbol)
  .final(implementation: DeepPartial<D>): TestBuilder
```

#### Parameters

| Parameter      | Type                          | Description                        |
|----------------|-------------------------------|------------------------------------|
| dependency     | `Type<D> \| string \| symbol` | The dependency to mock             |
| implementation | `DeepPartial<D>`              | Object with method implementations |

#### Example

**For class-based tokens (fixed behavior):**
```typescript
const { unit } = await TestBed.solitary(UserService)
  .mock(UserApi)
  .final({
    getRandom: async () => ({ id: 1, name: "John" }),
    getAll: async () => [{ id: 1, name: "John" }]
  })
  .compile();

// UserApi cannot be retrieved - behavior is fixed
```

**For configuration objects and primitives:**
```typescript
const { unit } = await TestBed.solitary(PaymentService)
  .mock<DatabaseConfig>('DATABASE_CONFIG')
  .final({ host: 'localhost', port: 5432 })
  .mock<string>('API_KEY')
  .final('test-api-key-12345')
  .compile();

// Config values are injected but not retrievable
```

### `.mock().impl()`

Creates a flexible mock configuration using the underlying mock library (Jest, Vitest, etc.). The `stubFn` callback corresponds to the installed doubles adapter: `jest.fn()` for Jest, `vi.fn()` for Vitest, or `sinon.stub()` for Sinon.

#### Signature

```typescript
mock<D>(dependency: Type<D> | string | symbol)
  .impl(factory: (stubFn: () => MockFunction) => DeepPartial<D>): TestBuilder
```

#### Parameters

| Parameter  | Type                          | Description                                                 |
|------------|-------------------------------|-------------------------------------------------------------|
| dependency | `Type<D> \| string \| symbol` | The dependency to mock                                      |
| factory    | `(stubFn) => DeepPartial<D>`  | Factory function receiving the mock library's stub function |

#### Example

```typescript
const { unit, unitRef } = await TestBed.solitary(UserService)
  .mock(UserApi)
  .impl(stubFn => ({
    getRandom: stubFn().mockResolvedValue({ id: 1, name: "John" }),
    getAll: stubFn().mockReturnValue([])
  }))
  .compile();

// UserApi can still be retrieved and modified
const userApi = unitRef.get(UserApi);
userApi.getRandom.mockResolvedValue({ id: 2, name: "Jane" });
```

## Example

### Multiple Mock Configurations

You can chain multiple mock configurations:

```typescript
const { unit, unitRef } = await TestBed.solitary(OrderService)
  .mock(Database)
  .final({
    getOrder: async (id: string) => ({ id, items: [] })
  })
  .mock(EmailService)
  .impl(stubFn => ({
    send: stubFn().mockResolvedValue({ sent: true })
  }))
  .compile();

// Can retrieve EmailService and Logger, but not Database
const emailService = unitRef.get(EmailService);
const logger = unitRef.get(Logger);
```

## See Also

- [TestBed.solitary()](/docs/api-reference/testbed-solitary) - Creating isolated tests
- [TestBed.sociable()](/docs/api-reference/testbed-sociable) - Creating sociable tests
- [UnitReference](/docs/api-reference/unit-reference) - Accessing configured mocks
