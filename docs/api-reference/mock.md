---
sidebar_position: 5
title: mock() and stub()
description: Create standalone mocks and stubs outside TestBed
---

# mock() and stub()

Standalone utility functions for creating mocks outside of TestBed.

:::info Adapter-Specific
These functions are provided by your installed doubles adapter:
- `@suites/doubles.jest` (Jest)
- `@suites/doubles.vitest` (Vitest)
- `@suites/doubles.sinon` (Sinon)

Import from `@suites/unit` - Suites automatically maps to the correct adapter based on your test runner.
:::

## mock()

Creates a fully mocked instance with auto-generated stub methods.

### Signature

```typescript
function mock<T>(mockImplementation?: DeepPartial<T>): Mocked<T>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `mockImplementation` | `DeepPartial<T>` | Optional partial implementation to pre-configure the mock |

### Returns

`Mocked<T>` - A deeply mocked instance where all methods are automatically stubbed.

### How It Works

`mock()` returns a Proxy that intercepts property access. When you access a method for the first time, it automatically creates a stub function (`jest.fn()`, `vi.fn()`, or `sinon.stub()` depending on your adapter).

```typescript
import { mock } from "@suites/unit";

const userRepo = mock<UserRepository>();

// Methods auto-generated on first access
userRepo.findById.mockResolvedValue(testUser);
userRepo.save.mockResolvedValue(savedUser);

// Nested objects work too
userRepo.database.connect.mockResolvedValue(true);
```

### Basic Usage

```typescript
import { mock } from "@suites/unit";

interface PaymentGateway {
  charge(amount: number): Promise<{ status: string }>;
  refund(transactionId: string): Promise<void>;
  validate(card: Card): boolean;
}

const gateway = mock<PaymentGateway>();

// Configure methods as needed
gateway.charge.mockResolvedValue({ status: "success" });
gateway.refund.mockResolvedValue(undefined);
gateway.validate.mockReturnValue(true);

// Use in tests
const result = await gateway.charge(100);
expect(result.status).toBe("success");
expect(gateway.charge).toHaveBeenCalledWith(100);
```

### With Pre-Configuration

You can provide a partial implementation upfront:

```typescript
const gateway = mock<PaymentGateway>({
  charge: async (amount) => ({
    status: amount > 0 ? "success" : "failed"
  }),
  validate: (card) => card.number.length === 16,
});

// Pre-configured methods work immediately
await gateway.charge(100);  // Returns { status: "success" }

// Other methods still auto-generate
gateway.refund.mockResolvedValue(undefined);
```

### Nested Object Mocking

`mock()` handles deeply nested structures:

```typescript
interface DatabaseService {
  users: {
    find(id: string): Promise<User>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<boolean>;
  };
  orders: {
    create(order: Order): Promise<Order>;
    list(): Promise<Order[]>;
  };
}

const db = mock<DatabaseService>();

// Nested methods auto-generated
db.users.find.mockResolvedValue(testUser);
db.users.save.mockResolvedValue(undefined);
db.users.delete.mockResolvedValue(true);
db.orders.create.mockResolvedValue(testOrder);
db.orders.list.mockResolvedValue([testOrder]);
```

### When to Use mock()

**Use `mock()` for:**
- ✅ Classes that aren't TestBed dependencies
- ✅ Utility functions or helpers
- ✅ Testing standalone services without DI
- ✅ Manual test setup scenarios

**Use TestBed for:**
- ✅ Mocking all dependencies of a DI class automatically
- ✅ Type-safe dependency injection testing
- ✅ Reducing boilerplate in DI applications

### Comparison: mock() vs TestBed

```typescript
// Using mock(): Manual creation and wiring
const userRepo = mock<UserRepository>();
const emailService = mock<EmailService>();
const logger = mock<Logger>();

userRepo.findById.mockResolvedValue(testUser);
emailService.send.mockResolvedValue({ messageId: "123" });

const service = new UserService(userRepo, emailService, logger);  // Manual wiring

// Using TestBed: Automatic
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
const userRepo = unitRef.get(UserRepository);  // Auto-wired, auto-mocked

userRepo.findById.mockResolvedValue(testUser);
```

## stub()

Creates a single standalone stub function (not a full object mock).

### Signature

#### Jest
```typescript
function stub<TArgs extends any[] = any[]>(): jest.Mock<any, TArgs>
```

#### Vitest
```typescript
function stub<TArgs extends any[] = any[]>(): Mock<any, TArgs>
```

#### Sinon
```typescript
function stub<TArgs extends any[] = any[]>(): SinonStub
```

:::info Alias for Native Stub
`stub()` is an alias for your test framework's native stub function:
- **Jest**: `jest.fn()`
- **Vitest**: `vi.fn()`
- **Sinon**: `sinon.stub()`

Use it for consistent API across frameworks.
:::

### Returns

A mock function from your testing framework.

### Basic Usage

```typescript
import { stub } from "@suites/unit";

