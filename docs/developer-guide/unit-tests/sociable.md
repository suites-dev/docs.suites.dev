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

To test the `UserService` class with a real `UserApi` dependency, we'll use the `TestBed` factory from the `@suites/unit` package to create our test environment. Here's how we can set up the test:

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
    userApi = unitRef.get(UserApi);
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

> :bulb: In this setup, the `UserApi` dependency is real, while the `HttpService` and `Database` dependencies are
> mocked. This approach allows us to test the real interactions within the `UserApi` class while controlling the behavior
> of its dependencies.

### Step 3: Using Suites Mocking API to Define Mock Behavior

Defining final behavior and controlling mocks with `.mock().impl()` and `.mock().final()` is still possible with
sociable unit tests. Refer to the [Suites API](/docs/developer-guide/unit-tests/suites-api) section for details
on using these methods.

## Next Steps

By combining both solitary and sociable unit tests, you can achieve a comprehensive testing strategy that ensures each component works correctly on its own and in conjunction with others. This holistic approach provides a robust foundation for verifying individual components in isolation while also ensuring the reliability of interactions between components.
