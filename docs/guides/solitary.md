---
sidebar_position: 2
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

In contrast to [sociable unit tests](/docs/guides/sociable), where certain dependencies are real implementations, solitary tests replace all dependencies with mocks to ensure true isolation.

## Step-by-Step Example

Testing `UserService` which depends on `UserApi` and `Database`:

```typescript
@Injectable()
class UserService {
  constructor(
    private userApi: UserApi,
    private database: Database
  ) {}

  async generateRandomUser(): Promise<number> {
    const randomUser = await this.userApi.getRandom();
    return this.database.saveUser(randomUser);
  }
}
```

### Write the Test

Now, let's write a solitary unit test for the `UserService` class:

```typescript title="user.service.spec.ts" {4,13} showLineNumbers
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

:::tip Mocked Type
The `Mocked<T>` type ensures all methods are properly typed as stubs. See [Types](/docs/api-reference/types) for details.
:::

**Automatic Mocking of Dependencies**

When using `TestBed.solitary()`, all dependencies are automatically mocked. Each method becomes a stub with no predefined responses. Configure stub responses in your tests as needed.

## How It Works

Suites uses a **virtual DI container** - analyzing your class and creating only the mocks needed, not initializing the full framework.

See [Virtual DI Container](/docs/guides/virtual-di-container) for technical details.

## Configuring Mocks

Configure mocks before or after calling `.compile()`. For advanced configuration options, see [Mock Configuration](/docs/api-reference/mock-configuration).

<div class="next-steps-section">

## What's Next?

For testing how components work together, see [sociable unit tests](/docs/guides/sociable). Combining both approaches tests independent behavior and component interactions.

</div>
