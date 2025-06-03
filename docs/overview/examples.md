---
sidebar_position: 5
title: Examples
description: Practical examples and code recipes for common testing scenarios with Suites
---

# Examples & Recipes 🧪

This page contains practical examples and code recipes for common testing scenarios with Suites. Each example is self-contained and demonstrates best practices.

<div class="examples-overview">

## 📑 Quick Navigation

<div class="cards-container">
  <div class="card">
    <h4><a href="#basic-examples">Basic Examples</a></h4>
    <p>Simple service testing, async operations, error handling</p>
  </div>
  <div class="card">
    <h4><a href="#advanced-patterns">Advanced Patterns</a></h4>
    <p>Multiple dependencies, complex mocking, custom configurations</p>
  </div>
  <div class="card">
    <h4><a href="#real-world-scenarios">Real-World Scenarios</a></h4>
    <p>API services, database repositories, event handlers</p>
  </div>
</div>

</div>

:::tip External Resources
For complete, runnable examples, check out our [GitHub Examples Repository](https://github.com/suites-dev/examples) which includes:
- Full project setups for different frameworks
- Integration with popular libraries
- Performance testing examples
- Migration guides from other testing approaches
:::

## Basic Examples

### Simple Service Testing

The most common scenario - testing a service with a single dependency:

```typescript title="examples/basic-service.spec.ts"
import { Injectable } from '@nestjs/common';
import { TestBed, Mocked } from '@suites/unit';

// Simple notification service
@Injectable()
class EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // Implementation details...
  }
}

@Injectable()
class NotificationService {
  constructor(private emailService: EmailService) {}

  async notifyUser(userId: string, message: string): Promise<boolean> {
    try {
      await this.emailService.send(
        `user-${userId}@example.com`,
        'Notification',
        message
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Test
describe('NotificationService', () => {
  let service: NotificationService;
  let emailService: Mocked<EmailService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(NotificationService).compile();
    service = unit;
    emailService = unitRef.get(EmailService);
  });

  it('should send email and return true on success', async () => {
    emailService.send.mockResolvedValue(undefined);

    const result = await service.notifyUser('123', 'Hello!');

    expect(result).toBe(true);
    expect(emailService.send).toHaveBeenCalledWith(
      'user-123@example.com',
      'Notification',
      'Hello!'
    );
  });

  it('should return false when email fails', async () => {
    emailService.send.mockRejectedValue(new Error('SMTP error'));

    const result = await service.notifyUser('123', 'Hello!');

    expect(result).toBe(false);
  });
});

:::tip Missing `Mocked` Type?
If TypeScript can't find the `Mocked` type, ensure you've completed the [type reference configuration](/docs/overview/installation#-required-type-reference-configuration) during installation. This is a required step that enables the `Mocked<T>` type throughout your project.
:::

### Testing Async Operations

Working with promises and async/await patterns:

```typescript title="examples/async-operations.spec.ts"
import { Injectable } from '@nestjs/common';
import { TestBed, Mocked } from '@suites/unit';

interface Product {
  id: string;
  name: string;
  price: number;
}

@Injectable()
class ProductApi {
  async fetchProduct(id: string): Promise<Product> {
    // API call implementation
    throw new Error('Not implemented');
  }
}

@Injectable()
class PriceCalculator {
  async calculateTax(price: number): Promise<number> {
    // Tax calculation logic
    throw new Error('Not implemented');
  }
}

@Injectable()
class ProductService {
  constructor(
    private productApi: ProductApi,
    private priceCalculator: PriceCalculator
  ) {}

  async getProductWithTax(productId: string): Promise<{ product: Product; totalPrice: number }> {
    const product = await this.productApi.fetchProduct(productId);
    const tax = await this.priceCalculator.calculateTax(product.price);
    
    return {
      product,
      totalPrice: product.price + tax
    };
  }
}

describe('ProductService - Async Operations', () => {
  let service: ProductService;
  let productApi: Mocked<ProductApi>;
  let priceCalculator: Mocked<PriceCalculator>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(ProductService).compile();
    service = unit;
    productApi = unitRef.get(ProductApi);
    priceCalculator = unitRef.get(PriceCalculator);
  });

  it('should fetch product and calculate total price with tax', async () => {
    const mockProduct: Product = { id: '1', name: 'Laptop', price: 1000 };
    
    productApi.fetchProduct.mockResolvedValue(mockProduct);
    priceCalculator.calculateTax.mockResolvedValue(100);

    const result = await service.getProductWithTax('1');

    expect(result).toEqual({
      product: mockProduct,
      totalPrice: 1100
    });
    
    expect(productApi.fetchProduct).toHaveBeenCalledWith('1');
    expect(priceCalculator.calculateTax).toHaveBeenCalledWith(1000);
  });

  it('should handle API errors gracefully', async () => {
    productApi.fetchProduct.mockRejectedValue(new Error('Network error'));

    await expect(service.getProductWithTax('1')).rejects.toThrow('Network error');
  });
});
```

### Error Handling Patterns

Testing various error scenarios and edge cases:

```typescript title="examples/error-handling.spec.ts"
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TestBed, Mocked } from '@suites/unit';