// Create standalone stub
const mockFn = stub();
mockFn.mockReturnValue(42);

const result = mockFn();
expect(result).toBe(42);
expect(mockFn).toHaveBeenCalled();
```

### Callback Mocking

```typescript
interface EventEmitter {
  on(event: string, callback: (data: any) => void): void;
  emit(event: string, data: any): void;
}

const emitter = mock<EventEmitter>();
const callbackStub = stub();

// Register callback
emitter.on("data", callbackStub);

// Simulate event (in real code)
emitter.emit("data", { value: 123 });

// Verify callback was invoked
expect(callbackStub).toHaveBeenCalledWith({ value: 123 });
```

### Function Dependency Injection

Test classes that accept functions as dependencies:

```typescript
class PriceCalculator {
  constructor(private taxRateFn: () => number) {}

  calculate(price: number) {
    return price * (1 + this.taxRateFn());
  }
}

// Mock the function dependency
const taxRateStub = stub().mockReturnValue(0.1);  // 10% tax
const calculator = new PriceCalculator(taxRateStub);

expect(calculator.calculate(100)).toBe(110);
expect(taxRateStub).toHaveBeenCalled();
```

### Use in .mock().impl()

`stub()` is commonly used in TestBed mock configuration:

```typescript
const { unit, unitRef } = await TestBed.solitary(PaymentService)
  .mock(PaymentGateway)
  .impl(stubFn => ({
    charge: stubFn().mockResolvedValue({ status: "success" }),
    refund: stubFn().mockResolvedValue(undefined),
  }))
  .compile();
```

In this context, `stubFn` is equivalent to `stub()`.

### Difference from mock()

| Feature | `stub()` | `mock()` |
|---------|----------|----------|
| Creates | Single function | Full object with methods |
| Use case | Function mocking | Object/interface mocking |
| Nesting | N/A | Auto-generates nested properties |
| Pre-config | Via `.mockReturnValue()` etc. | Via partial object |

```typescript
// stub(): Single function
const fn = stub();
fn.mockReturnValue(42);

// mock(): Full object
const obj = mock<MyService>();
obj.method1.mockReturnValue(42);
obj.method2.mockReturnValue(100);
```

## Adapter Differences

### Jest

```typescript
import { mock, stub } from "@suites/unit";

const obj = mock<MyService>();
obj.method.mockResolvedValue(result);  // Jest API

const fn = stub();
fn.mockReturnValue(42);  // jest.fn()
```

### Vitest

```typescript
import { mock, stub } from "@suites/unit";

const obj = mock<MyService>();
obj.method.mockResolvedValue(result);  // Vitest API (compatible with Jest)

const fn = stub();
fn.mockReturnValue(42);  // vi.fn()
```

### Sinon

```typescript
import { mock, stub } from "@suites/unit";

const obj = mock<MyService>();
obj.method.resolves(result);  // Sinon API

const fn = stub();
fn.returns(42);  // sinon.stub()
```

:::tip Consistent API
While underlying implementations differ, Suites provides a consistent `mock()` and `stub()` API. The returned mocks use your framework's native API for configuration.
:::

## Complete Example

```typescript
import { mock, stub } from "@suites/unit";

describe("PaymentProcessor", () => {
  it("should process payment with mocked dependencies", async () => {
    // Mock full objects
    const gateway = mock<PaymentGateway>();
    const logger = mock<Logger>();

    // Mock functions
    const validateFn = stub().mockReturnValue(true);

    // Configure mocks
    gateway.charge.mockResolvedValue({ status: "success", id: "txn-123" });
    logger.info.mockReturnValue(undefined);

    // Create service with mocked dependencies
    const processor = new PaymentProcessor(gateway, logger, validateFn);

    // Test
    const result = await processor.process({ amount: 100, card: testCard });

    // Verify
    expect(result.status).toBe("success");
    expect(validateFn).toHaveBeenCalledWith(testCard);
    expect(gateway.charge).toHaveBeenCalledWith(100);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Payment processed")
    );
  });
});
```

## Related

- [Types](/docs/api-reference/types#mocked) - `Mocked<T>` type definition
- [TestBed.solitary()](/docs/api-reference/testbed-solitary) - Automatic dependency mocking
- [TestBed Configuration](/docs/api-reference/testbed-solitary#pre-compile-mock-configuration) - Using `.mock().impl()` with `stub()`
