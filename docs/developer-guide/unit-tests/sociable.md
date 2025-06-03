---
sidebar_position: 5
title: Sociable Unit Tests
description: Testing real component interactions with Suites
---

# Sociable Unit Tests

## Introduction

Sociable unit tests focus on testing a component with its real dependencies while still controlling the dependencies of *those* dependencies. This approach ensures that you verify how components actually interact in a controlled environment, providing more realistic validation than solitary tests. Ideally, the "real" dependencies you include in sociable tests are themselves well-designed, adhering to principles like the [Single Responsibility Principle](../design-for-testability/unit-clarity-responsibility.md#single-responsibility-principle-srp) and being [pure or stateless](../design-for-testability/code-structure-simplicity.md#pure-functions-when-possible) where possible, and are thoroughly [tested in isolation](./solitary.md).

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

**2. Avoid Excessive Exposure & Distinguish from Integration Tests**

Don't expose too many classes in a single test. The more classes you expose, the test might *feel* like it's approaching an integration test, but it's crucial to remember that **Suites' sociable tests are still unit tests.**

*   **No Real I/O:** A key distinction is that true integration tests often involve real I/O operations (e.g., hitting an actual database or making live network calls). Suites' sociable unit tests, by design, **do not perform real I/O**. Even if an `.expose()`-d collaborator (like `UserApi` in our example) normally has a dependency that performs I/O (like `HttpService`), Suites will *still mock that I/O-performing dependency* of the exposed collaborator. The "sociable" interaction is confined to the logical collaboration between your unit and its in-memory collaborators.
*   **Focus:** Sociable tests verify the contract and interaction logic between a few closely related, trusted, in-memory units. Integration tests verify the flow through multiple components, often including external systems.
*   **Brittleness/Slowness:** If a sociable test becomes brittle or slow, it's usually because too many *logical units* are being tested together, increasing complexity, not because of external I/O.

Strive to keep your units focused, aligning with the [Single Responsibility Principle and clear API design](../design-for-testability/unit-clarity-responsibility.md).

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

## Sociable Unit Tests vs. Integration Tests: A Clear Distinction

It's important to clearly differentiate Suites' sociable unit tests from traditional integration tests:

*   **Sociable Unit Tests (Suites):**
    *   **Purpose:** Test the direct interaction and contract between a primary unit and one or more of its immediate, *in-memory* collaborators.
    *   **Scope:** Uses real instances for specified collaborators (`.expose()`).
    *   **I/O Handling:** **Crucially, any dependencies of these exposed collaborators that would perform I/O (e.g., database access, HTTP calls) are *still automatically mocked by Suites***. This ensures the test remains fast, deterministic, and free of external system dependencies.
    *   **Focus:** Verifying logical collaboration and data flow between in-memory objects.
    *   **Tooling:** Achieved with `TestBed.sociable()`.

*   **Integration Tests (General Concept):**
    *   **Purpose:** Verify the interaction between multiple components, modules, or services, potentially including their connections to external systems like databases, message queues, or other microservices.
    *   **Scope:** Can involve several layers of the application and real external infrastructure (often a test/staging version).
    *   **I/O Handling:** Often involve **real I/O operations** to test the full integration path.
    *   **Focus:** Ensuring different parts of the system (or different systems) work together correctly, including their data persistence and communication mechanisms.
    *   **Tooling:** Typically involve different setup, test runners, and potentially tools like Docker Compose for managing external services. Not directly managed by Suites' `TestBed` for unit tests.

**In summary:** Suites' sociable tests allow you to test how your well-designed, in-memory objects work together, while still ensuring that all external I/O is mocked out. This maintains the speed and reliability expected of unit tests. True integration tests are a separate, valuable layer of testing that sociable unit tests do not replace.

## What's Next?

By combining solitary and sociable unit tests, you can create a comprehensive testing strategy that validates both independent component behavior and component interactions. This balanced approach provides confidence in your system while maintaining test maintainability.

For more detailed information about configuring mocks and test environments, see the [Suites API](/docs/developer-guide/unit-tests/suites-api) documentation.
