---
sidebar_position: 4
title: Why Suites?
description: Learn why Suites is essential for testing TypeScript backends with dependency injection
---

# Why Suites?

Large, critical codebases require **quality assurance at the unit level** - but achieving it is harder than it sounds. Unit testing in modern TypeScript backends involves extensive mocking, which makes the process **expensive, slow**, and often skews the **value-to-effort ratio**. Dependency injection only compounds the complexity, turning what should be a simple test into a maze of wiring, stubs, and setup code.

Teams usually face these issues:

**Manual mocks are fragile:** backend teams spend an enormous amount of time manually mocking dependencies. These mocks are often **not typed**, which means they break silently during refactors. When a dependency's interface changes, the issue is then missed at compile time, and the test fails on execution.

```typescript
Test.createTestingModule({
  providers: [
    UserService,
    {
      provide: UserRepository,
      useValue: {
        findById: jest.fn().mockResolvedValue({ id: 1, name: "John" }),
        // 🚨 Issue: If UserRepository adds a required method 'findByEmail',
        // this mock won't implement it and TypeScript won't complain
      },
    },
  ],
}).compile();
```

**Missing implementations cause cryptic errors:** manually written mocks tend to be incomplete. Developers often miss implementing certain dependency methods, leading to **undefined return values** or **nonsensical test errors**, even when the unit's logic is perfectly correct. This erodes confidence in the test suite and wastes time debugging the wrong problem.

```typescript
const module = await Test.createTestingModule({
  providers: [
    UserService,
    {
      provide: EmailService,
      useValue: {
        send: jest.fn().mockResolvedValue(true),
        // 🚨 Issue: Missing 'validate' method that UserService actually calls
      },
    },
  ],
}).compile();

test("should create user", async () => {
  const service = module.get<UserService>(UserService);
  await service.createUser({ email: "test@example.com" });
  // Test fails with: "TypeError: mockEmailService.validate is not a function"
  // Debugging this wastes time - the UserService logic is correct!
});
```

**Naïve auto-mocking isn't safe:** some attempt to solve the boilerplate involved with mocking by using automatic mocking, but they are not type-aware. They allow calling non-existent methods, creating **silently broken tests**. This issue is 10x worse with LLM hallucinations. The result is a false sense of coverage and dangerous gaps in verification.

```typescript
const module = await Test.createTestingModule({
  providers: [TransactionService],
})
  .useMocker(createMock) // NestJS auto-mocking
  .compile();

test("should process payment", async () => {
  const service = module.get<TransactionService>(TransactionService);
  const gateway = module.get<PaymentGateway>(PaymentGateway);

  // 🚨 Issue: 'processPaymentWithRetry' doesn't exist on PaymentGateway
  // but TypeScript doesn't catch it because the mock is typed as 'any'
  await gateway.processPaymentWithRetry({ amount: 100 }); // Typo in method name!

  expect(gateway.charge).toHaveBeenCalled(); // False positive - wrong method was called
  // Test passes but verifies nothing - dangerous silent failure!
});
```

**Too much boilerplate, creating cognitive load and loss of intent:** each engineer ends up writing mocks differently, wiring up dependencies manually, and repeating the same setup logic across hundreds of tests. This boilerplate hides test intention and slows down development. It also introduces inconsistency and cognitive overhead - especially when onboarding new engineers or integrating with AI-assisted coding tools.

```typescript
describe("OrderService", () => {
  let orderService: OrderService;
  let mockInventoryService: jest.Mocked<InventoryService>;
  let mockPaymentService: jest.Mocked<PaymentService>;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockAuditLogger: jest.Mocked<AuditLogger>;

  beforeEach(async () => {
    // 🚨 Issue: 30+ lines of setup before the actual test logic
    mockInventoryService = {
      checkStock: jest.fn(),
      reserveItems: jest.fn(),
      releaseItems: jest.fn(),
    } as any;

    mockPaymentService = {
      authorize: jest.fn(),
      capture: jest.fn(),
      refund: jest.fn(),
    } as any;

    mockNotificationService = {
      sendEmail: jest.fn(),
      sendSMS: jest.fn(),
    } as any;

    mockAuditLogger = {
      log: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: AuditLogger, useValue: mockAuditLogger },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
  });

  // Where is the actual test? Hard to find the signal in the noise!
  test("should place order", async () => {
    mockInventoryService.checkStock.mockResolvedValue(true);
    // ... more mock setup ...
    await orderService.placeOrder({ items: [] });
  });
});
```

