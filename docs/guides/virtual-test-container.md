---
sidebar_position: 7
title: Virtual Test Container
description: How Suites creates lightweight test environments following the IoC principle
---

# Virtual Test Container

> **What this covers:** How Suites creates lightweight test environments without full framework initialization \
> **Time to read:** ~10 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals) \
> **Best for:** Understanding how Suites achieves speed and type safety under the hood

The Virtual Test Container analyzes classes and creates minimal test environments, removing full framework
initialization and manual mock setup while maintaining speed and type safety. Currently optimized for dependency
injection patterns, with support for additional IoC implementations coming soon with `TestBed.manual`.

## Overview

This guide covers:
1. What the Virtual Test Container is and its purpose
2. The problems it solves (slow full containers vs brittle manual mocking)
3. How it works under the hood with automatic mock generation
4. Token injections as natural boundaries between logic and I/O
5. Performance and type safety benefits
6. Framework support across dependency injection systems

## Concept

The Virtual Test Container analyzes class dependencies and creates minimal test environments. Instead of initializing the full application framework, it generates only the required mocks and wiring.

## The Problem It Solves

Traditional IoC testing has two approaches, each with significant drawbacks:

**Full container initialization:**
- Slow (initializes entire application)
- Brittle (breaks when unrelated dependencies change)
- Complex (extensive mocking configuration)

**Manual mocking:**
- Massive boilerplate (many lines per test)
- No type safety (`as any` / `as unknown as ..` casts everywhere)
- Maintenance nightmare (update constructor = update every test)

## How It Works

Suites reads class metadata and auto-generates only the required mocks:

```typescript title='user.service.ts'
@Injectable()
class UserService {
  constructor(
    private readonly userApi: UserApi,
    private readonly database: Database
  ) {}

  async generateRandomUser(): Promise<number> {
    const user = await this.userApi.getRandomUser();
    return this.database.saveUser(user);
  }
}
```

```typescript title='user.service.spec.ts'
import { type Mocked, TestBed } from '@suites/unit';
import { describe } from 'node:test';

let userApi: Mocked<UserApi>;
let database: Mocked<Database>;

describe('User Service Unit Spec', () => {
  beforeAll(async () => {
    // One call creates everything
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();

    // Virtual container created:
    // - UserService instance
    // - Mocked UserApi
    // - Mocked Database

    userApi = unitRef.get(UserApi);
    database = unitRef.get(Database);
  });

  describe('it should save a random user from the api in the database', async () => {
    const dummyUser = { id: 1, name: 'John' };
    userApi.getRandomUser.mockResolvedValue(dummyUser);

    await unit.generateRandomUser();
    expect(database.saveUser).toHaveBeenCalledWith(dummyUser);
  });
})
```

**What happened:**
1. Read `UserService` constructor metadata
2. Found `UserApi` and `Database` dependencies
3. Auto-generated mocks
4. Injected mocks into `UserService`
5. Provided typed access via `unitRef`

## Token Injections Are Natural Boundaries

Token-injected dependencies are always mocked, regardless of test mode.

```typescript
@Injectable()
class PaymentService {
  constructor(
    private validator: PaymentValidator,              // Class (mode decides)
    @Inject('STRIPE_API') private stripe: StripeApi,  // Token - ALWAYS mocked
    @Inject('APP_CONFIG') private config: AppConfig   // Token - ALWAYS mocked
  ) {}
}
```

**Token types and mocking behavior:**

**Class-based tokens** are auto-mocked (all methods become stubs):
```typescript
@Inject('STRIPE_API') private stripe: StripeApi
// ✅ Auto-mocked, methods are stubs
```

**Interface/Type/Primitive tokens** need explicit values:

Use `.final()` to provide values for interface/type/primitive tokens:

```typescript title='database-config.interface.ts'
export interface DatabaseConfig {
  readonly uri: string;
}
```

```typescript
public contructor(@Inject('DB_CONFIG') private config: DatabaseConfig) {}

// In test - provide value using .final():
await TestBed.solitary(UserService)
  .mock<DatabaseConfig>('DB_CONFIG')
  .final({ uri: 'mongodb://localhost' })
  .compile();
```

**Why this matters:**

Tokens typically represent external boundaries:
- Databases
- HTTP clients
- External APIs
- File systems
- Configuration objects

Mocking these dependencies keeps **sociable tests as unit tests** - they never touch external systems.

```typescript
// Even in sociable mode with multiple real classes
await TestBed.sociable(OrderService)
  .expose(PriceCalculator)
  .expose(TaxCalculator)
  .compile();

// But @Inject('DATABASE') is still auto-mocked
// Tests run fast, never hit real database
```

This creates **natural separation** between business logic (real) and external I/O (mocked) without manual configuration.

## Reasons for Using Virtual Test Container

- **Speed:** Creates only required dependencies
  - Full IoC/DI container: 500+ classes, 2-5 seconds
  - Virtual container: 1-10 classes, 50-100ms
- **Type Safety:** Full TypeScript support throughout
- **Automatic:** No manual mock creation or wiring
- **Framework Agnostic:** Same approach for all supported frameworks

## Next Steps

Explore how to use the virtual container in different testing modes:

- **[Solitary Unit Tests](/docs/guides/solitary)**: Use the virtual container for complete isolation with automatic mocking
- **[Sociable Unit Tests](/docs/guides/sociable)**: Use `.expose()` for controlled collaboration