@Injectable()
class UserRepository {
  async findById(id: string): Promise<User | null> {
    throw new Error('Not implemented');
  }
  
  async update(id: string, data: Partial<User>): Promise<User> {
    throw new Error('Not implemented');
  }
}

@Injectable()
class UserService {
  constructor(private userRepository: UserRepository) {}

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    if (data.email && !this.isValidEmail(data.email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }
    
    return this.userRepository.update(id, data);
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

describe('UserService - Error Handling', () => {
  let service: UserService;
  let userRepository: Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    service = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it('should throw 404 when user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(service.updateUser('123', { name: 'John' }))
      .rejects
      .toThrow(new HttpException('User not found', HttpStatus.NOT_FOUND));
  });

  it('should throw 400 for invalid email', async () => {
    const existingUser = { id: '123', name: 'Jane', email: 'jane@example.com' };
    userRepository.findById.mockResolvedValue(existingUser);

    await expect(service.updateUser('123', { email: 'invalid-email' }))
      .rejects
      .toThrow(new HttpException('Invalid email format', HttpStatus.BAD_REQUEST));
  });

  it('should successfully update user with valid data', async () => {
    const existingUser = { id: '123', name: 'Jane', email: 'jane@example.com' };
    const updatedUser = { ...existingUser, name: 'Jane Doe' };
    
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.update.mockResolvedValue(updatedUser);

    const result = await service.updateUser('123', { name: 'Jane Doe' });

    expect(result).toEqual(updatedUser);
    expect(userRepository.update).toHaveBeenCalledWith('123', { name: 'Jane Doe' });
  });
});
```

## Advanced Patterns

### Multiple Dependencies

Testing services with multiple dependencies and complex interactions:

```typescript title="examples/multiple-dependencies.spec.ts"
import { Injectable } from '@nestjs/common';
import { TestBed, Mocked } from '@suites/unit';

@Injectable()
class CacheService {
  async get(key: string): Promise<any> { }
  async set(key: string, value: any, ttl?: number): Promise<void> { }
}

@Injectable()
class LoggerService {
  log(message: string, context?: any): void { }
  error(message: string, trace?: any): void { }
}

@Injectable()
class MetricsService {
  incrementCounter(metric: string): void { }
  recordDuration(metric: string, duration: number): void { }
}

@Injectable()
class DataService {
  async fetchData(id: string): Promise<any> { }
}

@Injectable()
class OptimizedDataService {
  constructor(
    private dataService: DataService,
    private cacheService: CacheService,
    private logger: LoggerService,
    private metrics: MetricsService
  ) {}

