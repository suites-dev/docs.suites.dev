---
sidebar_position: 5
title: UnitReference
description: Access mocked dependencies in your tests
---

# UnitReference

The `UnitReference` object provides access to mocked dependencies within the test environment. It's returned by both
`TestBed.solitary()` and `TestBed.sociable()` after compilation.

## Interface

```typescript
interface UnitReference {
  get<T>(token: Type<T> | string | symbol): Mocked<T>;
}
```

## Method

### `.get()`

Retrieves a mocked instance of a dependency.

#### Signature

```typescript
get<T>(token: Type<T> | string | symbol): Mocked<T>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| token | `Type<T> \| string \| symbol` | The class constructor or injection token |

#### Returns

Returns a `Mocked<T>` instance with all methods replaced by stubs.

## Examples

### Basic Usage

```typescript
const { unit, unitRef } = await TestBed.solitary(UserService).compile();

// Get mocked dependencies
const database = unitRef.get(Database);
const logger = unitRef.get(Logger);

// Configure mock behavior
database.findUser.mockResolvedValue({ id: 1, name: 'John' });
logger.log.mockReturnValue(undefined);
```

### Using with Class Constructors

```typescript
// NestJS example
@Injectable()
class OrderService {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentService
  ) {}
}

const { unitRef } = await TestBed.solitary(OrderService).compile();

const inventory = unitRef.get(InventoryService);
const payment = unitRef.get(PaymentService);
```

### Using with Injection Tokens

```typescript
const TYPES = {
  Database: Symbol.for('Database'),
  Logger: Symbol.for('Logger'),
  Cache: Symbol.for('Cache')
};

@injectable()
class DataService {
  constructor(
    @inject(TYPES.Database) private db: Database,
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Cache) private cache: Cache
  ) {}
}

const { unitRef } = await TestBed.solitary(DataService).compile();

// Use symbols to retrieve mocks
const database = unitRef.get(TYPES.Database);
const logger = unitRef.get(TYPES.Logger);
const cache = unitRef.get(TYPES.Cache);
```

### String-based Tokens

```typescript
// Some frameworks use string tokens
const { unitRef } = await TestBed.solitary(ConfigService).compile();

const apiUrl = unitRef.get<string>('API_URL');
const dbConfig = unitRef.get<DatabaseConfig>('DATABASE_CONFIG');
```

## Important Limitations

### Cannot Retrieve Exposed Classes in Sociable Tests

When using `TestBed.sociable()` with `.expose()`, exposed classes are treated as real implementations, not mocks.
Because `unitRef` is designed exclusively for accessing mocked dependencies, you cannot retrieve a real instance from
it.

```typescript
const { unitRef } = await TestBed.sociable(PaymentService)
  .expose(TaxCalculator)  // Real implementation
  .compile();

// ❌ This will throw an error because TaxCalculator is a real instance
const calculator = unitRef.get(TaxCalculator);

// ✅ Only non-exposed (mocked) dependencies can be retrieved
const database = unitRef.get(Database);
```

### Cannot Retrieve Dependencies with .mock().final()

Dependencies configured with `.mock().final()` are immutable and sealed upon compilation. This is a design choice to ensure that their behavior remains fixed throughout the test. As they are not intended to be modified or inspected after compilation, they cannot be retrieved via `unitRef`. If you need to access or modify a mock during your tests, use `.mock().impl()` instead.

```typescript
const { unitRef } = await TestBed.solitary(UserService)
  .mock(Database)
  .final({ find: async () => [] }) // Immutable mock
  .compile();

// ❌ This will throw an error because the mock is final
const database = unitRef.get(Database);
```

## Type Safety

The `Mocked<T>` type ensures type safety for your mocks (See more in [Types Reference](/docs/api-reference/types):

```typescript
interface UserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

const userRepo = unitRef.get(UserRepository);

// ✅ TypeScript knows these methods exist
userRepo.findById.mockResolvedValue(testUser);
userRepo.save.mockResolvedValue(testUser);
userRepo.delete.mockResolvedValue(undefined);

// ❌ TypeScript error: Property 'invalid' does not exist
userRepo.invalid.mockResolvedValue(null);
```

## Common Errors

### "Cannot retrieve exposed dependency"
```typescript
// Problem: Trying to get an exposed class
const { unitRef } = await TestBed.sociable(Service)
  .expose(RealDependency)
  .compile();

const dep = unitRef.get(RealDependency); // ❌ Error

// Solution: Only get non-exposed dependencies
```

### "Cannot retrieve final mock"
```typescript
// Problem: Trying to get a .final() mock
const { unitRef } = await TestBed.solitary(Service)
  .mock(Database)
  .final({ find: async () => [] })
  .compile();

const db = unitRef.get(Database); // ❌ Error

// Solution: Use .impl() instead if you need to retrieve the mock
```

### "Token not found"
```typescript
// Problem: Using wrong token
const logger = unitRef.get('LoggerToken'); // ❌ String doesn't match

// Solution: Use the exact token used in injection
const logger = unitRef.get(LoggerService); // ✅ Correct class
// or
const logger = unitRef.get<Logger>('LoggerToken'); // ✅ Correct symbol
```

## See Also

- [Types](/docs/api-reference/types) - Type definitions including `Mocked<T>`
- [Mock Configuration](/docs/api-reference/mock-configuration) - Configuring mock behavior
- [TestBed.solitary()](/docs/api-reference/testbed-solitary) - Creating isolated tests
- [TestBed.sociable()](/docs/api-reference/testbed-sociable) - Creating sociable tests