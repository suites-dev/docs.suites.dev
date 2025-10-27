---
title: Managing Dependencies & Side Effects
description: "Master dependency injection patterns, constructor best practices, and immutability principles for creating highly testable code with Suites"
keywords: ["dependency injection", "side effects", "constructor injection", "immutability", "testable code", "Suites Academy"]
sidebar_position: 2
---

# Managing Dependencies & Side Effects

Well-managed dependencies and controlled side effects are the foundation of testable code. This module explores best practices for dependency injection, constructor logic, and maintaining immutability to create units that are easy to test with Suites.

## Core Principles

### <i class="fas fa-bullseye"></i> Constructor-Only Injection

The single most important principle for testable classes is **constructor-only injection**. This means all dependencies should be provided through the constructor, never created internally or fetched from global state.

**✅ Good: Constructor Injection**
```typescript
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly emailService: EmailService
  ) {}

  async processOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    await this.paymentGateway.charge(order.total);
    await this.emailService.sendConfirmation(order.email);
  }
}
```

**❌ Bad: Hidden Dependencies**
```typescript
export class OrderService {
  private emailService: EmailService;
  
  constructor(private readonly orderRepository: OrderRepository) {
    // Hidden dependency - makes testing difficult
    this.emailService = new EmailService();
  }

  async processOrder(orderId: string): Promise<void> {
    // Using global/static reference - hard to mock
    await GlobalPaymentGateway.charge(order.total);
  }
}
```

### <i class="fas fa-lock"></i> Keep Constructors Pure

Constructors should only assign dependencies to private fields. They should never:
- Perform I/O operations
- Make network calls
- Initialize complex state
- Start background processes

**✅ Good: Pure Constructor**
```typescript
export class MetricsCollector {
  constructor(
    private readonly metricsStore: MetricsStore,
    private readonly config: MetricsConfig
  ) {}

  startCollection(): void {
    // Initialization logic in a separate method
    setInterval(() => this.collect(), this.config.interval);
  }
}
```

**❌ Bad: Side Effects in Constructor**
```typescript
export class MetricsCollector {
  constructor(
    private readonly metricsStore: MetricsStore,
    config: MetricsConfig
  ) {
    // Side effect in constructor - runs during test setup!
    setInterval(() => this.collect(), config.interval);
  }
}
```

## Immutability and State Management

### <i class="fas fa-box"></i> Prefer Immutable Data

Immutable data structures prevent unexpected mutations and make your code more predictable and easier to test.

**✅ Good: Immutable Operations**
```typescript
export class ShoppingCart {
  constructor(private readonly items: ReadonlyArray<CartItem> = []) {}

  addItem(item: CartItem): ShoppingCart {
    // Returns new instance instead of mutating
    return new ShoppingCart([...this.items, item]);
  }

  removeItem(itemId: string): ShoppingCart {
    return new ShoppingCart(
      this.items.filter(item => item.id !== itemId)
    );
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}
```

**❌ Bad: Mutable State**
```typescript
export class ShoppingCart {
  constructor(private items: CartItem[] = []) {}

  addItem(item: CartItem): void {
    // Mutates internal state
    this.items.push(item);
  }

  removeItem(itemId: string): void {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
```

### <i class="fas fa-sync-alt"></i> Explicit State Transitions

When state changes are necessary, make them explicit through methods rather than allowing direct property access.

**✅ Good: Controlled State Changes**
```typescript
export class OrderStateMachine {
  constructor(private readonly state: OrderState = OrderState.PENDING) {}

  canTransitionTo(newState: OrderState): boolean {
    const validTransitions = {
      [OrderState.PENDING]: [OrderState.CONFIRMED, OrderState.CANCELLED],
      [OrderState.CONFIRMED]: [OrderState.SHIPPED, OrderState.CANCELLED],
      [OrderState.SHIPPED]: [OrderState.DELIVERED],
    };
    
    return validTransitions[this.state]?.includes(newState) ?? false;
  }

  transition(newState: OrderState): OrderStateMachine {
    if (!this.canTransitionTo(newState)) {
      throw new Error(`Invalid transition from ${this.state} to ${newState}`);
    }
    return new OrderStateMachine(newState);
  }
}
```

## Managing Side Effects

### <i class="fas fa-globe"></i> Isolate I/O Operations

Side effects like database calls, API requests, or file system operations should be isolated in dedicated services that can be easily mocked.

