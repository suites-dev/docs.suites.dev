---
sidebar_position: 4
title: Mock Configuration
description: Configure mock behavior with .final() and .impl()
---

# Mock Configuration

Suites provides two methods for configuring mock behavior: `.mock().final()` for immutable configurations and `.mock().impl()` for flexible implementations.

## Methods

### `.mock().final()`

Creates an immutable mock configuration. Once set, the mock cannot be retrieved or modified.

#### Signature

```typescript
mock<D>(dependency: Type<D> | string | symbol)
  .final(implementation: Partial<D>): TestBuilder
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| dependency | `Type<D> \| string \| symbol` | The dependency to mock |
| implementation | `Partial<D>` | Object with method implementations |

#### Example

```typescript
const { unit } = await TestBed.solitary(UserService)
  .mock(UserApi)
  .final({
    getRandom: async () => ({ id: 1, name: "John" }),
    getAll: async () => [{ id: 1, name: "John" }]
  })
  .compile();

// Note: UserApi cannot be retrieved from unitRef
```

### `.mock().impl()`

Creates a flexible mock configuration using the underlying mock library (Jest, Vitest, etc.).

#### Signature

```typescript
mock<D>(dependency: Type<D> | string | symbol)
  .impl(factory: (stubFn: () => MockFunction) => Partial<D>): TestBuilder
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| dependency | `Type<D> \| string \| symbol` | The dependency to mock |
| factory | `(stubFn) => Partial<D>` | Factory function receiving the mock library's stub function |

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

## Comparison

| Feature | `.mock().final()` | `.mock().impl()` |
|---------|-------------------|-------------------|
| Retrievable via unitRef | ❌ No | ✅ Yes |
| Can modify after compile | ❌ No | ✅ Yes |
| Access to mock library features | ❌ No | ✅ Yes |
| Use case | Fixed test data | Dynamic behavior |

## Examples

### Using .mock().final() for Fixed Data

Perfect for tests with predictable, unchanging data:

```typescript
describe("UserService with fixed data", () => {
  let userService: UserService;

  beforeAll(async () => {
    const { unit } = await TestBed.solitary(UserService)
      .mock(Database)
      .final({
        findUser: async (id: string) => ({ id, name: "Test User" }),
        saveUser: async (user: User) => ({ ...user, id: "123" })
      })
      .compile();

    userService = unit;
  });

  it("should always return Test User", async () => {
    const user = await userService.getUser("any-id");
    expect(user.name).toBe("Test User");
  });
});
```

### Using .mock().impl() for Dynamic Behavior

Better for tests requiring different responses or Jest/Vitest-specific features:

```typescript
describe("PaymentService with dynamic mocks", () => {
  let paymentService: PaymentService;
  let gateway: Mocked<PaymentGateway>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(PaymentService)
      .mock(PaymentGateway)
      .impl(stubFn => ({
        charge: stubFn(),  // Don't set behavior yet
        refund: stubFn().mockResolvedValue({ status: "success" })
      }))
      .compile();

    paymentService = unit;
    gateway = unitRef.get(PaymentGateway);
  });

  it("should handle successful payment", async () => {
    gateway.charge.mockResolvedValueOnce({ status: "success" });
    const result = await paymentService.process(100);
    expect(result.status).toBe("success");
  });

  it("should handle failed payment", async () => {
    gateway.charge.mockRejectedValueOnce(new Error("Insufficient funds"));
    await expect(paymentService.process(100))
      .rejects.toThrow("Insufficient funds");
  });
});
```

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
  .mock(Logger)
  .impl(stubFn => ({
    log: stubFn(),
    error: stubFn()
  }))
  .compile();

// Can retrieve EmailService and Logger, but not Database
const emailService = unitRef.get(EmailService);
const logger = unitRef.get(Logger);
```

### Framework Examples

#### NestJS
```typescript
@Injectable()
class NotificationService {
  constructor(
    private mailer: MailerService,
    private template: TemplateService
  ) {}
}

const { unit, unitRef } = await TestBed.solitary(NotificationService)
  .mock(MailerService)
  .impl(stubFn => ({
    send: stubFn().mockResolvedValue({ messageId: "123" })
  }))
  .mock(TemplateService)
  .final({
    render: async (name: string) => `<h1>Hello ${name}</h1>`
  })
  .compile();
```

#### InversifyJS
```typescript
@injectable()
class OrderService {
  constructor(
    @inject(TYPES.Database) private db: Database,
    @inject(TYPES.Logger) private logger: Logger
  ) {}
}

const { unit, unitRef } = await TestBed.solitary(OrderService)
  .mock(TYPES.Database)
  .impl(stubFn => ({
    save: stubFn().mockResolvedValue({ id: "123" })
  }))
  .mock(TYPES.Logger)
  .final({
    info: () => {},
    error: () => {}
  })
  .compile();
```

## Best Practices

### When to Use .mock().final()

- Static test data that won't change
- Simple stub implementations
- When you don't need Jest/Vitest-specific features
- Ensuring mock behavior can't be accidentally modified

### When to Use .mock().impl()

- Different responses per test case
- Using Jest/Vitest matchers (`toHaveBeenCalledWith`, etc.)
- Complex mock behavior (`.mockImplementationOnce`, etc.)
- When you need to spy on method calls

## Common Patterns

### Partial Mocking

Both methods support partial mocking - you only need to implement the methods you use:

```typescript
// Only mock the methods you need
.mock(UserRepository)
.impl(stubFn => ({
  findById: stubFn().mockResolvedValue(testUser)
  // Other methods remain undefined
}))
```

### Error Simulation

```typescript
// With .impl()
.mock(ApiClient)
.impl(stubFn => ({
  fetch: stubFn()
    .mockRejectedValueOnce(new Error("Network error"))
    .mockResolvedValueOnce({ data: "Success" })
}))

// With .final()
.mock(ApiClient)
.final({
  fetch: async () => {
    throw new Error("Network error");
  }
})
```

## See Also

- [TestBed.solitary()](/docs/api-reference/testbed-solitary) - Creating isolated tests
- [TestBed.sociable()](/docs/api-reference/testbed-sociable) - Creating sociable tests
- [UnitReference](/docs/api-reference/unit-reference) - Accessing configured mocks