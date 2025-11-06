---
sidebar_position: 3
title: Sociable Unit Tests
description: Testing real component interactions with Suites
---

# Sociable Unit Tests

## Introduction

Sociable unit tests focus on testing a component with its real dependencies while still controlling external boundaries. This approach ensures that you verify how components actually interact in a controlled environment, providing more realistic validation than solitary tests.

:::tip Sociable Tests Are Still Unit Tests
Even with multiple real classes, sociable tests remain **unit tests** because external I/O (databases, HTTP, caches) are injected via tokens (`@Inject('DATABASE')`) which are **automatically mocked**. You're testing business logic interactions, not actual I/O.
:::

:::note When to use sociable tests
Sociable tests are ideal when:
- You need to verify interactions between business logic components
- You want to test integration points between several classes
- You're testing behaviors that emerge from component collaboration
- You want to refactor internal implementation without breaking tests
:::

In contrast to [solitary unit tests](/docs/guides/solitary), which replace all dependencies with mocks, sociable tests use real implementations for selected dependencies to verify genuine interactions.

## Step-by-Step Example

Testing `UserService` with real `UserApi` to verify their interaction:

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
```

### Choose Your Approach

Two ways to configure sociable tests:

**Option A: .collaborate() + .exclude() <span class="version-badge version-badge--new">v4.0.0+</span>** - Natural collaboration, opt-out specific classes \
**Option B: .expose()** - List what's real, everything else is mocked

#### Step 2a: Using .collaborate() + .exclude() (Recommended)

To test `UserService` with real dependencies collaborating naturally:

```typescript title="user.service.spec.ts (collaborate mode)" {1,14} showLineNumbers
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { HttpService, Database } from './services';
import { User } from './types';

describe('UserService Integration Tests', () => {
  let userService: UserService;
  let database: Mocked<Database>;
  let httpService: Mocked<HttpService>;

  beforeAll(async () => {
    // All dependencies collaborate naturally - UserApi becomes real!
    const { unit, unitRef } = await TestBed.sociable(UserService)
      .collaborate()  // Enable natural collaboration
      .compile();

    userService = unit;

    // Retrieve the mocked dependencies (tokens are auto-mocked)
    database = unitRef.get(Database);
    httpService = unitRef.get(HttpService);
  });

  it('should generate a random user and save to the database', async () => {
    // Configure the mocked dependencies
    const userFixture: User = { id: 1, name: 'John' };
    httpService.get.mockResolvedValue({ data: userFixture });
    database.saveUser.mockResolvedValue(42);

    // UserApi runs with real logic, using mocked HttpService
    const result = await userService.generateRandomUser();

    expect(result).toBe(42);
  });
});
```

**What happens here:**
- **UserApi**: Real (collaborates naturally with UserService)
- **Database**: Mocked (token injection, auto-mocked)
- **HttpService**: Mocked (token injection, auto-mocked)

**Benefits:** Natural collaboration, refactoring-stable, future-proof.

#### Excluding Specific Classes from Collaboration

When you need to exclude expensive or external dependencies:

```typescript
const { unit, unitRef } = await TestBed.sociable(OrderService)
  .collaborate()
  .exclude([ComplexTaxEngine])  // Exclude complex tax logic from collaboration
  .compile();

// ComplexTaxEngine is excluded - it's mocked
const taxEngine = unitRef.get(ComplexTaxEngine);
taxEngine.calculate.mockReturnValue(100);

await unit.processOrder(order);

// Verify interactions with excluded dependency
expect(taxEngine.calculate).toHaveBeenCalledWith(order.total);
```

**Key point:** Classes in `.exclude()` are mocked and retrievable. Everything else collaborates naturally with real implementations.

#### Step 2b: Using .expose() (Alternative)

The same test using expose mode (explicit whitelist):

```typescript title="user.service.spec.ts (expose mode)" {1,10-11,16,22-23} showLineNumbers
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, HttpService, Database } from './services';
import { User } from './types';

