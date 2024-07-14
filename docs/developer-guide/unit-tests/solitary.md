---
sidebar_position: 4
title: Solitary Unit Test Example
---

# Solitary Unit Tests

## Introduction

Solitary Unit Tests, or isolated unit tests, aim to evaluate a single unit of work entirely separate from its external
dependencies. These tests leverage test doubles, such as [mocks and stubs](/docs/developer-guide/unit-tests/test-doubles),
to mimic the behavior of these dependencies. This method is important for confirming the functionality and reliability of
individual units within a system, ensuring that each part performs as expected under controlled conditions.

In contrast, [Sociable Unit Tests](/docs/developer-guide/unit-tests/sociable) involve real implementations of
dependencies to verify the interactions between multiple units. However, sociable tests still mock the dependencies of
the dependencies to maintain control over the test environment.

## Step-by-Step Example

In this example, we have a `UserService` class that depends on a `UserApi` class to fetch a random user and a `Database`
class to save the user. The `UserApi` depends on an `HttpService` to make HTTP requests. We'll mock
the `UserApi`, `Database`, and `HttpService` classes to test the `UserService` class in isolation.

> :bulb: Please note that this example is agnostic to the mocking library (we'll use Jest) and any
> specific DI framework's adapter. The injection mechanism might differ based on the DI framework.

### Step 1: Define the Classes

Here are the interfaces and classes we'll use in our example. Consider the `UserService` class as the unit under test:

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
  async saveUser(user: User): Promise<number> { /* Saves user to the database */ }
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

To test the `UserService` class in isolation, we'll use the `TestBed` factory from `@suites/unit` package to create our
test environment. Here’s a basic setup and test for `UserService`:

```typescript title="user.service.spec.ts" {1,10-11,15,20-21} showLineNumbers
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, HttpService, Database } from './services';
import { User } from './types';

describe('User Service Unit Spec', () => {
  let underTest: UserService;

  // Declare the mock instances
  let userApi: Mocked<UserApi>;
  let database: Mocked<Database>;

  beforeAll(async () => {
    // Create the test environment
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();

    underTest = unit;
    
    // Retrieve the mock instances
    userApi = unitRef.get(UserApi);
    database = unitRef.get(Database);
  });

  it('should generate a random user and save to the database', async () => {
    userApi.getRandom.mockResolvedValue({ id: 1, name: 'John' } as User);

    await underTest.generateRandomUser();
    expect(database.saveUser).toHaveBeenCalledWith(userFixture);
  });
});
```

> :bulb: The `Mocked` type is used to type the mocked instances of the classes. This type is provided by the `@suites/unit` package. This type relies on the mocking library used in the test environment.

**Automatic Mocking of Dependencies**

When the class under test is instantiated using `TestBed.solitary()`, all its dependencies are automatically mocked.
Initially, these stubs (mocks) have no predefined values or behaviors. This setup allows you to define the specific
behaviors you need for each test, providing precise control over the testing conditions.

### Step 3: Using Suites Mocking API to Define Mock Behavior

**Using `.mock().final()` for Final Mock Behavior**

Suites provides a more declarative way to specify mock implementations using the `.mock().final()` method chain. This method defines the final behavior of the mocks and doesn't allow further stubbing.

Here's how we can use this approach:

```typescript showLineNumbers
beforeAll(async () => {
  const { unit } = await TestBed.solitary(UserService)
    .mock(UserApi)
    .final({ getRandom: async () => ({ id: 1, name: 'John' }) })
    .compile();

  underTest = unit;
});
```

In this approach, we've defined the mock behavior directly in the test setup using `.mock().final()`. This finalizes the behavior of the `getRandom` method, ensuring it cannot be changed in the test suite, which can be useful for ensuring consistent behavior across tests.

Notice that this value cannot be retrieved from the unit reference as it is a final mock implementation.

**Using `.mock().impl()` for Flexible Mock Behavior**

To define mock behavior while still allowing control and monitoring during tests, use `.mock().impl()`. This approach employs a callback to dynamically create stubs using the installed mocking library.

Here's how we can modify the test setup to use this approach:

```typescript showLineNumbers
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.solitary(UserService)
    .mock(UserApi)
    .impl(stubFn => ({ getRandom: stubFn().mockResolvedValue({ id: 1, name: 'John' }) }))
    .compile();

  underTest = unit;
  userApi = unitRef.get(UserApi);
  database = unitRef.get(Database);
});

test('should generate a random user and save to the database', async () => {
  const userFixture: User = { id: 1, name: 'John' };

  await underTest.generateRandomUser();

  expect(userApi.getRandom).toHaveBeenCalled();
  expect(database.saveUser).toHaveBeenCalledWith(userFixture);
});
```

In this setup, the `.mock().impl()` method allows defining the behavior of the `getRandom` method using a stub function.
The `stubFn` is equivalent to the stub function from the installed mocking library (e.g., `jest.fn()`), but it is
provided within the callback for convenience and abstraction.

> :bulb: Refer to the [Suites API](/docs/developer-guide/unit-tests/suites-api) section for details on the mocking API.

## Next Steps

Solitary unit tests provide a robust foundation for verifying individual components in isolation. However, to ensure the reliability of your entire system, it's also important to test interactions between components. This is where [Sociable Unit Tests](/docs/sociable-unit-tests) come into play, enabling you to expose certain dependencies and test the interactions across multiple units within a controlled environment.

By combining both solitary and sociable unit tests, you can achieve a comprehensive testing strategy that ensures each component works correctly on its own and in conjunction with others.