**Inconsistent Testing Practices Across Teams:** Different teams often develop their own approaches to testing DI-based applications, leading to inconsistent practices, varied code quality, and challenges when developers switch between projects.

```typescript
// ❌ Team A's approach - manual mocks with Test.createTestingModule
const mockDb = { query: jest.fn() };
const module = await Test.createTestingModule({
  providers: [DataService, { provide: Database, useValue: mockDb }],
}).compile();

// ❌ Team B's approach (different project, same company) - useFactory pattern
const module = await Test.createTestingModule({
  providers: [
    DataService,
    { provide: Database, useFactory: () => ({ query: jest.fn() }) },
  ],
}).compile();

// ❌ Team C's approach (yet another pattern) - custom providers with useClass
@Injectable()
class MockDatabase {
  query = jest.fn();
}
const module = await Test.createTestingModule({
  providers: [DataService, { provide: Database, useClass: MockDatabase }],
}).compile();

// 🚨 Issue: Developers switching teams must learn new patterns each time
// Even within NestJS, there's no standard way to mock dependencies
```

**Steep learning curve for new developers:** New team members often struggle to understand complex testing setups, especially when working with dependency injection frameworks. This learning curve slows down onboarding and can lead to poor testing practices.

```typescript
// ❌ New developer's confusion with DI testing
describe("UserController", () => {
  let controller: UserController;

  beforeEach(async () => {
    // 🚨 Issue: New dev asks - "What is Test.createTestingModule?"
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            /* mock */
          },
        },
        // "Why do I need to provide every dependency manually?"
        // "What's the difference between useValue, useClass, useFactory?"
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    // "Why module.get? Can't I just new UserController()?"
  });

  // Junior dev spends hours understanding the setup, not writing tests
});
```

**LLMs get confused with noisy context:** manually written test setup is verbose and overloaded with boilerplate - every mock, dependency, and initialization adds lines of code that obscure test intent. This verbosity confuses coding assistants (e.g. Claude Code, Cursor) when they try to read and understand existing tests. Moreover, when these tools attempt to generate tests, the excessive boilerplate makes it harder for them to produce correct and complete setups, leading to inconsistent or invalid code.

```typescript
// ❌ LLM sees 50+ lines of boilerplate, struggles to find the intent
import { Test } from "@nestjs/testing";

describe("ReportGenerator", () => {
  let generator: ReportGenerator;
  let mockDbConnection: any;
  let mockCacheService: any;
  let mockFileService: any;
  let mockTemplateEngine: any;
  let mockEmailService: any;

  beforeEach(async () => {
    mockDbConnection = {
      query: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      /* ... 7 more methods */
    };
    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      /* ... 5 more methods */
    };
    mockFileService = {
      read: jest.fn(),
      write: jest.fn(),
      delete: jest.fn(),
      /* ... 9 more methods */
    };
    mockTemplateEngine = {
      compile: jest.fn(),
      render: jest.fn(),
      registerHelper: jest.fn(),
      /* ... 12 more methods */
    };
    mockEmailService = {
      send: jest.fn(),
      validate: jest.fn(),
      /* ... 8 more methods */
    };

    const module = await Test.createTestingModule({
      providers: [
        ReportGenerator,
        { provide: DbConnection, useValue: mockDbConnection },
        { provide: CacheService, useValue: mockCacheService },
        { provide: FileService, useValue: mockFileService },
        { provide: TemplateEngine, useValue: mockTemplateEngine },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    generator = module.get<ReportGenerator>(ReportGenerator);
  });

  // 🚨 Issue: LLM loses track of what the test actually verifies
  // Too much noise-to-signal ratio makes it hard to understand intent
  test("should generate monthly report", async () => {
    // The actual test logic is buried under 60+ lines of setup
  });
});
```

**LLMs need clear feedback to self-correct:** even when LLMs successfully generate test code, the feedback loop that follows is often poor. Because manually written mocks frequently produce cryptic or misleading runtime errors (from missing implementations, undefined returns, to silent method mismatches) LLMs can't interpret what went wrong, leading to infinite loops and burn of tokens.

