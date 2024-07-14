---
sidebar_position: 5
title: Unit Testing & Test Doubles
---

# Unit Testing & Test Doubles

## Introduction

Testing in modern software development often requires isolating components to verify their behavior without the
interference of external dependencies. This is where test doubles—mocks and stubs-come into play. Understanding
these concepts are important for effective unit testing, and Suites provides robust support for these tools to
enhance the testing workflow.

## What Are Test Doubles?

Test doubles are objects that replace real dependencies in unit tests. They allow you to isolate the component under
test and verify its behavior in a controlled environment.

Test doubles come in three main flavors:

- **Mocks**: Objects that mimic the behavior of real objects and are used to verify interactions between objects.
- **Stubs**: Special types of mocks that return predefined values and are useful for providing canned responses to
  method calls.
- **Spies**: Objects that allow you to observe and verify interactions with real objects. In the context of Suites,
  spies are redundant because mocks can be used to achieve the same functionality with sociable unit tests.

### Mocks

Mocks are objects that mimic the behavior of real objects. They are used to verify interactions between objects and can
be configured to respond in specific ways. In Suites, mocks are used to replace real dependencies in solitary and
sociable unit tests, and they are simply a collection of stubs.

#### Example

```typescript {5,6}
import { TestBed, Mocked } from '@suites/unit';

describe('User Service Unit Test with Mocks', () => {
  let underTest: UserService;
  let userApi: Mocked<UserService>;
  let database: Mocked<Database>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    underTest = unit;

    userApi = unitRef.get(UserApi);
    database = unitRef.get(Database);
  });
});
```

### Stubs

Stubs are special types of objects that return predefined values. They are useful for providing canned responses to
method calls during tests. Suites abstracts the underlying mocking library's stub functions, making it easier to use
stubs consistently across different libraries.

#### Example

```typescript {11}
import { TestBed, Mocked } from '@suites/unit';

describe('User Service Unit Test with Mocks', () => {
  let underTest: UserService;
  let userApi: Mocked<UserService>;
  let database: Mocked<Database>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService)
      .mock(UserApi)
      .impl((stubFn) => ({ getRandom: stubFn().mockResolvedValue({ id: 1, name: 'John' }) }))
      .compile();

    underTest = unit;

    userApi = unitRef.get(UserApi);
    database = unitRef.get(Database);
  });
});
```

### Spies

Spies allow you to observe and verify interactions with real objects. Unlike mocks and stubs, spies can call through to the actual implementation while still recording how they were used. However, relying heavily on spies can lead to tests that are harder to maintain and debug.

#### Example

```typescript
import { TestBed } from '@suites/unit';
import { HttpService } from './services';

describe('HttpService with Spies', () => {
  let httpService: HttpService;

  beforeAll(async () => {
    const { unit } = await TestBed.sociable(HttpService).compile();
    httpService = unit;
  });

  it('should call the real get method', async () => {
    const spy = jest.spyOn(httpService, 'get');
    await httpService.get('/endpoint');
    expect(spy).toHaveBeenCalled();
  });
});
```

## Suites' Approach to Mocks, Stubs, and Spies

### Mocks and Stubs in Suites

In Suites, mocks and stubs are handled through the `@suites/unit` package. The `TestBed` factory method creates the testing environment, allowing you to easily define and manage test doubles.

#### Creating Mocks and Stubs

- **`TestBed.solitary()`**: For creating an isolated environment with all dependencies mocked.
- **`TestBed.sociable()`**: For creating a testing environment where certain dependencies are real, and their dependencies are mocked.

### Using `.mock().final()` and `.mock().impl()`

Suites introduces `.mock().final()` and `.mock().impl()` methods to give you fine control over mock behaviors.

#### `.mock().final()`

This method defines a mock behavior that cannot be changed later in the test suite. It's useful for ensuring consistent behavior across tests.

```typescript
beforeAll(async () => {
  const { unit } = await TestBed.solitary(UserService)
    .mock(UserApi)
    .final({ getRandom: async () => ({ id: 1, name: 'John' }) })
    .compile();

  underTest = unit;
});
```

#### `.mock().using()`

This method allows defining mock behavior while still enabling dynamic control and monitoring during tests.

```typescript
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.solitary(UserService)
    .mock(UserApi)
    .using(stubFn => ({ getRandom: stubFn().mockResolvedValue({ id: 1, name: 'John' }) }))
    .compile();

  underTest = unit;
  userApi = unitRef.get(UserApi);
});
```

### The `Mocked` Type

The `Mocked` type in Suites provides a type-safe way to define mocked instances, ensuring that mocks retain the same type information as the real objects.

```typescript
import { Mocked } from '@suites/unit';
import { UserService } from './user.service';

let userService: Mocked<UserService>;
```

## What's Next?
After understanding the basics of test doubles, you can explore more advanced testing techniques:

- [Solitary Unit Tests](/docs/developer-guide/unit-tests/solitary/): Learn how to write solitary unit tests in Suites.
- [Sociable Unit Tests](/docs/developer-guide/unit-tests/sociable/): Discover how to write sociable unit tests in Suites.
