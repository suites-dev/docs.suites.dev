---
sidebar_position: 7
title: Virtual Test Container Concept
description: How Suites creates lightweight test environments following inversion of control and dependency injection
---

# Virtual Test Container

> **What this covers:** How Suites creates lightweight test environments without full framework initialization \
> **Time to read:** ~10 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals) \
> **Best for:** Understanding how Suites achieves speed and type safety under the hood

The Virtual Test Container is the engine that drives Suites' testing capabilities. It analyzes classes to understand
their dependencies, then builds minimal test environments tailored specifically for the class under test. This approach eliminates two time-consuming tasks: waiting for a full framework to initialize and manually setting up mocks for every test.

## Overview

This guide covers:
1. What the Virtual Test Container is and its purpose
2. The problems it addresses in IoC testing
3. How it works with automatic mock generation
4. Token injections as boundaries between logic and I/O
5. Performance and type safety characteristics
6. Framework support across dependency injection systems

## Concept

Traditional testing for a single class requires either starting up the entire application (slow and brittle) or manually creating mocks for every dependency (tedious and error-prone).

The virtual test container takes a different approach. It inspects the tested class at test time to discover what
dependencies it needs. Based on this analysis, it generates only the necessary mocks and wires them together. TestBed creates an isolated test environment without the overhead of full application initialization or the maintenance burden of manual mock setup.

## The Problem It Addresses

Before diving into how the Virtual Test Container works, let's understand why it exists. Traditional IoC (Inversion of Control) testing typically relies on two approaches, and both have significant drawbacks.

**Full container initialization:**
- Initializes entire module/application
- Tests break when unrelated dependencies change
- Requires extensive mocking configuration

The problem here is coupling. When spinning up the full container, the test becomes dependent on the entire application state. If a colleague adds a new database connection three layers deep in an unrelated module, the test might suddenly fail or become slower.

**Manual mocking:**
- Requires substantial boilerplate code
- Lacks type safety (requires `as any` / `as unknown as` casts)
- Every constructor change requires updating multiple tests

Manual mocking means writing code like `const mockUserApi = { getUser: jest.fn() } as unknown as UserApi`. This loses TypeScript's type safety. Worse, when adding a parameter to the class constructor, every test file that instantiates it needs updates.

The Virtual Test Container solves both problems by automating the discovery and mock generation process while maintaining full type safety.

## How It Works

Let's walk through a concrete example to see the Virtual Test Container in action.

Here's a service class with two dependencies:

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

When writing a test for this service, Suites analyzes the class structure:

```typescript title='user.service.spec.ts'
import { type Mocked, TestBed } from '@suites/unit';
import { describe } from 'node:test';

let userApi: Mocked<UserApi>;
let database: Mocked<Database>;

describe('User Service Unit Spec', () => {
  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();

    // Virtual container created:
    // - UserService instance (real)
    // - Mocked UserApi (automatically generated)
    // - Mocked Database (automatically generated)

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

Here's what happens behind the scenes when calling `.compile()`:

**Step-by-step process:**
1. **Read metadata**: The Virtual Test Container examines `UserService`'s constructor
2. **Identify dependencies**: It discovers that `UserService` depends on `UserApi` and `Database`
3. **Generate mocks**: It creates fully-typed mock implementations of both dependencies
4. **Wire everything together**: It creates an instance of `UserService` and injects the mocks
5. **Provide access**: It returns typed references to both the service (`unit`) and its mocks (`unitRef`)

All of this happens automatically. The Virtual Test Container handles the entire setup based on the class structure, without manual mock creation or wiring.

## Token Injections Are Natural Boundaries

So far, we've looked at class-based dependencies (like `UserApi` and `Database`). But many applications also use 
token-based injection for external resources. Understanding how the Virtual Test Container handles these tokens is 
important.

Token-injected dependencies are always mocked, regardless of whether the tests run in solitary or sociable mode. This design choice exists for an important reason: tokens typically represent the boundary between application logic and external systems.

Let's look at an example:

```typescript
@Injectable()
class PaymentService {
  constructor(
    private validator: PaymentValidator,              // Class - mocking depends on test mode
    @Inject('STRIPE_API') private stripe: StripeApi,  // Token - always mocked
    @Inject('APP_CONFIG') private config: AppConfig   // Token - always mocked
  ) {}
}
```

Notice the difference. The `validator` dependency is a regular class injection. In solitary mode, Suites mocks it. In sociable mode, it runs as a real instance. But the token-injected dependencies (`STRIPE_API` and `APP_CONFIG`) are always mocked, regardless of test mode.

### Understanding Different Token Types

Tokens come in different flavors, and each requires slightly different handling.

**Class-based tokens** work automatically. Suites analyzes the class structure and generates mocks with stub methods:

```typescript
@Inject('STRIPE_API') private stripe: StripeApi
// Suites automatically creates a mock with all StripeApi methods as stubs
// Configure behavior: stripe.createCharge.mockResolvedValue(...)
```

**Interface/Type/Primitive tokens** need explicit values because TypeScript interfaces and types don't exist at runtime. Suites can't automatically generate a mock from something that disappears after compilation.

Provide values for these tokens using `.final()`:

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

The `.final()` method tells Suites exactly what value to inject for that token, providing complete control over the test environment.

### Why This Matters: The Boundary Pattern

Token injection creates a natural separation in the architecture. This pattern keeps tests fast and predictable without additional configuration.

Tokens typically represent external boundaries - the points where the application interacts with the outside world:
- **Databases**: Data persistence systems
- **HTTP clients**: External API communications
- **External APIs**: Third-party service integrations
- **File systems**: File read/write operations
- **Configuration objects**: Environment-specific settings

By automatically mocking these boundaries, Suites ensures that even sociable tests (which use multiple real classes) remain true unit tests. Tests never accidentally hit real databases or make actual API calls.

Consider this sociable test example:

```typescript
// In sociable mode with multiple real classes
await TestBed.sociable(OrderService)
  .expose(PriceCalculator)  // Real instance
  .expose(TaxCalculator)    // Real instance
  .compile();

// Token-injected @Inject('DATABASE') remains mocked
// Test executes business logic without accessing real external systems
```

In this test, `OrderService`, `PriceCalculator`, and `TaxCalculator` are all real instances. They interact with each other naturally. But any token-injected database connection stays mocked. Business logic runs authentically while keeping tests fast and isolated from external systems.

This separation happens automatically. The Virtual Test Container uses token injection as a signal that something is an I/O boundary.

## Next Steps

Explore how to use the Virtual Test Container in different testing scenarios:

- **[Solitary Unit Tests](/docs/guides/solitary)**: Use the virtual container for complete isolation with automatic mocking
- **[Sociable Unit Tests](/docs/guides/sociable)**: Use `.expose()` for controlled collaboration