```typescript
// ❌ Cryptic error breaks LLM's ability to self-correct
import { Test } from "@nestjs/testing";

test("should process transaction", async () => {
  const mockPaymentProcessor = {
    process: jest.fn().mockResolvedValue({ success: true }),
  };

  const module = await Test.createTestingModule({
    providers: [
      TransactionService,
      { provide: PaymentProcessor, useValue: mockPaymentProcessor },
    ],
  }).compile();

  const service = module.get<TransactionService>(TransactionService);
  await service.executeTransaction({ amount: 100 });

  // Runtime error: "Cannot read property 'validate' of undefined"
  // 🚨 Issue: LLM can't determine:
  //   - Is 'validate' missing from the mock?
  //   - Is it a typo in the implementation?
  //   - Is it called on a different object?
  // Result: LLM makes random changes, burning tokens without progress
});
```

### How does Suites solve it?

Suites provides an **opinionated, declarative API** for unit testing TypeScript backends that use dependency injection. Instead of writing mocks by hand, you simply wrap your unit with a single function, and Suites automatically builds a correct, type-safe test environment.

**Type-Safe Mocks:** Suites generates **fully typed mocks**, bound to your implementation. This ensures that refactors don't break tests silently. You can only call existing dependency methods, and every mock interaction is validated at compile time.

```typescript
// ✅ Suites provides fully typed mocks
import { TestBed, Mocked } from "@suites/unit";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  test("should find user by id", async () => {
    userRepository.findById.mockResolvedValue({ id: 1, name: "John" });

    const user = await userService.getUser(1);

    // TypeScript validates at compile time:
    // ✅ userRepository.findById exists and has correct signature
    // ❌ userRepository.nonExistentMethod would be a compile error
    expect(user.name).toBe("John");
  });
});
```

**Smart Mock Tracking:** Every mock is aware of which dependency it represents. Suites automatically tracks and verifies mock usage, eliminating false negatives and providing clear error messages when tests fail.

```typescript
// ✅ Suites tracks which dependency each mock represents
import { TestBed, Mocked } from "@suites/unit";

describe("OrderService", () => {
  let orderService: OrderService;
  let inventoryService: Mocked<InventoryService>;
  let paymentService: Mocked<PaymentService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(OrderService).compile();
    orderService = unit;
    inventoryService = unitRef.get(InventoryService);
    paymentService = unitRef.get(PaymentService);
  });

  test("should process order", async () => {
    inventoryService.checkStock.mockResolvedValue(true);
    paymentService.charge.mockResolvedValue({ success: true });

    await orderService.placeOrder({ items: ["item1"] });

    // Suites knows exactly which dependency was called
    expect(inventoryService.checkStock).toHaveBeenCalledWith(["item1"]);
    // Clear error if assertion fails: "Expected InventoryService.checkStock to be called with..."
  });
});
```

**Declarative API:** By describing your unit's dependencies declaratively, Suites removes the need for repetitive wiring and setup. Tests become shorter, intention-revealing, and much easier to maintain.

```typescript
// ✅ Suites eliminates boilerplate with declarative API
import { TestBed, Mocked } from "@suites/unit";

describe("OrderService", () => {
  let orderService: OrderService;
  let inventoryService: Mocked<InventoryService>;
  let paymentService: Mocked<PaymentService>;
  let notificationService: Mocked<NotificationService>;
  let auditLogger: Mocked<AuditLogger>;

  beforeAll(async () => {
    // One declarative call replaces 30+ lines of manual mock setup
    const { unit, unitRef } = await TestBed.solitary(OrderService).compile();

    orderService = unit;
    inventoryService = unitRef.get(InventoryService);
    paymentService = unitRef.get(PaymentService);
    notificationService = unitRef.get(NotificationService);
    auditLogger = unitRef.get(AuditLogger);
    // All dependencies are automatically mocked and typed!
  });

  test("should place order", async () => {
    // Test intent is immediately clear - no noise!
    inventoryService.checkStock.mockResolvedValue(true);
    await orderService.placeOrder({ items: [] });
  });
});
```

**DI and Test Library Integration:** Suites integrates seamlessly with popular DI frameworks like **NestJS** and **InversifyJS**, and testing libraries such as **Jest**, **Vitest**, and **Sinon** - working out of the box in existing projects.

