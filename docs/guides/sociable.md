---
sidebar_position: 3
title: Sociable Unit Tests
description: Testing real component (class) interactions with Suites
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Sociable Unit Tests

> **What this covers:** Testing real component (class) interactions while controlling external dependencies with Suites \
> **Time to read:** ~15 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals), [Solitary Unit Tests](./solitary.md), [Test Doubles](./test-doubles.md) \
> **Best for:** Verifying components (classes) work together correctly, catching integration bugs while maintaining test speed 

Sociable unit tests verify how components interact with real dependencies while mocking external I/O. This approach catches integration bugs that solitary tests miss, ensuring components work together correctly.

:::info Important: Sociable Are Still Unit Tests
Sociable tests are **unit tests**, not integration tests. They mock external I/O (databases, APIs, file systems) to stay
fast and side-effect-free. The "integration bugs" they catch are issues in how business logic components interact with
each other - not issues with real external systems. \
For the distinction, see [Unit Testing Fundamentals: Quick Reference](/docs/guides/fundamentals#quick-reference).
:::

## Overview

This tutorial walks you through:
1. Setting up your first sociable test with real dependencies
2. Handling external dependencies and I/O operations
3. Scaling with multiple dependencies using `.expose()`
4. Choosing configuration patterns (pre vs post compilation)
5. Common patterns and decision frameworks

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

The `.expose()` method makes `EmailValidator` use its real implementation instead of a mock.

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
The real `EmailValidator` runs its actual validation logic. If the validator has a bug, this test catches it.

## Step 2: Handle External Dependencies

Most services need external I/O like databases. This example extends the previous one.

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

Token-injected dependencies are automatically mocked.

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

:::info Token Injections Are Always Mocked
External packages use `@Inject('TOKEN')` because they're not `@Injectable()` classes.
These token-injected dependencies are **always mocked**, even in sociable tests.
See [Virtual Test Container: Token Injections](./virtual-test-container#token-injections-are-natural-boundaries) for the complete explanation.
:::

## Step 3: Scale with Multiple Dependencies

As services grow, two approaches exist for handling multiple dependencies.

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

List each dependency that should be real.

```typescript title="src/services/order.service.spec.ts"
describe('OrderService', () => {
  let orderService: OrderService;
  let database: Mocked<DatabaseClient>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.sociable(OrderService)
      .expose(PricingService)      // Explicitly make real
      .expose(TaxCalculator)       // Explicitly make real
      .expose(InventoryChecker)    // Explicitly make real
      .expose(DiscountEngine)      // Explicitly make real
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
TestBed can only control **explicit dependencies** (constructor-injected), not implicit ones (direct imports).
:::

## Step 4: Choose Configuration Patterns

Choose between configuring mocks before or after compilation.

<Tabs>
<TabItem value="pre" label="Pre-compilation" default>

:bulb: **Set fixed mock values for all tests in the suite.** Best for Default values, shared test data, reducing boilerplate

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
<TabItem value="post" label="Post-compilation">

:bulb: **Configure mocks differently for each test.** Best for Test-specific scenarios, error cases, varying responses

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

```mermaid
flowchart LR
    A[Dependency] --> B{External I/O?}
    B -->|Yes| C[@Inject TOKEN<br/>Auto-mocked]
    B -->|No| D{Business logic<br/>to test?}
    D -->|Yes| E[.expose Class<br/>Runs real]
    D -->|No| F[Leave mocked<br/>default]
```

## Summary

Sociable tests complement solitary tests by verifying component interactions:

- **Solitary tests:** Verify individual class behavior in isolation
- **Sociable tests:** Verify components work together correctly

### Takeaways

- **Sociable tests** verify how components interact using real dependencies for business logic
- **External I/O** is always mocked using token injection (`@Inject('TOKEN')`)
- **Use `.expose()`** to explicitly list which dependencies should use real implementations
- **Configuration** can be done pre-compilation (fixed values) or post-compilation (test-specific)
- **Decision tree**: External I/O → token injection, business logic → expose, everything else stays mocked

## Next Steps

After understanding sociable testing, explore these resources for deeper knowledge:

- **[Test Doubles](./test-doubles.md)**: Core concepts of mocking and stubbing
- **[Virtual Test Container](./virtual-test-container.md)**: How TestBed manages dependencies