describe('UserService Integration Tests', () => {
  let userService: UserService;

  // userApi is NOT Mocked since it will be a real instance
  let database: Mocked<Database>; // A mock with stubbed methods
  let httpService: Mocked<HttpService>; // A mock with stubbed methods

  beforeAll(async () => {
    // Explicitly list what should be real
    const { unit, unitRef } = await TestBed.sociable(UserService)
      .expose(UserApi) // UserApi will be a real implementation
      .compile();

    userService = unit;

    // Retrieve the mock instances (note: you can't retrieve UserApi)
    database = unitRef.get(Database);
    httpService = unitRef.get(HttpService);
  });

  it('should generate a random user and save to the database', async () => {
    // Configure the stubbed methods of the mocked dependencies
    const userFixture: User = { id: 1, name: 'John' };
    httpService.get.mockResolvedValue({ data: userFixture });
    database.saveUser.mockResolvedValue(42);

    // Test the behavior that emerges from the real interaction between UserService and UserApi
    const result = await userService.generateRandomUser();

    // Verify the result is what we expect
    expect(result).toBe(42);
  });
});
```

**What happens here:**
- **UserApi**: Real (explicitly exposed)
- **Database**: Mocked (default in expose mode)
- **HttpService**: Mocked (default in expose mode)

**When to use:** Fine-grained control when you only want specific classes real.

### Step 3: Configuring Mock Behavior

Mock configuration works the same in both modes. You can define behavior for mocked dependencies before compilation:

```typescript title="Configuring mocks before compilation"
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.sociable(UserService)
    .collaborate()  // All business logic collaborates
    .mock(Database)  // Configure specific mock behavior
    .final({
      saveUser: async () => 42  // Fixed return value
    })
    .compile();

  userService = unit;
  httpService = unitRef.get(HttpService);
});
```

You can also configure mocks after compilation:

```typescript
it('should handle specific scenarios', async () => {
  // Configure mock behavior per test
  httpService.get.mockResolvedValue({ data: specificUser });
  database.saveUser.mockResolvedValue(99);

  const result = await userService.generateRandomUser();
  expect(result).toBe(99);
});
```

## Important Considerations

When using sociable tests, keep the following points in mind:

**1. Focus on Outcomes, Not Implementations**

Even though sociable tests let you test real interactions, they should still focus on testing the outcomes (return values, state changes) rather than implementation details.

**2. Choose the Right Mode**

**.collaborate() + .exclude() works best when:**
- Services have many business logic dependencies
- You want new dependencies tested automatically
- You need refactoring-stable, future-proof tests
- You only need to exclude a few expensive/external classes

**.expose() works best when:**
- You want to test 2-3 specific class interactions
- You need fine-grained control over what's real
- You prefer explicit whitelisting configuration

**3. Complementary to Solitary Tests**

Sociable tests complement solitary tests - they don't replace them. Use solitary tests for detailed behavior verification and sociable tests for validating interactions.

**4. Refactoring Stability**

The `.collaborate() + .exclude()` API provides superior refactoring stability compared to other approaches:

```typescript
// With .collaborate() + .exclude()
TestBed.sociable(OrderService)
  .collaborate()
  .exclude([ExpensiveMLService])  // Only exclude what's expensive
  .compile();

// ✅ Adding new dependencies? Test still works!
// New deps automatically join collaboration
```

**Why this matters:**

When you add new dependencies to your production code (e.g., adding a `Logger`), tests using `.collaborate()` continue to work because new dependencies automatically participate in natural collaboration. You only exclude specific expensive or external services.

This is more stable than "leaf-based" or "whitelist" strategies where adding dependencies can break tests because they weren't in your configuration list.

## What's Next?

Combining solitary and sociable tests covers both independent behavior and component interactions.

For more detailed information about configuring mocks and test environments, see the [Suites API](/docs/api-reference/) documentation.
