---
sidebar_position: 1
title: Test Doubles
---

# Mocks, Stubs, and Spies

## Introduction

Testing in modern software development often requires isolating components to verify their behavior without the interference of external dependencies. This is where test doubles—mocks, stubs, and spies—come into play. Understanding these concepts is crucial for effective unit testing, and Suites provides robust support for these tools to enhance your testing workflow.

## What Are Mocks, Stubs, and Spies?

### Mocks

Mocks are objects that mimic the behavior of real objects. They are used to verify interactions between objects and can be configured to respond in specific ways. In Suites, mocks are used to replace real dependencies in solitary and sociable unit tests.

#### Example

```typescript
import { TestBed, mock } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, Database } from './services';

describe('User Service Unit Test with Mocks', () => {
  let underTest: UserService;
  let userApi: ReturnType<typeof mock>;
  let database: ReturnType<typeof mock>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    underTest = unit;
    userApi = unitRef.get(UserApi);
    database = unitRef.get(Database);
  });

  it('should call getRandom and saveUser', async () => {
    userApi.getRandom.mockResolvedValue({ id: 1, name: 'John' });
    database.saveUser.mockResolvedValue(1);

    await underTest.generateRandomUser();

    expect(userApi.getRandom).toHaveBeenCalled();
    expect(database.saveUser).toHaveBeenCalledWith({ id: 1, name: 'John' });
  });
});
```

### Stubs

Stubs are special types of mocks that return predefined values. They are useful for providing canned responses to method calls during tests. Suites abstracts the underlying mocking library's stub functions, making it easier to use stubs consistently across different libraries.

#### Example

```typescript
import { stub } from '@suites/unit';

const userApiStub = stub();
userApiStub.getRandom.mockResolvedValue({ id: 1, name: 'John' });

expect(userApiStub.getRandom()).resolves.toEqual({ id: 1, name: 'John' });
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

### Using `.mock().final()` and `.mock().using()`

Suites introduces `.mock().final()` and `.mock().using()` methods to give you fine control over mock behaviors.

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

### Mocked Type

The `Mocked` type in Suites provides a type-safe way to define mocked instances, ensuring that mocks retain the same type information as the real objects.

```typescript
import { Mocked } from '@suites/unit';
import { UserService } from './user.service';

let userService: Mocked<UserService>;
```

## Conclusion

Mocks, stubs, and spies are essential tools in the unit testing toolbox. Suites simplifies their use by providing a cohesive framework that abstracts away the complexities of integrating different mocking libraries and dependency injection frameworks. By leveraging Suites' powerful API, you can create robust and maintainable tests that ensure your software's quality and reliability.

For more detailed examples and advanced configurations, visit the [Solitary Unit Tests](/docs/solitary-unit-tests) and [Sociable Unit Tests](/docs/sociable-unit-tests) sections.