  async getData(id: string): Promise<any> {
    const startTime = Date.now();
    const cacheKey = `data:${id}`;
    
    try {
      // Check cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        this.metrics.incrementCounter('cache.hit');
        this.logger.log(`Cache hit for ${id}`);
        return cached;
      }
      
      // Fetch from data service
      this.metrics.incrementCounter('cache.miss');
      const data = await this.dataService.fetchData(id);
      
      // Store in cache
      await this.cacheService.set(cacheKey, data, 3600);
      
      const duration = Date.now() - startTime;
      this.metrics.recordDuration('data.fetch', duration);
      
      return data;
    } catch (error) {
      this.logger.error(`Failed to get data for ${id}`, error);
      this.metrics.incrementCounter('data.error');
      throw error;
    }
  }
}

describe('OptimizedDataService', () => {
  let service: OptimizedDataService;
  let dataService: Mocked<DataService>;
  let cacheService: Mocked<CacheService>;
  let logger: Mocked<LoggerService>;
  let metrics: Mocked<MetricsService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(OptimizedDataService).compile();
    
    service = unit;
    dataService = unitRef.get(DataService);
    cacheService = unitRef.get(CacheService);
    logger = unitRef.get(LoggerService);
    metrics = unitRef.get(MetricsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached data when available', async () => {
    const cachedData = { id: '123', value: 'cached' };
    cacheService.get.mockResolvedValue(cachedData);

    const result = await service.getData('123');

    expect(result).toEqual(cachedData);
    expect(cacheService.get).toHaveBeenCalledWith('data:123');
    expect(dataService.fetchData).not.toHaveBeenCalled();
    expect(metrics.incrementCounter).toHaveBeenCalledWith('cache.hit');
    expect(logger.log).toHaveBeenCalledWith('Cache hit for 123');
  });

  it('should fetch and cache data on cache miss', async () => {
    const fetchedData = { id: '123', value: 'fresh' };
    cacheService.get.mockResolvedValue(null);
    dataService.fetchData.mockResolvedValue(fetchedData);
    cacheService.set.mockResolvedValue(undefined);

    const result = await service.getData('123');

    expect(result).toEqual(fetchedData);
    expect(cacheService.get).toHaveBeenCalledWith('data:123');
    expect(dataService.fetchData).toHaveBeenCalledWith('123');
    expect(cacheService.set).toHaveBeenCalledWith('data:123', fetchedData, 3600);
    expect(metrics.incrementCounter).toHaveBeenCalledWith('cache.miss');
    expect(metrics.recordDuration).toHaveBeenCalledWith('data.fetch', expect.any(Number));
  });

  it('should handle errors appropriately', async () => {
    const error = new Error('Network error');
    cacheService.get.mockResolvedValue(null);
    dataService.fetchData.mockRejectedValue(error);

    await expect(service.getData('123')).rejects.toThrow('Network error');
    
    expect(logger.error).toHaveBeenCalledWith('Failed to get data for 123', error);
    expect(metrics.incrementCounter).toHaveBeenCalledWith('data.error');
  });
});
```

### Using .mock() Configuration

Different ways to configure mocks using Suites' fluent API:

```typescript title="examples/mock-configuration.spec.ts"
import { Injectable } from '@nestjs/common';
import { TestBed } from '@suites/unit';

interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

@Injectable()
class ConfigService {
  getConfig(): Config {
    throw new Error('Not implemented');
  }
}

@Injectable()
class ApiClient {
  constructor(private configService: ConfigService) {}
  
  async makeRequest(endpoint: string): Promise<any> {
    const config = this.configService.getConfig();
    // Use config to make request...
    return { endpoint, ...config };
  }
}