**✅ Good: Isolated Side Effects**
```typescript
// Pure business logic
export class PriceCalculator {
  constructor(
    private readonly taxService: TaxService,
    private readonly discountService: DiscountService
  ) {}

  async calculateFinalPrice(
    basePrice: number,
    location: string,
    customerId: string
  ): Promise<number> {
    // All I/O operations are delegated to injected services
    const taxRate = await this.taxService.getTaxRate(location);
    const discount = await this.discountService.getCustomerDiscount(customerId);
    
    const priceAfterDiscount = basePrice * (1 - discount);
    const finalPrice = priceAfterDiscount * (1 + taxRate);
    
    return Math.round(finalPrice * 100) / 100;
  }
}

// Separate service for I/O
export class TaxService {
  constructor(private readonly httpClient: HttpClient) {}

  async getTaxRate(location: string): Promise<number> {
    const response = await this.httpClient.get(`/api/tax/${location}`);
    return response.data.rate;
  }
}
```

### <i class="fas fa-clock"></i> Handle Time Dependencies

Time-based operations should be abstracted to make testing deterministic.

**✅ Good: Injected Time Provider**
```typescript
interface TimeProvider {
  now(): Date;
}

export class SessionManager {
  constructor(
    private readonly timeProvider: TimeProvider,
    private readonly sessionStore: SessionStore
  ) {}

  async createSession(userId: string): Promise<Session> {
    const session = {
      id: generateId(),
      userId,
      createdAt: this.timeProvider.now(),
      expiresAt: this.addHours(this.timeProvider.now(), 24)
    };
    
    await this.sessionStore.save(session);
    return session;
  }

  private addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }
}

// In tests, you can provide a mock TimeProvider
const mockTimeProvider = { now: () => new Date('2024-01-01') };
```

## Dependency Configuration

### <i class="fas fa-industry"></i> Use Factory Functions

For complex object creation, use factory functions to encapsulate initialization logic.

**✅ Good: Factory Pattern**
```typescript
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
}

export class DatabaseConnectionFactory {
  constructor(private readonly config: DatabaseConfig) {}

  async createConnection(): Promise<DatabaseConnection> {
    const connection = new DatabaseConnection(this.config);
    await connection.initialize();
    return connection;
  }
}

// Usage in service
export class UserRepository {
  constructor(
    private readonly connectionFactory: DatabaseConnectionFactory
  ) {}

  async findUser(id: string): Promise<User> {
    const connection = await this.connectionFactory.createConnection();
    try {
      return await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    } finally {
      await connection.close();
    }
  }
}
```

### <i class="fas fa-theater-masks"></i> Avoid Service Locator Pattern

The service locator pattern hides dependencies and makes testing difficult. Always prefer explicit constructor injection.

**❌ Bad: Service Locator**
```typescript
export class OrderService {
  async processOrder(orderId: string): Promise<void> {
    // Hidden dependencies fetched at runtime
    const repo = ServiceLocator.get('OrderRepository');
    const payment = ServiceLocator.get('PaymentService');
    
    const order = await repo.findById(orderId);
    await payment.charge(order.total);
  }
}
```

## Testing Benefits

When you follow these principles, testing becomes straightforward with Suites:

```typescript
describe('PriceCalculator', () => {
  let calculator: PriceCalculator;
  let taxService: Mocked<TaxService>;
  let discountService: Mocked<DiscountService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(PriceCalculator).compile();
    calculator = unit;
    taxService = unitRef.get(TaxService);
    discountService = unitRef.get(DiscountService);
  });

  it('should calculate price with tax and discount', async () => {
    // Easy to control behavior of dependencies
    taxService.getTaxRate.mockResolvedValue(0.08);
    discountService.getCustomerDiscount.mockResolvedValue(0.10);

    const finalPrice = await calculator.calculateFinalPrice(100, 'NY', 'customer-123');

    expect(finalPrice).toBe(97.20); // 100 * 0.9 * 1.08
  });
});
```

## Key Takeaways

1. **Always use constructor injection** - It makes dependencies explicit and testable
2. **Keep constructors pure** - No side effects or complex initialization
3. **Embrace immutability** - Prevents bugs and makes testing predictable
4. **Isolate I/O operations** - Keep business logic pure and delegate I/O to services
5. **Abstract time dependencies** - Makes time-based logic testable
6. **Avoid service locators** - Hidden dependencies make testing difficult

:::tip Next Steps
Ready to explore how to structure your code for simplicity? Continue to [Code Structure & Simplicity](./code-structure-simplicity.md) to learn about composition, pure functions, and managing complexity.
::: 