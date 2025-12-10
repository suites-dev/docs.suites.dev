---
sidebar_position: 5
title: mock() and stub()
description: Create type-safe mocks and stubs for any TypeScript code. Works without dependency injection frameworks.
---

# mock() and stub()

Standalone utility functions for creating type-safe mocks. Works with any TypeScript code, with or without dependency injection frameworks.

:::info Mock and Stub Functions Are Adapter-Specific
These functions are provided by your installed doubles adapter: `@suites/doubles.jest` (Jest), `@suites/doubles.vitest`
(Vitest) and `@suites/doubles.sinon` (Sinon).
:::

## When to Use

Use `mock()` and `stub()` functions when:
- Testing code **without dependency injection frameworks**
- Creating standalone test doubles outside of `TestBed`
- Testing plain TypeScript classes, functions, or modules
- You're comfortable with **manual dependency wiring**

:::note Trade-off: Manual vs Automatic Mocking
`mock()` provides type-safe mocking for any TypeScript code **but requires you to manually wire dependencies and track
mock references**. `TestBed` automates this but currently requires dependency injection frameworks.
:::

## mock()

Creates a fully mocked instance with auto-generated stub methods. This standalone function creates mocks manually,
outside of `TestBed`.

### Signature

```typescript
function mock<T>(mockImplementation: DeepPartial<T> = {}): Mocked<T>
```

### Parameters

| Parameter            | Type             | Description                                               |
|----------------------|------------------|-----------------------------------------------------------|
| `mockImplementation` | `DeepPartial<T>` | Optional partial implementation to pre-configure the mock |

### Returns

`Mocked<T>` - A deeply mocked instance where all methods are automatically stubbed.

:::note
See [Types](/docs/api-reference/types#mockedt) for more about the `Mocked<T>` type.
:::

### How It Works

`mock()` returns a Proxy that intercepts property access. When you access a method for the first time, it automatically creates a stub function (`jest.fn()`, `vi.fn()`, or `sinon.stub()` depending on your adapter).

```typescript
import { mock } from '@suites/unit';

const userRepo = mock<UserRepository>();

// Methods auto-generated on first access
userRepo.findById.mockResolvedValue(testUser);
userRepo.save.mockResolvedValue(savedUser);

// Nested objects work too
userRepo.database.connect.mockResolvedValue(true);
```

### Basic Usage

```typescript
import { mock } from '@suites/unit';

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

### Manual Testing (Non-DI)

`mock()` works with plain TypeScript classes, no decorators or DI containers required:

```typescript
// Plain TypeScript class (no @Injectable decorator)
class UserService {
  constructor(
    private repository: UserRepository,
    private logger: Logger
  ) {}

  async getUser(id: number): Promise<User> {
    this.logger.log(`Fetching user ${id}`);
    return this.repository.findById(id);
  }
}

// Create mocks
const mockRepository = mock<UserRepository>();
const mockLogger = mock<Logger>();

// Manual wiring - you track the mock references
const userService = new UserService(mockRepository, mockLogger);

// Configure mock behavior
mockRepository.findById.mockResolvedValue({ id: 1, name: "John" });

// Test the service
const user = await userService.getUser(1);
expect(user.name).toBe("John");
expect(mockLogger.log).toHaveBeenCalledWith("Fetching user 1");
```

**Note:** You manually wire dependencies and track mock references (`mockRepository`, `mockLogger`). With `TestBed`, this happens automatically.

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

### Difference from mock()

| Feature    | `stub()`                      | `mock()`                         |
|------------|-------------------------------|----------------------------------|
| Creates    | Single function               | Full object with methods         |
| Use case   | Function mocking              | Object/interface mocking         |
| Nesting    | N/A                           | Auto-generates nested properties |
| Pre-config | Via `.mockReturnValue()` etc. | Via partial object               |

```typescript
// stub(): Single function
const fn = stub();
fn.mockReturnValue(42);

// mock(): Full object
const obj = mock<MyService>();
obj.method1.mockReturnValue(42);
obj.method2.mockReturnValue(100);
```

## See Also

- [Types](/docs/api-reference/types#mocked) - `Mocked<T>` type definition
- [TestBed.solitary()](/docs/api-reference/testbed-solitary) - Automatic dependency mocking
- [TestBed Configuration](/docs/api-reference/testbed-solitary#pre-compile-mock-configuration) - Using `.mock().impl()` with `stub()`