describe('Mock Configuration Examples', () => {
  it('should use .mock().final() for static responses', async () => {
    const { unit } = await TestBed.solitary(ApiClient)
      .mock(ConfigService)
      .final({
        getConfig: () => ({
          apiUrl: 'https://api.example.com',
          timeout: 5000,
          retries: 3
        })
      })
      .compile();

    const result = await unit.makeRequest('/users');
    
    expect(result).toEqual({
      endpoint: '/users',
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3
    });
  });

  it('should use .mock().impl() for dynamic behavior', async () => {
    let callCount = 0;
    
    const { unit } = await TestBed.solitary(ApiClient)
      .mock(ConfigService)
      .impl(stubFn => ({
        getConfig: stubFn(() => {
          callCount++;
          return {
            apiUrl: 'https://api.example.com',
            timeout: callCount * 1000, // Increase timeout each call
            retries: 3
          };
        })
      }))
      .compile();

    const result1 = await unit.makeRequest('/users');
    const result2 = await unit.makeRequest('/posts');
    
    expect(result1.timeout).toBe(1000);
    expect(result2.timeout).toBe(2000);
  });

  it('should chain multiple mock configurations', async () => {
    const { unit } = await TestBed.solitary(SomeComplexService)
      .mock(DependencyA)
      .final({ methodA: () => 'A' })
      .mock(DependencyB)
      .final({ methodB: () => 'B' })
      .mock(DependencyC)
      .impl(stubFn => ({
        methodC: stubFn().mockReturnValue('C')
      }))
      .compile();

    // Test implementation...
  });
});
```

## Real-World Scenarios

### REST API Service

A complete example of testing a REST API service:

```typescript title="examples/rest-api-service.spec.ts"
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TestBed, Mocked } from '@suites/unit';

interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

@Injectable()
class HttpClient {
  async post<T>(url: string, data: any): Promise<T> {
    throw new Error('Not implemented');
  }
  
  async get<T>(url: string): Promise<T> {
    throw new Error('Not implemented');
  }
  
  async put<T>(url: string, data: any): Promise<T> {
    throw new Error('Not implemented');
  }
  
  async delete(url: string): Promise<void> {
    throw new Error('Not implemented');
  }
}

@Injectable()
class AuthService {
  async hashPassword(password: string): Promise<string> {
    throw new Error('Not implemented');
  }
  
  async validateUser(email: string, password: string): Promise<boolean> {
    throw new Error('Not implemented');
  }
}

@Injectable()
class UserApiService {
  private readonly baseUrl = 'https://api.example.com';
  
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}
  
  async createUser(dto: CreateUserDto): Promise<User> {
    // Validate email format
    if (!this.isValidEmail(dto.email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }
    
    // Hash password before sending
    const hashedPassword = await this.auth.hashPassword(dto.password);
    
    try {
      const user = await this.http.post<User>(`${this.baseUrl}/users`, {
        ...dto,
        password: hashedPassword
      });
      
      return user;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      throw error;
    }
  }
  
  async getUser(id: string): Promise<User> {
    try {
      return await this.http.get<User>(`${this.baseUrl}/users/${id}`);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
  
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, updates);
  }
  
  async deleteUser(id: string): Promise<void> {
    await this.http.delete(`${this.baseUrl}/users/${id}`);
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

describe('UserApiService', () => {
  let service: UserApiService;
  let http: Mocked<HttpClient>;
  let auth: Mocked<AuthService>;
  
  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserApiService).compile();
    service = unit;
    http = unitRef.get(HttpClient);
    auth = unitRef.get(AuthService);
  });
  
  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'secret123',
        name: 'Test User'
      };
      
      const hashedPassword = 'hashed_secret123';
      const createdUser: User = {
        id: '123',
        email: dto.email,
        name: dto.name,
        createdAt: new Date()
      };
      
      auth.hashPassword.mockResolvedValue(hashedPassword);
      http.post.mockResolvedValue(createdUser);
      
      const result = await service.createUser(dto);
      
      expect(result).toEqual(createdUser);
      expect(auth.hashPassword).toHaveBeenCalledWith('secret123');
      expect(http.post).toHaveBeenCalledWith(
        'https://api.example.com/users',
        {
          ...dto,
          password: hashedPassword
        }
      );
    });
    
    it('should throw 400 for invalid email', async () => {
      const dto: CreateUserDto = {
        email: 'invalid-email',
        password: 'secret123',
        name: 'Test User'
      };
      
      await expect(service.createUser(dto))
        .rejects
        .toThrow(new HttpException('Invalid email format', HttpStatus.BAD_REQUEST));
      
      expect(auth.hashPassword).not.toHaveBeenCalled();
      expect(http.post).not.toHaveBeenCalled();
    });
    
    it('should throw 409 when user already exists', async () => {
      const dto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'secret123',
        name: 'Test User'
      };
      
      auth.hashPassword.mockResolvedValue('hashed_password');
      http.post.mockRejectedValue({ 
        response: { status: 409 } 
      });
      
      await expect(service.createUser(dto))
        .rejects
        .toThrow(new HttpException('User already exists', HttpStatus.CONFLICT));
    });
  });
  
  describe('getUser', () => {
    it('should return user by id', async () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date()
      };
      
      http.get.mockResolvedValue(user);
      
      const result = await service.getUser('123');
      
      expect(result).toEqual(user);
      expect(http.get).toHaveBeenCalledWith('https://api.example.com/users/123');
    });
    
    it('should throw 404 when user not found', async () => {
      http.get.mockRejectedValue({ 
        response: { status: 404 } 
      });
      
      await expect(service.getUser('999'))
        .rejects
        .toThrow(new HttpException('User not found', HttpStatus.NOT_FOUND));
    });
  });
});
```

### Event-Driven Service

Testing services that handle events and use event emitters:

```typescript title="examples/event-driven.spec.ts"
import { Injectable, EventEmitter } from '@nestjs/common';
import { TestBed, Mocked } from '@suites/unit';

