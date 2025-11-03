---
sidebar_position: 1
title: Why Suites
description: Automated dependency mocking for TypeScript DI applications
---

# Why Suites?

**Suites reduces testing boilerplate by 80% for TypeScript applications using dependency injection.**

## The Problem: Testing DI Applications Is Painful

If you're using NestJS, InversifyJS, or any dependency injection framework, you know this pain:

### Pain #1: Manual Mock Setup Hell

Every test file requires the same tedious setup:

```typescript
describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockRepository: jest.Mocked<PaymentRepository>;
  let mockGateway: jest.Mocked<PaymentGateway>;
  let mockLogger: jest.Mocked<Logger>;
  let mockEmailService: jest.Mocked<EmailService>;
  let mockAnalytics: jest.Mocked<AnalyticsService>;

  beforeEach(() => {
    // Manually create every mock...
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    } as any;

    mockGateway = {
      charge: jest.fn(),
      refund: jest.fn(),
      authorize: jest.fn(),
      capture: jest.fn(),
    } as any;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as any;

    mockEmailService = {
      send: jest.fn(),
      validate: jest.fn(),
      template: jest.fn(),
    } as any;

    mockAnalytics = {
      track: jest.fn(),
      identify: jest.fn(),
    } as any;

    // Manually wire everything together...
    paymentService = new PaymentService(
      mockRepository,
      mockGateway,
      mockLogger,
      mockEmailService,
      mockAnalytics
    );
  });

  it('should process payment', async () => {
    // Finally, your actual test...
    mockRepository.findById.mockResolvedValue(testUser);
    mockGateway.charge.mockResolvedValue({ status: 'success' });

    await paymentService.process('user-123', 50);

    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

**50+ lines of boilerplate before you even write a test.**

### Pain #2: Type Safety Requires Manual Casts

Notice all the `as any` casts? You're bypassing TypeScript's safety:

```typescript
const mockRepo = {
  findById: jest.fn(),
  // Typo in method name? TypeScript won't catch it!
  savve: jest.fn(),  // ← Should be "save"
} as any;  // ← Hiding the error
```

Production code breaks, but tests pass. False sense of security.

### Pain #3: Maintenance Nightmare

Add one dependency to your constructor?

```typescript
@Injectable()
class PaymentService {
  constructor(
    private repository: PaymentRepository,
    private gateway: PaymentGateway,
    private logger: Logger,
    private emailService: EmailService,
    private analytics: AnalyticsService,
    private auditLog: AuditLogService,  // ← New dependency!
  ) {}
}
```

Now update **every test file**:
- Create `mockAuditLog`
- List all its methods
- Add it to the constructor
- Add type cast

**Across dozens or hundreds of test files.**

### Pain #4: DI Framework Loses Its Benefits

The whole point of dependency injection is automatic wiring. But in tests?

```typescript
// Production: DI framework handles everything ✅
@Injectable()
class PaymentService { ... }

// Tests: Back to manual wiring ❌
const service = new PaymentService(dep1, dep2, dep3, dep4, dep5);
```

You lose:
- Automatic dependency resolution
- Token-based injection
- Decorator metadata
- Scoped instances

## The Solution: Virtual DI Container

Suites introduces the [**Virtual DI Container**](/docs/guides/virtual-di-container) - a revolutionary approach that:

1. **Reads your DI metadata** (decorators, tokens, types)
2. **Creates a minimal test environment** (only what you need)
3. **Auto-generates type-safe mocks** for all dependencies
4. **Wires everything together** automatically

### Same Test, With Suites

```typescript
describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockRepository: Mocked<PaymentRepository>;
  let mockGateway: Mocked<PaymentGateway>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(PaymentService).compile();
    paymentService = unit;
    mockRepository = unitRef.get(PaymentRepository);
    mockGateway = unitRef.get(PaymentGateway);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process payment', async () => {
    mockRepository.findById.mockResolvedValue(testUser);
    mockGateway.charge.mockResolvedValue({ status: 'success' });

    await paymentService.process('user-123', 50);

    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

**From 50+ lines to 5 lines. That's an 80%+ reduction.**

## What Makes Suites Different

### 1. Automatic Mock Generation

```typescript
// Suites analyzes your class:
@Injectable()
class PaymentService {
  constructor(
    private repository: PaymentRepository,    // ← Auto-mocked
    private gateway: PaymentGateway,          // ← Auto-mocked
    @Inject('LOGGER') private logger: Logger  // ← Auto-mocked
  ) {}
}

// And creates all mocks automatically:
const { unit, unitRef } = await TestBed.solitary(PaymentService).compile();

// Type-safe access to any dependency:
const repo = unitRef.get(PaymentRepository);
const gateway = unitRef.get(PaymentGateway);
const logger = unitRef.get('LOGGER');
```

No manual mock creation. No type casts. Full type safety.

### 2. Zero-Config Type Safety

```typescript
const repository = unitRef.get(PaymentRepository);

// ✅ TypeScript knows all methods
repository.findById.mockResolvedValue(user);
repository.save.mockResolvedValue();

// ❌ Compile-time error: method doesn't exist
repository.savve.mockResolvedValue();  // Typo caught!
```

### 3. Constructor Changes? No Problem.

Add a new dependency:

```typescript
@Injectable()
class PaymentService {
  constructor(
    private repository: PaymentRepository,
    private gateway: PaymentGateway,
    private auditLog: AuditLogService,  // ← New!
  ) {}
}
```

Your tests still work. Zero changes needed. Suites auto-mocks the new dependency.

