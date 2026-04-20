---
sidebar_position: 5
title: Dependency Inversion
description: Using .mock().final() with token-based dependency injection
---

# Dependency Inversion

> **What this covers:** Using `.mock().final()` with token-based dependency injection (symbols, strings) \
> **Time to read:** ~10 minutes \
> **Prerequisites:** [Sociable Unit Tests](./sociable), [Mock Configuration](/docs/api-reference/mock-configuration) \
> **Best for:** Working with Inversify, custom DI containers, or any framework using symbol/string tokens

When using dependency injection frameworks that rely on **token-based injection** (symbols or strings instead of class constructors), you cannot use `.expose()` to provide real implementations. Instead, use `.mock().final()` to configure concrete implementations for these tokens.

## The Problem with Token-Based Injection

Many dependency injection frameworks use tokens (symbols or strings) to identify dependencies rather than class constructors. Examples include:

- **InversifyJS**: Uses `Symbol` tokens
- **Custom DI containers**: Often use string tokens
- **NestJS**: Can use string tokens via `@Inject('TOKEN')`

When you try to use `.expose()` with a token, Suites cannot determine what concrete implementation to use:

```typescript
// ❌ This doesn't work with token-based injection
const TYPES = {
  UserRepository: Symbol.for("UserRepository"),
};

const { unit } = await TestBed.sociable(UserService)
  .expose(TYPES.UserRepository) // Error: Suites can't determine the concrete class
  .compile();
```

The issue is that a token (symbol or string) doesn't carry information about the concrete implementation class. Suites needs to know which class to instantiate.

## Solution: Use `.mock().final()`

Instead of `.expose()`, use `.mock().final()` to provide the concrete implementation for token-based dependencies.

### When to Use `.mock().final()`

Use `.mock().final()` when:

- You want a fixed implementation that won't change across tests
- You don't need to retrieve or modify the mock after compilation
- You're providing configuration objects or simple implementations

## Example: InversifyJS with Symbol Tokens

This example shows how to test a service that uses InversifyJS with symbol-based tokens.

### 1. Define Tokens and Interfaces

```typescript title="src/types.ts"
export const TYPES = {
  UserRepository: Symbol.for("UserRepository"),
  EmailService: Symbol.for("EmailService"),
  Database: Symbol.for("Database"),
};

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<User>;
}

export interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

export interface Database {
  connect(): Promise<void>;
  query(sql: string): Promise<any[]>;
}
```

### 2. Implement Concrete Classes

```typescript title="src/repositories/user.repository.ts"
import { injectable } from "inversify";
import { TYPES, UserRepository, User } from "../types";

@injectable()
export class UserRepositoryImpl implements UserRepository {
  async findById(id: number): Promise<User | null> {
    // Real implementation
    return { id, name: "John Doe" };
  }

  async save(user: User): Promise<User> {
    // Real implementation
    return { ...user, id: Date.now() };
  }
}
```

```typescript title="src/services/user.service.ts"
import { injectable, inject } from "inversify";
import { TYPES, UserRepository, EmailService } from "../types";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: UserRepository,
    @inject(TYPES.EmailService) private emailService: EmailService
  ) {}

  async createUser(name: string, email: string): Promise<User> {
    const user = await this.userRepo.save({ name, email });
    await this.emailService.send(email, "Welcome", `Hello ${name}!`);
    return user;
  }
}
```

### 3. Test with `.mock().final()`

Use `.mock().final()` to provide a fixed implementation that behaves consistently across all tests:

```typescript title="src/services/user.service.spec.ts"
import { TestBed } from "@suites/unit";
import { UserService } from "./user.service";
import { UserRepositoryImpl } from "../repositories/user.repository";
import { TYPES, UserRepository, EmailService } from "../types";

describe("UserService with .mock().final()", () => {
  let userService: UserService;

  beforeAll(async () => {
    const { unit } = await TestBed.solitary(UserService)
      // Provide concrete implementation for symbol token
      .mock<UserRepository>(TYPES.UserRepository)
      .final({
        findById: async (id: number) => ({ id, name: "Test User" }),
        save: async (user: Omit<User, "id">) => ({ ...user, id: 123 }),
      })
      // Email service stays mocked (default behavior)
      .compile();

    userService = unit;
  });

  it("creates user with fixed repository behavior", async () => {
    const user = await userService.createUser("Alice", "alice@example.com");

    expect(user.id).toBe(123);
    expect(user.name).toBe("Alice");
  });
});
```

## Example: String Tokens

The same approach works with string tokens:

```typescript title="src/services/payment.service.ts"
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class PaymentService {
  constructor(
    @Inject("STRIPE_API") private stripe: StripeApi,
    @Inject("PAYMENT_CONFIG") private config: PaymentConfig
  ) {}

  async processPayment(amount: number): Promise<PaymentResult> {
    return this.stripe.charge(amount, this.config.currency);
  }
}
```

```typescript title="src/services/payment.service.spec.ts"
import { TestBed } from "@suites/unit";
import { PaymentService } from "./payment.service";
import { StripeApiImpl } from "../integrations/stripe-api";

describe("PaymentService with string tokens", () => {
  let paymentService: PaymentService;

  beforeAll(async () => {
    const { unit } = await TestBed.solitary(PaymentService)
      .mock<StripeApi>("STRIPE_API")
      .final({
        charge: async (amount: number, currency: string) => ({
          id: "ch_123",
          amount,
          currency,
          status: "succeeded",
        }),
      })
      .mock<PaymentConfig>("PAYMENT_CONFIG")
      .final({ currency: "USD", apiKey: "test-key" })
      .compile();

    paymentService = unit;
  });

  it("processes payment with configured mocks", async () => {
    const result = await paymentService.processPayment(100);

    expect(result.id).toBe("ch_123");
    expect(result.amount).toBe(100);
    expect(result.currency).toBe("USD");
  });
});
```

## Comparison: `.expose()` vs `.mock().final()`

| Method            | Works with Class Tokens | Works with Symbol/String Tokens | Retrievable via `unitRef` | Use Case                             |
| ----------------- | ----------------------- | ------------------------------- | ------------------------- | ------------------------------------ |
| `.expose()`       | ✅ Yes                  | ❌ No                           | ❌ No                     | Real implementation, class-based DI  |
| `.mock().final()` | ✅ Yes                  | ✅ Yes                          | ❌ No                     | Fixed behavior, configuration values |

## Key Takeaways

1. **Token-based injection** (symbols/strings) cannot use `.expose()` because Suites can't determine the concrete class
2. **Use `.mock().final()`** for fixed implementations that don't need modification
3. **`.mock().final()` works** with class constructors, symbols, and strings

## Related Guides

- [Sociable Unit Tests](./sociable) - Testing with real dependencies
- [Mock Configuration](/docs/api-reference/mock-configuration) - Detailed API reference
- [Test Doubles](./test-doubles) - Understanding mocks and stubs
- [Virtual Test Container](./virtual-test-container) - How Suites handles token injection
