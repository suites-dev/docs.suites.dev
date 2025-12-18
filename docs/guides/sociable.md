---
sidebar_position: 4
title: Testing Components Together (Sociable)
description: Testing real component interactions with Suites
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Testing Components Together (Sociable Testing)

> **What this covers:** Testing real component (class) interactions while controlling external dependencies \
> **Time to read:** ~15 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals), [Solitary Unit Tests](./solitary), [Test Doubles](./test-doubles) \
> **Best for:** Verifying components (classes) work together correctly, catching integration bugs while maintaining test speed

Sociable unit tests verify how components interact with their real dependencies while keeping external I/O operations under control. This approach identifies bugs in how business logic components work together - bugs that solitary tests miss.

## Sociable Tests Are Unit Tests

Sociable tests are **unit tests**, not integration tests. They keep external I/O (databases, APIs, file systems) mocked to stay fast and side-effect-free. The integration bugs they catch are issues in how business logic components work with each other - not issues with real external systems. \
For the distinction, see [Unit Testing Fundamentals: Quick Reference](/docs/guides/fundamentals#quick-reference).

## Overview

This tutorial covers:
1. Setting up a sociable test with real dependencies
2. Handling external dependencies and I/O operations
3. Managing multiple dependencies using `.expose()`
4. Choosing when to configure mocks (before vs after compilation)
5. Using a decision framework to choose what to mock

## Step 1: Set Up the First Sociable Test

This example tests a `UserService` that depends on an `EmailValidator`.

### 1.1 Create the Services

```typescript title="src/services/email-validator.ts"
@Injectable()
export class EmailValidator {
  isValid(email: string): boolean {
    return email.includes('@') && email.includes('.');
  }
}
```

```typescript title="src/services/user.service.ts"
@Injectable()
export class UserService {
  constructor(private validator: EmailValidator) {}

  createUser(email: string) {
    if (!this.validator.isValid(email)) {
      throw new Error('Invalid email');
    }
    return { email };
  }
}
```

### 1.2 Write the Sociable Test

The `.expose()` method tells Suites to use the real implementation instead of a mock.

```typescript title="src/services/user.service.spec.ts"
import { TestBed } from '@suites/unit';
import { UserService, EmailValidator } from './services';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const { unit } = await TestBed.sociable(UserService)
      .expose(EmailValidator)  // Use real EmailValidator
      .compile();

    userService = unit;
  });

  it('validates email using real logic', () => {
    const result = userService.createUser('test@example.com');
    expect(result.email).toBe('test@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => userService.createUser('invalid'))
      .toThrow('Invalid email');
  });
});
```
The real `EmailValidator` runs its actual validation logic. If the validator has a bug, this test will detect it.

:::note Token-Based Injection Limitation
`.expose()` only works with **class constructors**. If you're using token-based dependency injection (symbols or strings like InversifyJS), you cannot use `.expose()`. Instead, use [`.mock().final()` or `.mock().impl()`](/docs/guides/dependency-inversion) to provide concrete implementations for tokens.
:::

## Step 2: Handle External Dependencies

Most services interact with external systems like databases. This example extends the previous one.

### 2.1 Add Database Dependency

```typescript title="src/services/user.service.ts"
@Injectable()
export class UserService {
  constructor(
    private validator: EmailValidator,
    @Inject('DATABASE') private db: DatabaseClient  // Token injection
  ) {}

  async createUser(email: string) {
    if (!this.validator.isValid(email)) {
      throw new Error('Invalid email');
    }
    return this.db.users.save({ email });
  }
}
```

### 2.2 Test with Mocked I/O

Dependencies injected using tokens are automatically mocked.

```typescript title="src/services/user.service.spec.ts"
import { TestBed, Mocked } from '@suites/unit';

describe('UserService', () => {
  let userService: UserService;
  let database: Mocked<DatabaseClient>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.sociable(UserService)
      .expose(EmailValidator)
      .compile();

    userService = unit;
    database = unitRef.get<DatabaseClient>('DATABASE');
  });

  it('saves valid user', async () => {
    database.users.save.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const result = await userService.createUser('test@example.com');

    expect(result.id).toBe(1);
    expect(database.users.save).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
```

Third-party packages use `@Inject('TOKEN')` because they're not `@Injectable()` classes. Dependencies injected this way are **always mocked** automatically.

## Step 3: Manage Multiple Dependencies

As services grow, you need to manage more dependencies. Here's how to handle them:

### 3.1 Service with Many Dependencies

```typescript title="src/services/order.service.ts"
@Injectable()
export class OrderService {
  constructor(
    private pricingService: PricingService,
    private taxCalculator: TaxCalculator,
    private inventoryChecker: InventoryChecker,
    private discountEngine: DiscountEngine,
    @Inject('DATABASE') private db: DatabaseClient,
    @Inject('EMAIL_SERVICE') private email: EmailClient
  ) {}

  async processOrder(items: OrderItem[], region: string) {
    const subtotal = this.pricingService.calculateTotal(items);
    const tax = this.taxCalculator.calculateTax(subtotal, region);
    const total = subtotal + tax;

    const order = await this.db.orders.create({ items, subtotal, tax, total });
    await this.email.send({ to: order.customerEmail, template: 'order-confirmation' });

    return order;
  }
}
```

### 3.2 Using `.expose()`

List each dependency that should use its real implementation.

```typescript title="src/services/order.service.spec.ts"
describe('OrderService', () => {
  let orderService: OrderService;
  let database: Mocked<DatabaseClient>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.sociable(OrderService)
      .expose(PricingService)      // Use real implementation
      .expose(TaxCalculator)       // Use real implementation
      .expose(InventoryChecker)    // Use real implementation
      .expose(DiscountEngine)      // Use real implementation
      .compile();

    orderService = unit;
    database = unitRef.get<DatabaseClient>('DATABASE');
  });

  it('processes order with real calculations', async () => {
    const items = [{ price: 10, quantity: 6 }];
    database.orders.create.mockResolvedValue({ id: 123 });

    await orderService.processOrder(items, 'US');

    // All exposed services run real code
    expect(database.orders.create).toHaveBeenCalledWith({
      items,
      subtotal: 54,    // Real discount calculation
      tax: 4.32,       // Real tax calculation
      total: 58.32
    });
  });
});
```

:::tip Understanding the Control Boundary
Suites can only control **explicit dependencies** (passed through constructors). It cannot control implicit dependencies (direct imports). For more, see [Test Doubles](/docs/guides/test-doubles).
:::

## Step 4: Choose When to Configure Mocks

You can configure mocks before compilation (for consistent values) or after compilation (for test-specific scenarios).

<Tabs>
<TabItem value="pre" label="Before Compilation" default>

**When to use:** Set default values that all tests in the suite need.

**Best for:** Shared test data, reducing repetitive setup code

```typescript title="src/services/user.service.spec.ts"
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.sociable(UserService)
    .expose(EmailValidator)
    .mock('DATABASE')
    .final({
      users: {
        save: async () => ({ id: 42, email: 'test@example.com' })
      }
    })
    .compile();

  userService = unit;
  // Database always returns the same value
});

it('creates user', async () => {
  const result = await userService.createUser('test@example.com');
  expect(result.id).toBe(42);  // Always 42
});
```
</TabItem>
<TabItem value="post" label="After Compilation">

**When to use:** Configure different behaviors for individual tests.

**Best for:** Test-specific scenarios, error cases, varying responses

```typescript title="src/services/user.service.spec.ts"
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.sociable(UserService)
    .expose(EmailValidator)
    .compile();

  userService = unit;
  database = unitRef.get<DatabaseClient>('DATABASE');
});

it('handles save error', async () => {
  // Configure for this specific test
  database.users.save.mockRejectedValue(new Error('Connection failed'));

  await expect(userService.createUser('test@example.com'))
    .rejects.toThrow('Connection failed');
});

it('handles successful save', async () => {
  // Different configuration for different test
  database.users.save.mockResolvedValue({ id: 99 });

  const result = await userService.createUser('test@example.com');
  expect(result.id).toBe(99);
});
```
</TabItem>
</Tabs>

## Decision Framework

Use this flowchart to decide how to handle each dependency:

```mermaid
flowchart LR
    A[Dependency] --> B{External I/O?}
    B -->|Yes| C[@Inject TOKEN<br/>Auto-mocked]
    B -->|No| D{Business logic<br/>to test?}
    D -->|Yes| E[.expose Class<br/>Uses real code]
    D -->|No| F[Leave mocked<br/>default behavior]
```

**Rules:**
- **External I/O** (databases, APIs, file systems) → Use token injection → Auto-mocked
- **Business logic** to test → Use `.expose()` → Runs real code
- **Everything else** → Leave as default → Auto-mocked

## Summary

Sociable tests work alongside solitary tests to provide comprehensive coverage:

- **Solitary tests:** Verify individual class behavior in isolation
- **Sociable tests:** Verify components work together correctly

### Takeaways

- Sociable tests verify how components interact using real implementations for business logic
- External systems (I/O) are always mocked using token injection (`@Inject('TOKEN')`)
- Use `.expose()` to specify which dependencies should use real implementations
- Configure mocks before compilation for consistent values, or after for test-specific scenarios
- Follow the decision tree: External I/O → token injection, business logic → expose, everything else stays mocked

## Next Steps

After understanding sociable testing, explore these resources:

- **[Mocking Dependency Inversion](./dependency-inversion)**: Using `.mock().final()` and `.mock().impl()` with token-based DI (symbols, strings)
- **[Test Doubles](./test-doubles)**: Core concepts of mocking and stubbing
- **[Suites Examples Repository](https://github.com/suites-dev/examples)**: Working examples of sociable testing patterns