```typescript
// ✅ Suites works with NestJS out of the box
import { TestBed } from "@suites/unit";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController (NestJS)", () => {
  let controller: UserController;
  let userService: Mocked<UserService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserController).compile();
    controller = unit;
    userService = unitRef.get(UserService);
  });

  // Works seamlessly with your existing NestJS setup!
});

// ✅ Also works with InversifyJS
import { injectable } from "inversify";

@injectable()
class PaymentService {
  constructor(private gateway: PaymentGateway) {}
}

describe("PaymentService (InversifyJS)", () => {
  let service: PaymentService;
  let gateway: Mocked<PaymentGateway>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(PaymentService).compile();
    service = unit;
    gateway = unitRef.get(PaymentGateway);
  });

  // InversifyJS decorators are automatically recognized!
});
```

**AI-Friendly by Design:** Because Suites eliminates boilerplate and enforces type safety, LLMs can now generate **correct unit tests in a single pass**. Suites reduces the amount of context needed to reason about dependencies, allowing AI-assisted tools to understand, modify, and maintain tests accurately.

```typescript
// ✅ LLMs can easily understand and generate Suites tests
import { TestBed, Mocked } from "@suites/unit";

describe("ReportGenerator", () => {
  let generator: ReportGenerator;
  let dbConnection: Mocked<DatabaseConnection>;
  let templateEngine: Mocked<TemplateEngine>;

  beforeAll(async () => {
    // Clean, minimal setup - LLM instantly understands the structure
    const { unit, unitRef } = await TestBed.solitary(ReportGenerator).compile();
    generator = unit;
    dbConnection = unitRef.get(DatabaseConnection);
    templateEngine = unitRef.get(TemplateEngine);
  });

  test("should generate monthly report", async () => {
    // Clear intent - no noise obscuring the test logic
    dbConnection.query.mockResolvedValue([{ id: 1, revenue: 1000 }]);
    templateEngine.render.mockResolvedValue("<html>Report</html>");

    const report = await generator.generateMonthlyReport("2024-01");

    expect(report).toContain("Report");
    // LLM can easily understand what's being tested and why
    // Type errors are caught at compile time, giving LLM clear feedback
  });
});
```

**Standardized Testing Across Teams**: Suites provides a standardized, opinionated approach to testing that works consistently across different DI frameworks. This creates a unified testing experience for all teams while allowing flexibility in implementation details.

```typescript
// ✅ Same pattern across all teams and projects
// Team A (NestJS project)
const { unit, unitRef } = await TestBed.solitary(ServiceA).compile();

// Team B (InversifyJS project)
const { unit, unitRef } = await TestBed.solitary(ServiceB).compile();

// Team C (Plain TypeScript with DI)
const { unit, unitRef } = await TestBed.solitary(ServiceC).compile();

// All teams use the same testing pattern!
// Developers switching teams instantly understand the test structure
// Code reviews are consistent across the entire organization
```

**Intuitive Onboarding and Testing Model**: With its intuitive API and consistent patterns, Suites reduces the learning curve for new developers. The clear separation between solitary and sociable testing approaches provides a straightforward mental model that's easy to grasp.

```typescript
// ✅ New developers immediately understand the pattern
import { TestBed, Mocked } from "@suites/unit";

describe("UserController", () => {
  let controller: UserController;
  let userService: Mocked<UserService>;

  beforeAll(async () => {
    // Junior dev thinks: "TestBed creates my test environment"
    // "solitary() means I'm testing UserController in isolation"
    // "compile() builds everything I need"
    const { unit, unitRef } = await TestBed.solitary(UserController).compile();

    controller = unit; // "This is my unit under test"
    userService = unitRef.get(UserService); // "This is a mock of the dependency"
  });

  test("should get user", async () => {
    // Clear, predictable pattern - easy to learn and remember
    userService.findById.mockResolvedValue({ id: 1, name: "John" });
    const result = await controller.getUser(1);
    expect(result.name).toBe("John");
  });

  // New dev is productive on day one, not day ten!
});
```

### In Summary

Suites replaces thousands of lines of brittle, manual test setup with a single, declarative call - giving backend teams confidence in their tests, improving refactor safety, and enabling both developers and AI tools to write and maintain reliable test suites effortlessly.
