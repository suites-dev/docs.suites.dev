---
sidebar_position: 5
title: Sociable Unit Tests
description: Testing real component interactions with Suites
---

# Sociable Unit Tests

## Introduction

Sociable unit tests focus on testing a component with its real dependencies while still controlling the dependencies of those dependencies. This approach ensures that you verify how components actually interact in a controlled environment, providing more realistic validation than solitary tests.

:::note When to use sociable tests
Sociable tests are ideal when:
- You need to verify interactions between components
- You want to test integration points between several components
- You're testing behaviors that emerge from component collaboration
- You want to refactor internal implementation without breaking tests
:::

In contrast to [solitary unit tests](/docs/developer-guide/unit-tests/solitary), which replace all dependencies with mocks, sociable tests use real implementations for selected dependencies to verify genuine interactions.

## Step-by-Step Example

Continuing from our previous example with the `UserService` class, we'll now set up a sociable unit test. We'll use a real `UserApi` dependency while still mocking its dependencies (`HttpService`) and other dependencies of `UserService` (`Database`).

> 💡 This example is agnostic to the mocking library (we'll use Jest) and any specific DI framework's adapter.

### Step 1: Define the Classes

Here are the interfaces and classes we'll use in our example:

```typescript title="types.ts"
export interface User {
  id: number;
  name: string;
}

export interface IncomingEvent {
  type: string;
  data: unknown;
}
```

```typescript title="services.ts"
import { User } from './types';

@Injectable()
export class HttpService {
  async get(url: string): Promise<unknown> { /* Make HTTP request */ }
}

@Injectable()
export class UserApi {
  constructor(private http: HttpService) {}

  async getRandom(): Promise<User> {
    const response = await this.http.get('/random-user');
    return response.data;
  }
}

@Injectable()
export class Database {
  async saveUser(user: User): Promise<number> { /* Save user to the database */ }
}
```

```typescript title="user.service.ts"
import { User, Database } from './services';
import { UserApi } from './user-api';

@Injectable()
export class UserService {
  constructor(private userApi: UserApi, private database: Database) {}

  async generateRandomUser(): Promise<number | boolean> {
    try {
      const user = await this.userApi.getRandom();
      return this.database.saveUser(user);
    } catch (error) {
      return false;
    }
  }
}
```

### Step 2: Set Up the Test

To test the `UserService` class with a real `UserApi` dependency, we'll use the `TestBed.sociable()` method and specify which dependencies should be real using the `.expose()` method:

```typescript title="user.service.spec.ts" {1,10-12,16,21-23} showLineNumbers
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, HttpService, Database } from './services';
import { User } from './types';

describe('UserService Integration Tests', () => {
  let userService: UserService;

  // Note: userApi is NOT Mocked since it will be a real instance
  let database: Mocked<Database>; // A mock with stubbed methods
  let httpService: Mocked<HttpService>; // A mock with stubbed methods

  beforeAll(async () => {
    // Create the test environment with UserApi as a real dependency
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

### Understanding `.expose()` Behavior

In sociable tests, the `.expose()` method indicates which classes should be real implementations rather than mocks:

1. **Real Implementations**: Classes specified in `.expose()` are instantiated as real objects
2. **Mocked Dependencies**: The dependencies of exposed classes are still automatically mocked (each method becomes a stub)
3. **Cannot Retrieve Exposed Classes**: Exposed classes can't be retrieved from `unitRef.get()` because they are real implementations, not mocks

### Important Considerations When Using Sociable Tests

When using sociable tests, keep the following points in mind:

**1. Focus on Outcomes, Not Implementations**

Even though sociable tests let you test real interactions, they should still focus on testing the outcomes (return values, state changes) rather than implementation details.

**2. Avoid Excessive Exposure**

Don't expose too many classes in a single test. The more classes you expose, the closer your test gets to being an integration test, potentially making it slower and more brittle.

**3. Complementary to Solitary Tests**

Sociable tests complement solitary tests - they don't replace them. Use solitary tests for detailed behavior verification and sociable tests for validating interactions.

### Step 3: Configuring Mock Behavior

Like with solitary tests, you can use `.mock().final()` and `.mock().impl()` to configure the behavior of stubbed methods in your mocks for non-exposed dependencies:

```typescript
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.sociable(UserService)
    .expose(UserApi) // UserApi will be a real implementation
    .mock(Database) // Specify which dependency to configure
    .final({
      // Define each method's behavior
      saveUser: async () => 42
    })
    .compile();

  userService = unit;
  httpService = unitRef.get(HttpService);
});
```

## What's Next?

By combining solitary and sociable unit tests, you can create a comprehensive testing strategy that validates both independent component behavior and component interactions. This balanced approach provides confidence in your system while maintaining test maintainability.

For more detailed information about configuring mocks and test environments, see the [Suites API](/docs/developer-guide/unit-tests/suites-api) documentation.
