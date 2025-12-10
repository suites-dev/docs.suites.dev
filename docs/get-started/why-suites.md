---
sidebar_position: 2
title: Why Suites?
description: Eliminate boilerplate in dependency injection testing. Suites provides type-safe test doubles and automatic mocking for TypeScript applications following the IoC principle.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Why Suites?

Unit testing TypeScript applications with complex dependencies is **expensive and slow**. Whether using dependency injection containers, plain constructor injection, or functional composition, manual mocking creates brittle tests, cryptic errors, and mountains of boilerplate that bury test intent. Teams waste weeks debugging broken test doubles, onboarding junior developers, and maintaining inconsistent unit testing patterns across projects.

## The Core Problem

Manual mock setup in IoC and DI patterns creates three critical failures:
* **Silent breakage** (untyped mocks)
* **Cryptic runtime errors** (missing implementations)
* **Excessive boilerplate** (many lines per test)

## The Quick Win

Here's what Suites removes:

<Tabs>
<TabItem value="manual" label="Manual" default>

```typescript showLineNumbers
// ❌ Before: many lines defining mock classes, no DI benefits
class MockInventoryService {
  checkStock = jest.fn();
  reserveStock = jest.fn();
  releaseStock = jest.fn();
  // ... 5 more methods
}

class MockPaymentService {
  authorize = jest.fn();
  capture = jest.fn();
  refund = jest.fn();
  // ... 5 more methods
}

const mockInventory = new MockInventoryService();
const mockPayment = new MockPaymentService();
const orderService = new OrderService(mockInventory, mockPayment, /* ... */);
```

</TabItem>
<TabItem value="nestjs" label="NestJS">

```typescript
// ❌ Before: many lines of manual setup, no type safety
let mockInventory: any = { checkStock: jest.fn(), /* ... */ };
let mockPayment: any = { authorize: jest.fn(), /* ... */ };

const module = await Test.createTestingModule({
  providers: [
    OrderService,
    { provide: InventoryService, useValue: mockInventory },
    { provide: PaymentService, useValue: mockPayment },
    // ... wire up every dependency manually
  ],
}).compile();

orderService = module.get<OrderService>(OrderService);
```

</TabItem>
<TabItem value="inversify" label="InversifyJS">

```typescript
// ❌ Before: many lines of manual setup, no type safety
let container = new Container();
let mockInventory: any = { checkStock: jest.fn(), /* ... */ };
let mockPayment: any = { authorize: jest.fn(), /* ... */ };

container.bind<InventoryService>(TYPES.InventoryService)
  .toConstantValue(mockInventory);
container.bind<PaymentService>(TYPES.PaymentService)
  .toConstantValue(mockPayment);
container.bind<OrderService>(TYPES.OrderService).toSelf();

orderService = container.get<OrderService>(TYPES.OrderService);
```

</TabItem>
</Tabs>


**After: One line, fully typed (works for all frameworks):**

```typescript
const { unit, unitRef } = await TestBed.solitary(OrderService).compile();

orderService = unit;
inventoryService = unitRef.get(InventoryService); // Fully typed!
```

## The Problems with Manual Dependency Injection Testing

### 1. Manual Mocks Break Silently During Refactors

Backend teams waste hours writing untyped mocks. TypeScript errors on incomplete mocks force developers to cast to 'any', which breaks silently when dependencies change or methods are missing.

<details>
<summary>Show example</summary>

```typescript
// Developers cast to 'any' to bypass TypeScript errors
const mockRepo = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'John' })
} as any; // or unknown - ⚠️ silences all type checks

const service = new UserService(mockRepo);

// Later, UserRepository adds 'findByEmail' method...
// TypeScript won't catch this - mock is typed as 'any'
await service.getUserByEmail('test@example.com');
// Runtime error: "TypeError: userRepository.findByEmail is not a function"
```
</details>

### 2. Excessive Boilerplate Obscures Test Intent and Confuses LLMs

Each test requires 30+ lines of mock setup. This cognitive load slows development, confuses junior developers, and makes AI assistants struggle to generate correct tests. When tests fail with cryptic errors, LLMs cannot self-correct, burning tokens without progress.

**LLM token cost and context engineering:** Manual mocking forces AI agents to hold 40+ lines of boilerplate per test in context. With Suites' single canonical pattern (`TestBed.solitary()`), one example teaches the entire API, which reducing context consumption by 95% while improving accuracy.

<details>
<summary>Show example</summary>