interface OrderEvent {
  orderId: string;
  userId: string;
  total: number;
  items: Array<{ productId: string; quantity: number }>;
}

@Injectable()
class EventBus extends EventEmitter {
  publish(event: string, data: any): void {
    this.emit(event, data);
  }
}

@Injectable()
class InventoryService {
  async checkAvailability(productId: string, quantity: number): Promise<boolean> {
    throw new Error('Not implemented');
  }
  
  async reserveItems(items: Array<{ productId: string; quantity: number }>): Promise<void> {
    throw new Error('Not implemented');
  }
}

@Injectable()
class NotificationService {
  async sendOrderConfirmation(userId: string, orderId: string): Promise<void> {
    throw new Error('Not implemented');
  }
}

@Injectable()
class OrderProcessor {
  constructor(
    private eventBus: EventBus,
    private inventory: InventoryService,
    private notifications: NotificationService
  ) {
    this.setupEventHandlers();
  }
  
  private setupEventHandlers(): void {
    this.eventBus.on('order.created', (event: OrderEvent) => {
      this.processOrder(event);
    });
  }
  
  async processOrder(event: OrderEvent): Promise<void> {
    try {
      // Check inventory availability
      for (const item of event.items) {
        const isAvailable = await this.inventory.checkAvailability(
          item.productId,
          item.quantity
        );
        
        if (!isAvailable) {
          this.eventBus.publish('order.failed', {
            orderId: event.orderId,
            reason: `Product ${item.productId} not available`
          });
          return;
        }
      }
      
      // Reserve inventory
      await this.inventory.reserveItems(event.items);
      
      // Send notification
      await this.notifications.sendOrderConfirmation(event.userId, event.orderId);
      
      // Publish success event
      this.eventBus.publish('order.confirmed', {
        orderId: event.orderId,
        userId: event.userId
      });
      
    } catch (error) {
      this.eventBus.publish('order.failed', {
        orderId: event.orderId,
        reason: error.message
      });
    }
  }
}

