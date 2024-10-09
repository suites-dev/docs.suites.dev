---
sidebar_position: 5
title: Sociable Unit Test Example
---

# Sociable Unit Tests

## Introduction

Sociable Unit Tests, also known as integrated unit tests, focus on testing a unit of work in conjunction with its real dependencies, but still mock the dependencies of those dependencies. This approach ensures that the interactions between a unit and its immediate collaborators are tested in a controlled environment, providing a broader scope of validation compared to solitary unit tests.

In contrast to [Solitary Unit Tests](/docs/developer-guide/unit-tests/solitary), where all dependencies are mocked, sociable tests expose certain dependencies to verify real interactions between units. However, they do not extend to the level of integration tests, which typically involve actual I/O operations and full system interactions.

## Step-by-Step Example

Continuing from our previous example with the `UserService` class, we'll now set up a sociable unit test. We'll expose the `UserApi` dependency to test real interactions while mocking the `HttpService` and `Database` dependencies.

### Step 1: Define the Classes

Here are the interfaces and classes we'll use in our example. Consider the `UserService` class as the unit under test, and we will expose the `UserApi` dependency.

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

To test the `UserService` class with a real `UserApi` dependency, we'll use the `TestBed` factory from the
`@suites/unit` package to create our test environment.
Here's how we can set up the test:

### Simple Test Example

Here’s a basic setup and test for `UserService` using sociable unit tests:

```typescript title="user.service.spec.ts" {1,10-12,16,21-23} showLineNumbers
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, HttpService, Database } from './services';
import { User } from './types';

describe('User Service Unit Spec', () => {
  let underTest: UserService;

  // Declare the mock instances
  let userApi: UserApi;
  let database: Mocked<Database>;
  let httpService: Mocked<HttpService>;

  beforeAll(async () => {
    // Create the test environment with UserApi exposed
    const { unit, unitRef } = await TestBed.sociable(UserService).expose(UserApi).compile();

    underTest = unit;

    // Retrieve the mock instances
    database = unitRef.get(Database);
    httpService = unitRef.get(HttpService);
  });

  it('should generate a random user and save to the database', async () => {
    const userFixture: User = { id: 1, name: 'John' };

    // Mock the HttpService dependency
    httpService.get.mockResolvedValue({ data: userFixture });
    database.saveUser.mockResolvedValue(userFixture.id);

    const result = await underTest.generateRandomUser();

    expect(httpService.get).toHaveBeenCalledWith('/random-user');
    expect(database.saveUser).toHaveBeenCalledWith(userFixture);
    expect(result).toEqual(userFixture.id);
  });
});
```

### Clarifying the `.expose()` Behavior

In the setup for sociable tests, when we use `.expose()` to include a class like `UserApi` as a real dependency, Suites
still mocks its internal dependencies (`HttpService` and `Database` in this example). This setup allows us to test the
real interactions within the `UserApi` class while controlling the behavior of its dependencies. Essentially, this
approach ensures that the `UserApi` class operates correctly in conjunction with other real components while maintaining
a controlled testing environment for its interactions.

### Exposing Limitations and Anti-Patterns

When using the `.expose()` method to make certain classes real in your test environment, it's important to understand
some limitations and potential anti-patterns:

**No Retrieval of Exposed Classes from Unit Reference:**

- You cannot retrieve an exposed class from the [`unitRef`](/docs/developer-guide/unit-tests/suites-api#unit-reference)
  using `.get()` after calling `.expose()`. This limitation is by design. The purpose of `.expose()` is to make the
  class a real, non-mocked dependency within the test context, making it part of the "system under test."

- Allowing retrieval of exposed classes from the `unitRef` could lead to undesirable testing practices, such as
  attempting to on the internal state or behavior of a real class. This contradicts the essence of sociable unit
  testing, where the goal is to verify real interactions within a controlled environment.

- By restricting access to exposed classes, Suites ensures that the interactions remain consistent and that developers
  do not inadvertently mock or stub the behavior of real components, preserving the integrity of the sociable testing
  approach.

**Avoid Over-Exposing Dependencies:**

- Over-exposing classes in your test context can lead to complex tests that become difficult to maintain and understand.
  Sociable unit tests aim to test interactions between a few key classes while maintaining control over others using
  mocks or stubs.

- Excessive exposure may introduce unnecessary complexity, reducing the clarity and effectiveness of the test. It’s best
  to limit exposure to only those classes directly involved in the interaction you wish to test, keeping the test scope
  focused.

### Step 3: Using Suites Mocking API to Define Mock Behavior

Defining final behavior and controlling mocks with `.mock().impl()` and `.mock().final()` is still possible with
sociable unit tests. Refer to the [Suites API](/docs/developer-guide/unit-tests/suites-api) section for details
on using these methods.

## Next Steps

By combining both solitary and sociable unit tests, you can achieve a comprehensive testing strategy that ensures each
component works correctly on its own and in conjunction with others. This holistic approach provides a robust foundation
for verifying individual components in isolation while also ensuring the reliability of interactions between components.
