---
sidebar_position: 6
title: Virtual DI Container
description: How Suites creates lightweight test environments
---

# Virtual DI Container

## What Is It?

The Virtual DI Container is Suites' core innovation. Instead of initializing your full DI framework, Suites analyzes your class and creates a minimal test environment with only what you need.

## The Problem It Solves

Traditional DI testing has two poor options:

**Full container initialization:**
- Slow (initializes entire application)
- Brittle (breaks when unrelated deps change)
- Complex (extensive mocking configuration)

**Manual mocking:**
- Massive boilerplate (40+ lines per test)
- No type safety (`as any` casts everywhere)
- Maintenance nightmare (update constructor = update every test)

## How It Works

Suites reads your class's DI metadata and auto-generates only the mocks needed:

```typescript
@Injectable()
class UserService {
  constructor(
    private userApi: UserApi,
    private database: Database
  ) {}

  async generateRandomUser(): Promise<number> {
    const user = await this.userApi.getRandom();
    return this.database.saveUser(user);
  }
}

// One call creates everything
const { unit, unitRef } = await TestBed.solitary(UserService).compile();

// Virtual container created:
// - UserService instance
// - Mocked UserApi
// - Mocked Database
// All type-safe, all wired correctly

const userApi = unitRef.get(UserApi);
const database = unitRef.get(Database);

userApi.getRandom.mockResolvedValue({ id: 1, name: 'John' });
database.saveUser.mockResolvedValue(42);

const result = await unit.generateRandomUser();
expect(result).toBe(42);
```

**What happened:**
1. Read UserService constructor metadata
2. Found UserApi and Database dependencies
3. Auto-generated mocks
4. Injected mocks into UserService
5. Provided typed access via unitRef

## Token Injections: Natural Boundaries

**Critical concept:** Token-injected dependencies are always auto-mocked, regardless of test mode.

```typescript
@Injectable()
class PaymentService {
  constructor(
    private validator: PaymentValidator,           // Class (mode decides)
    @Inject('STRIPE_API') private stripe: Stripe   // Token - ALWAYS mocked
  ) {}
}
```

**Why this matters:**

Tokens typically represent:
- Databases
- HTTP clients
- External APIs
- File systems
- Caches

By auto-mocking these, Suites ensures **sociable tests are still unit tests** - they never touch external systems.

```typescript
// Even in sociable mode with many real classes
await TestBed.sociable(OrderService)
  .boundaries()  // Everything real!
  .compile();

// But @Inject('DATABASE') is still auto-mocked
// Tests run fast, never hit real database
```

This creates **natural test boundaries** without manual configuration.

## Benefits

**Speed:** Only creates what you need
- Full container: 500+ classes, 2-5 seconds
- Virtual container: 1-10 classes, 50-100ms

**Type Safety:** Full TypeScript support throughout

**Automatic:** No manual mock creation or wiring

**Framework Agnostic:** Same approach for NestJS and InversifyJS

See [Adapters](/docs/guides/adapters) for framework-specific details.

## Next Steps

- [Solitary Unit Tests](/docs/guides/solitary) - Using the virtual container in isolation mode
- [Sociable Unit Tests](/docs/guides/sociable) - Using with boundaries/expose modes
- [API Reference](/docs/api-reference/) - Technical details
