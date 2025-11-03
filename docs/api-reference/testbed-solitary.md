---
sidebar_position: 2
title: TestBed.solitary()
description: Create isolated unit tests with all dependencies mocked
---

# TestBed.solitary()

Creates a test environment where all dependencies are automatically mocked for testing a class in complete isolation.

## Signature

```typescript
public static solitary<TClass = any>(
  targetClass: Type<TClass>
): SolitaryTestBedBuilder<TClass>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `targetClass` | `Type<TClass>` | The class constructor to test in isolation |

## Returns

Returns a `SolitaryTestBedBuilder<TClass>` instance with methods for configuring the test environment:

- **`.mock(dependency)`** - Configure specific mock behavior before compilation
- **`.compile()`** - Finalizes configuration and creates the test environment

## Description

`TestBed.solitary()` initializes a solitary test environment builder for a specified class. In a solitary environment, **all dependencies are mocked by default**, ensuring tests are isolated to the class under test only. This method is ideal for testing the internal logic of a class without external interactions.

Suites analyzes your class's dependency injection metadata and automatically:
1. Identifies all constructor dependencies
2. Creates type-safe mocks for each dependency
3. Wires the mocks into your class
4. Provides access via `unitRef.get()`

Learn more about how this works: [Virtual DI Container](/docs/guides/virtual-di-container)

## Basic Usage

```typescript
import { TestBed, Mocked } from "@suites/unit";
import { describe } from 'node:test';
import { UserService } from "./user.service";
import { UserRepository, EmailService, Logger } from "./dependencies";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>;
  let emailService: Mocked<EmailService>;

  beforeAll(async () => {
    // Create solitary test environment - all dependencies auto-mocked
    const {unit, unitRef} = await TestBed.solitary(UserService).compile();

    userService = unit;
    userRepository = unitRef.get(UserRepository);
    emailService = unitRef.get(EmailService);
  });

  describe('test case..', { ... });
});
```

## With Token Injections

Token-injected dependencies work the same way - retrieve them using the token:

```typescript
@Injectable()
class PaymentService {
  constructor(
    private validator: PaymentValidator,              // Class dependency
    @Inject('DATABASE') private database: Database,   // Token dependency
    @Inject('API_KEY') private apiKey: string         // Primitive token
  ) {}
}

const { unit, unitRef } = await TestBed.solitary(PaymentService).compile();

// Retrieve by class
const validator = unitRef.get(PaymentValidator);

// Retrieve by token
const database = unitRef.get('DATABASE');
const apiKey = unitRef.get('API_KEY');
```

## Configuring Mocks

Configure mock behavior using `.mock().final()` or `.mock().impl()` before compile, or retrieve and configure after.

See [Mock Configuration](/docs/api-reference/mock-configuration) for details.

## Multiple Dependencies

Suites automatically handles classes with many dependencies:

```typescript
@Injectable()
class OrderService {
  constructor(
    private userRepo: UserRepository,
    private productRepo: ProductRepository,
    private paymentGateway: PaymentGateway,
    private inventory: InventoryService,
    private emailService: EmailService,
    private analytics: AnalyticsService,
    private logger: Logger
  ) {}
}

// All dependencies auto-mocked
const { unit, unitRef } = await TestBed.solitary(OrderService).compile();

// Access only what you need for each test
it("should process order", async () => {
  const userRepo = unitRef.get(UserRepository);
  const paymentGateway = unitRef.get(PaymentGateway);

  userRepo.findById.mockResolvedValue(testUser);
  paymentGateway.charge.mockResolvedValue({ status: "success" });

  await unit.processOrder("order-123");

  expect(paymentGateway.charge).toHaveBeenCalled();
});
```

## When to Use Solitary Tests

Use `TestBed.solitary()` when:

✅ **Testing specific behavior** - Focus on one class's logic \
✅ **Testing edge cases** - Precise control over all inputs \
✅ **Testing error handling** - Easy to simulate failures \
✅ **Many dependencies** - Avoid complex setup \
✅ **Non-deterministic dependencies** - Mock random/time-based logic

Consider `TestBed.sociable()` when:

- Testing integration between business logic classes
- Wanting more realistic test scenarios
- Testing emergent behaviors from interactions

See [TestBed.sociable()](/docs/api-reference/testbed-sociable) for more.

## Type Safety

All mocks are fully type-safe:

```typescript
const repository = unitRef.get(UserRepository);

// ✅ TypeScript knows all methods
repository.save.mockResolvedValue(user);
repository.findById.mockResolvedValue(user);

// ❌ Compile error: method doesn't exist
repository.invalidMethod.mockReturnValue(123);
```

No `as any` casts needed. No runtime surprises.

## Related

- [TestBed.sociable()](/docs/api-reference/testbed-sociable) - Test with real dependencies
- [Mock Configuration](/docs/api-reference/mock) - Advanced mock configuration with `.mock()`
- [UnitReference](/docs/api-reference/types#unitreference) - Accessing mocked dependencies with `unitRef.get()`
- [Virtual DI Container](/docs/guides/virtual-di-container) - How Suites auto-mocks dependencies
- [Solitary Tests Guide](/docs/guides/fundamentals#solitary-tests) - Conceptual guide
