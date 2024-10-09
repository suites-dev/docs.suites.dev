---
sidebar_position: 5
title: Mocks, Stubs, and Spies
---

# Test Doubles

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
- **Spies**: Objects that allow to observe and verify interactions with real objects. In the context of Suites,
  spies are redundant because mocks can be used to achieve the same functionality
  with [sociable unit tests](/docs/developer-guide/unit-tests/sociable/).

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

#### The `Mocked` Type

The `Mocked` type in Suites provides a type-safe way to define mocked instances, ensuring that mocks retain the same type information as the real objects.

```typescript
import { Mocked } from '@suites/unit';
import { UserService } from './user.service';

let userService: Mocked<UserService>;
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

## Suites' Approach to Mocks and Stubs

### Mocks and Stubs in Suites

In Suites, mocks and stubs are handled through the `@suites/unit` package. The `TestBed` factory method creates the
testing environment, allowing you to easily define and manage test doubles.

#### Creating Mocks and Stubs

- **`TestBed.solitary()`**: For creating an isolated environment with all dependencies mocked.
- **`TestBed.sociable()`**: For creating a testing environment where certain dependencies are real, and their
  dependencies are mocked.

### Using `.mock().final()` and `.mock().impl()`

Suites introduces `.mock().final()` and `.mock().impl()` methods to give you fine control over mock behaviors,
read more about them in the [Suites API](/docs/developer-guide/unit-tests/suites-api) section.

## What's Next?
After understanding the basics of test doubles, you can explore more advanced testing techniques:

- [Solitary Unit Tests](/docs/developer-guide/unit-tests/solitary/): Learn how to write solitary unit tests in Suites.
- [Sociable Unit Tests](/docs/developer-guide/unit-tests/sociable/): Discover how to write sociable unit tests in Suites.