### 4. Token Injections: Natural Boundaries

Dependencies injected via tokens are **automatically mocked**, ensuring tests never touch external systems:

```typescript
@Injectable()
class PaymentService {
  constructor(
    private validator: PaymentValidator,      // Class (test mode decides)
    @Inject('DATABASE') private db: Database, // ← ALWAYS mocked
    @Inject('STRIPE') private stripe: Stripe  // ← ALWAYS mocked
  ) {}
}
```

**Your tests never touch:**
- Databases
- HTTP APIs
- File systems
- Message queues
- External services

Even in sociable tests, token injections create **natural test boundaries**.

### 5. Two Testing Modes: Solitary & Sociable

**Solitary:** Complete isolation (all dependencies mocked)

```typescript
await TestBed.solitary(OrderService).compile();
// OrderService + all mocks
```

**Sociable:** Mix real business logic with mocked I/O

```typescript
await TestBed.sociable(OrderService)
  .boundaries([ComplexTaxEngine])  // Avoid only this
  .compile();
// Real PriceCalculator + OrderValidator
// Mocked TaxEngine + all token dependencies
```

Test realistic scenarios without spinning up databases.

### 6. Fail-Fast Prevents False Positives

```typescript
const repo = unitRef.get(PaymentRepository);

// Forgot to configure the mock?
const result = await paymentService.process('123', 50);

// v3.x: Returns undefined silently → test passes incorrectly ❌
// v4.x: Throws immediately → catches the mistake ✅
```

No more "lying tests" that pass when they should fail.

### 7. AI-Ready Format

Concise, type-safe syntax means AI coding agents write correct tests in a single pass:

```typescript
// AI agents (Claude Code, Cursor, etc.) can generate this easily:
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
const mockRepo = unitRef.get(UserRepository);
mockRepo.findById.mockResolvedValue(testUser);
```

No hallucinated method names. No missing mocks. Just working tests.

## Real-World Impact

### Before Suites
- **Test setup:** 25-50+ lines per file
- **Time per test file:** 10-15 minutes (writing boilerplate)
- **Maintenance:** Update constructor → update all tests
- **Type safety:** Manual casts everywhere
- **False positives:** Common (undefined returns)

### After Suites
- **Test setup:** 3-5 lines per file
- **Time per test file:** 2-3 minutes (focus on logic)
- **Maintenance:** Constructor changes? Tests still work
- **Type safety:** Automatic, zero config
- **False positives:** Prevented by fail-fast

**Result:** Teams spend 80% less time on test setup and maintenance.

## When to Use Suites

### Perfect For

✅ **NestJS applications** - First-class support
✅ **InversifyJS applications** - Full feature parity
✅ **Classes with 3+ dependencies** - Maximum benefit
✅ **Type-safe testing** - Without manual effort
✅ **Fast test execution** - No full container initialization
✅ **Solitary and sociable tests** - Flexible testing strategies

### Not Needed For

❌ **Plain functions** - Manual mocks are fine
❌ **1-2 dependencies** - Boilerplate minimal
❌ **Non-DI applications** - No metadata to leverage

## What's New in v4.0.0

### `.boundaries()` Mode: The Future of Sociable Testing

Instead of listing what to keep real (`.expose()`), list what to **avoid**:

```typescript
// Old way (.expose): Whitelist real dependencies
await TestBed.sociable(OrderService)
  .expose(PriceCalculator)
  .expose(OrderValidator)
  .expose(InventoryChecker)
  .compile();

// New way (.boundaries): Blacklist complex dependencies
await TestBed.sociable(OrderService)
  .boundaries([ComplexTaxEngine])  // Only avoid this
  .compile();
```

**Benefits:**
- **Future-proof:** New dependencies automatically tested
- **Simpler:** List only what to avoid
- **Safer:** Default to real (catches regressions)

### Fail-Fast Enabled by Default

Prevents "lying tests" by throwing errors for unconfigured mocks:

```typescript
// Forgot to mock a method that gets called?
mockRepo.findById.mockResolvedValue(user);
// Oops, forgot to mock .save()

await service.process();
// v4.0.0: Throws immediately ✅
// v3.x: Returns undefined → test passes incorrectly ❌
```

See [Fail-Fast Behavior](/docs/api-reference/fail-fast) for details.

## How It Works: Under the Hood

Suites' [**Virtual DI Container**](/docs/guides/virtual-di-container) analyzes your DI framework's metadata:

```mermaid
flowchart LR
    A[Your Class] --> B[Read DI Metadata]
    B --> C[Analyze Dependencies]
    C --> D[Create Virtual Container]
    D --> E[Auto-Generate Mocks]
    E --> F[Wire Everything]
    F --> G[Return unit + unitRef]
```

**Key insight:** Instead of initializing your entire application (slow, brittle), Suites creates a **minimal test environment** with only what you need.

Learn more: [Virtual DI Container](/docs/guides/virtual-di-container)

## Framework Support

Suites provides adapters for popular DI frameworks:

- **NestJS** - `@suites/unit.nestjs`
- **InversifyJS** - `@suites/unit.inversify`

Same API across frameworks. Write tests once, switch frameworks without rewriting tests.

## Next Steps

Ready to eliminate testing boilerplate?

- **[Installation](/docs/get-started/installation)** - Set up Suites in 2 minutes
- **[Quick Start](/docs/get-started/quickstart)** - Write your first test
- **[API Reference](/docs/api-reference/)** - Deep dive into features
- **[Virtual DI Container](/docs/guides/virtual-di-container)** - Understand the core innovation