describe('OrderProcessor - Event Driven', () => {
  let processor: OrderProcessor;
  let eventBus: Mocked<EventBus>;
  let inventory: Mocked<InventoryService>;
  let notifications: Mocked<NotificationService>;
  
  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(OrderProcessor).compile();
    processor = unit;
    eventBus = unitRef.get(EventBus);
    inventory = unitRef.get(InventoryService);
    notifications = unitRef.get(NotificationService);
  });
  
  it('should process order successfully when inventory is available', async () => {
    const orderEvent: OrderEvent = {
      orderId: '123',
      userId: 'user-456',
      total: 100,
      items: [
        { productId: 'prod-1', quantity: 2 },
        { productId: 'prod-2', quantity: 1 }
      ]
    };
    
    inventory.checkAvailability.mockResolvedValue(true);
    inventory.reserveItems.mockResolvedValue(undefined);
    notifications.sendOrderConfirmation.mockResolvedValue(undefined);
    
    await processor.processOrder(orderEvent);
    
    // Verify inventory checks
    expect(inventory.checkAvailability).toHaveBeenCalledTimes(2);
    expect(inventory.checkAvailability).toHaveBeenCalledWith('prod-1', 2);
    expect(inventory.checkAvailability).toHaveBeenCalledWith('prod-2', 1);
    
    // Verify reservation
    expect(inventory.reserveItems).toHaveBeenCalledWith(orderEvent.items);
    
    // Verify notification
    expect(notifications.sendOrderConfirmation).toHaveBeenCalledWith('user-456', '123');
    
    // Verify success event
    expect(eventBus.publish).toHaveBeenCalledWith('order.confirmed', {
      orderId: '123',
      userId: 'user-456'
    });
  });
  
  it('should publish failure event when product not available', async () => {
    const orderEvent: OrderEvent = {
      orderId: '123',
      userId: 'user-456',
      total: 100,
      items: [
        { productId: 'prod-1', quantity: 2 }
      ]
    };
    
    inventory.checkAvailability.mockResolvedValue(false);
    
    await processor.processOrder(orderEvent);
    
    expect(inventory.reserveItems).not.toHaveBeenCalled();
    expect(notifications.sendOrderConfirmation).not.toHaveBeenCalled();
    
    expect(eventBus.publish).toHaveBeenCalledWith('order.failed', {
      orderId: '123',
      reason: 'Product prod-1 not available'
    });
  });
});
```

## Testing Tips & Best Practices

### 1. Keep Tests Focused

Each test should verify one specific behavior:

```typescript
// ❌ Bad: Testing multiple behaviors
it('should validate and save user', async () => {
  // Tests validation AND saving in one test
});

// ✅ Good: Separate tests for each behavior
it('should throw error for invalid email', async () => {
  // Only tests validation
});

it('should save user with valid data', async () => {
  // Only tests saving
});
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad: Vague test name
it('should work', async () => {});

// ✅ Good: Clear, specific test name
it('should return cached data when available in cache', async () => {});
```

### 3. Arrange-Act-Assert Pattern

Structure your tests clearly:

```typescript
it('should calculate discount for premium users', async () => {
  // Arrange
  const user = { id: '1', isPremium: true };
  userService.getUser.mockResolvedValue(user);
  
  // Act
  const discount = await service.calculateDiscount('1', 100);
  
  // Assert
  expect(discount).toBe(20); // 20% for premium users
});
```

### 4. Reset Mocks Between Tests

```typescript
beforeEach(() => {
  jest.clearAllMocks(); // Clear call history
  // or
  jest.resetAllMocks(); // Clear everything including implementations
});
```

### 5. Test Edge Cases

Don't forget about:
- Null/undefined values
- Empty arrays/strings
- Boundary values
- Error conditions
- Race conditions

## Additional Resources

- 📚 [Unit Testing Guide](/docs/developer-guide/unit-tests/) - Comprehensive testing guide
- 🔧 [Suites API Reference](/docs/developer-guide/unit-tests/suites-api) - Complete API documentation
- 🎯 [Design for Testability](/docs/developer-guide/design-for-testability/) - Write more testable code
- 💻 [GitHub Examples](https://github.com/suites-dev/examples) - Full project examples

---

**Need more examples?** Check our [GitHub repository](https://github.com/suites-dev/examples) or ask in our [community discussions](https://github.com/suites-dev/suites/discussions)! 