```typescript
describe('Order Service Unit Spec', () => {
  beforeEach(() => {
    mockInventory = { checkStock: jest.fn(), /* 7 more methods */ } as any;
    mockPayment = { authorize: jest.fn(), /* 8 more methods */ } as unknown as jest.Mocked<...>;
    mockNotification = { sendEmail: jest.fn(), /* 5 more */ } as any;
    // ... repeat for 5 more services
    orderService = new OrderService(mockInventory, mockPayment, mockNotification);
  });

  // Where's the test? Buried in boilerplate.
});
```
</details>

### 3. Inconsistent Patterns Across Teams

Different teams use different testing approaches (manual instantiation, mock classes, container registration patterns). Developers switching projects must relearn patterns every time. No standard emerges, even within the same organization.

<details>
<summary>Show example</summary>

```typescript
// Team A: manual object mocks
const mockDb = { query: jest.fn() };

// Team B: mock class instances
class MockDatabase { query = jest.fn(); }

// Team C: container registration
const container = new Container();
container.register(Database, { useValue: { query: jest.fn() } });

// Developers switching teams must learn new patterns each time
```

</details>

## How Suites Solves It

Suites provides a **declarative API** that removes manual mocking entirely. A single call creates a fully-typed,
isolated unit testing environment with type-safe test doubles. No boilerplate, no cryptic errors, no silent failures.

:::tip Current Testing Options

**Using dependency injection frameworks?**
`TestBed` provides automatic mock injection and reference tracking - the best testing experience.

**Not using dependency injection?**
Use `mock()` and `stub()` for type-safe mocking. Works with any TypeScript code, but requires manual dependency wiring
and reference tracking. See [mock() and stub() utilities](/docs/api-reference/mock).
:::

```typescript title="order.service.spec.ts" {1,9,11-13}
import { TestBed, type Mocked } from '@suites/unit';

describe('Order Service Sociable Unit Spec', () => {
  let orderService: OrderService;
  let inventoryService: Mocked<InventoryService>;
  let paymentService: Mocked<PaymentService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(OrderService).compile();

    orderService = unit;
    inventoryService = unitRef.get(InventoryService);
    paymentService = unitRef.get(PaymentService);
    // All dependencies auto-mocked and fully typed!
  });

  test('should place order', async () => {
    // Test intent is immediately clear
    inventoryService.checkStock.mockResolvedValue(true);
    await orderService.placeOrder({ items: ['item1'] });

    // TypeScript validates at compile time:
    // ✅ inventoryService.checkStock exists
    // ❌ inventoryService.nonExistentMethod is a compile error
  });
});
```

**What Suites provides:**

- **Type-Safe Refactoring**: Compile-time validation with mocks bound to implementations prevent silent test failures
and let teams change constructors or add dependencies without breaking tests.
- **Zero Boilerplate**: One line replaces dozens of lines of manual mock setup.
- **Standardized Testing Across Teams**: A single canonical API enforces consistent testing patterns across projects and frameworks, so every team shares the same approach.
- **AI-Friendly**: Single canonical pattern reduces token count for LLMs. One `TestBed.solitary()` example teaches the entire API, unlike 40+ lines of manual setup requiring exhaustive edge-case documentation.

### Framework Support

Suites works seamlessly with frameworks implementing IoC using the same clean API.

<Tabs>
<TabItem value="nestjs" label="NestJS" default>

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
class PaymentService {
  constructor(private gateway: PaymentGateway) {}
}

const { unit, unitRef } = await TestBed.solitary(PaymentService).compile();
```
</TabItem>
<TabItem value="inversify" label="InversifyJS">

```typescript
import { injectable } from 'inversify';

@injectable()
class PaymentService {
  constructor(private gateway: PaymentGateway) {}
}

const { unit, unitRef } = await TestBed.solitary(PaymentService).compile();
```
</TabItem>
<TabItem value="injection-js">

```typescript
import { injectable } from 'injection-js';

@Injectable()
class PaymentService {
  constructor(private gateway: PaymentGateway) {}
}

const { unit, unitRef } = await TestBed.solitary(PaymentService).compile();
```
</TabItem>
</Tabs>

Same API, same patterns across frameworks. All utilities are exported from a single entry point: `@suites/unit`

## In Summary

Suites replaces thousands of lines of brittle, manual test setup with a single, declarative call. Backend teams gain
confidence in their unit testing, improve refactor safety with solitary and sociable unit tests, and enable both
developers and AI tools to write and maintain reliable test suites.

**Ready to try it?** Check out the [Quick Start](/docs/get-started/quickstart) guide to write the first test in 5 minutes.
