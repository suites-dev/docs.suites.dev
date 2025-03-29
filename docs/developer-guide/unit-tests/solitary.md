---
sidebar_position: 4
title: Solitary Unit Tests
description: Testing in isolation with Suites
---

# Solitary Unit Tests

## Introduction

Solitary unit tests aim to evaluate a single unit of work in complete isolation from its external dependencies. These tests use mocks (collections of stubs) to replace dependencies, making it possible to test the behavior of a component without being affected by its collaborators.

:::note When to use solitary tests
Solitary tests are ideal when:
- You want to test the logic and behavior of a single component
- You need to control all inputs to ensure predictable test results
- You're developing new components and want to ensure they work correctly in isolation
:::

In contrast to [sociable unit tests](/docs/developer-guide/unit-tests/sociable), where certain dependencies are real implementations, solitary tests replace all dependencies with mocks to ensure true isolation.

## Step-by-Step Example

In this example, we have a `UserService` class that depends on a `UserApi` class to fetch a random user and a `Database` class to save the user. The `UserApi` depends on an `HttpService` to make HTTP requests. We'll completely mock all dependencies to test the `UserService` class in isolation.

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
  constructor(private httpService: HttpService) {}

  async getRandom(): Promise<User> {
    const data = await this.httpService.get('https://api.randomuser.me/');
    // Process data...
    return { id: Math.random(), name: 'John Doe' };
  }
}

@Injectable()
export class Database {
  async saveUser(user: User): Promise<number> {
    // In a real database, this would insert the user
    // and return the newly created user ID.
    return Math.floor(Math.random() * 1000);
  }
}

@Injectable()
export class UserService {
  constructor(
    private userApi: UserApi,
    private database: Database,
  ) {}

  async generateRandomUser(): Promise<number> {
    const randomUser = await this.userApi.getRandom();
    return this.database.saveUser(randomUser);
  }
}
```

### Step 2: Write the Test

Now, let's write a solitary unit test for the `UserService` class:

```typescript title="user.service.spec.ts" {4,8-9,12-13}
import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/unit';
import { UserService } from './services';
import { UserApi, Database } from './services';

describe('UserService Tests', () => {
  let userService: UserService;

  // Declare the mock instances
  let userApi: Mocked<UserApi>; // A mock with stubbed methods
  let database: Mocked<Database>; // A mock with stubbed methods

  beforeAll(async () => {
    // Create the test environment with automatic mocking
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();

    userService = unit;
    
    // Retrieve the mock instances
    userApi = unitRef.get(UserApi);
    database = unitRef.get(Database);
  });

  it('should generate a random user and save to the database', async () => {
    // Configure the stubbed methods to return predefined values
    userApi.getRandom.mockResolvedValue({ id: 1, name: 'John' } as User);
    database.saveUser.mockResolvedValue(42);

    // Test the outcome, not the implementation details
    const result = await userService.generateRandomUser();
    
    // Verify the result is what we expect (the return value from database.saveUser)
    expect(result).toBe(42);
  });
});
```

> 💡 The `Mocked<T>` type is used to type the mock instances where each method has been replaced with a stub. This type is provided by the `@suites/unit` package and relies on the mocking library used in the test environment.

**Automatic Mocking of Dependencies**

When the class under test is instantiated using `TestBed.solitary()`, all its dependencies are automatically mocked with each method becoming a stub. Initially, these stubs have no predefined responses. This setup allows you to define specific responses for each method in your tests, providing precise control over the testing conditions.

## The Virtual DI Container

A key innovation in Suites' solitary testing approach is the "virtual DI container" concept. This is how it works:

### Traditional DI Testing vs. Suites' Approach

**Traditional Testing with DI Frameworks:**
1. Initialize the entire DI container
2. Manually register mock implementations for dependencies
3. Retrieve the service under test from the container
4. Configure mock behavior

**Suites' Virtual DI Container:**
1. Analyzes the class under test using the DI framework's metadata
2. Creates a minimal container with only the necessary components
3. Automatically generates and injects mocks for all dependencies
4. Provides direct access to both the unit and its mocked dependencies

### Benefits of the Virtual Container

- **Performance**: Eliminates the overhead of initializing the full DI container
- **Simplicity**: Reduces boilerplate code for setting up tests
- **Precision**: Creates only the dependencies needed for the test
- **Framework Integration**: Works with your DI framework's existing annotations
- **Isolation**: Ensures complete isolation of the unit under test

### How It Works Behind the Scenes

Suites leverages the reflection capabilities of modern DI frameworks to:
1. Extract dependency metadata from class decorators and type annotations
2. Create appropriate mocks for each dependency identified
3. Build a virtual dependency graph with these mocks
4. Use the DI framework's own resolution rules when injecting dependencies
5. Provide a consistent interface for test setup regardless of the underlying framework

This approach maintains the benefits of your DI framework's design while optimizing for testing performance and simplicity.

### Step 3: Configuring Mock Behavior

Suites provides two ways to configure the behavior of your mocks:

**Using `.mock().final()` for Immutable Responses**

The `.mock().final()` method provides a declarative way to define stub behavior that can't be changed later. This is useful when you want consistent behavior across all tests:

```typescript showLineNumbers
beforeAll(async () => {
  const { unit } = await TestBed.solitary(UserService)
    .mock(UserApi) // Specify which dependency to configure
    .final({
      // Define each method's behavior
      getRandom: async () => ({ id: 1, name: 'John' })
    })
    .compile();

  userService = unit;
  // Note: userApi cannot be retrieved from unitRef
});
```

When using `.final()`, the mock can't be retrieved from `unitRef` or modified later.

**Using `.mock().impl()` for Flexible Responses**

For more flexibility, use `.mock().impl()` to define stub behavior while allowing further modification:

```typescript showLineNumbers
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.solitary(UserService)
    .mock(UserApi) // Specify which dependency to configure
    .impl(stubFn => ({
      // Use the underlying mock library's function
      getRandom: stubFn().mockResolvedValue({ id: 1, name: 'John' })
    }))
    .compile();

  userService = unit;
  // The mock can still be retrieved and further configured
  userApi = unitRef.get(UserApi);
});
```

<div class="next-steps-section">

## What's Next?

Solitary unit tests are excellent for verifying individual components in isolation. However, to test how components work together, you'll want to use [sociable unit tests](/docs/developer-guide/unit-tests/sociable). By combining both approaches, you can build a comprehensive testing strategy that validates both independent component behavior and component interactions.

</div>
