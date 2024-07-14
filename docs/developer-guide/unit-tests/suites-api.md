---
sidebar_position: 6
title: Suites API
---

# Suites API

Suites provides a comprehensive and flexible API for setting up and managing unit tests. Whether you're writing solitary
unit tests or sociable unit tests, Suites simplifies the process with a consistent and semantic interface.

## Solitary Unit Tests

Solitary unit tests focus on testing a single unit of work in complete isolation from its dependencies. In Suites,
the `TestBed.solitary()` method is used to create a test environment for such tests.

### Example Setup

```typescript {10}
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, Database } from './services';

describe('User Service Solitary Unit Test', () => {
  let underTest: UserService;
  let database: Mocked<Database>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    underTest = unit;

    database = unitRef.get(Database);
  });
});
```

For a detailed guide on solitary unit tests, refer to [Solitary Unit Tests](/docs/developer-guide/unit-tests/solitary).

## Sociable Unit Tests

Sociable unit tests involve testing a unit of work in the context of its interactions with real implementations of its
immediate dependencies. The `TestBed.sociable()` method is used to set up such tests.

> :bulb: When using `TestBed.sociable()`, there must be at least one invocation of the `.expose()` method.

### Example Setup

```typescript {10-12}
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, Database, HttpService } from './services';

describe('User Service Sociable Unit Test', () => {
  let underTest: UserService;
  let database: Mocked<Database>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.sociable(UserService)
      .expose(UserApi)
      .compile();

    underTest = unit;
    database = unitRef.get(Database);
  });
});
```

For more information on sociable unit tests, see [Sociable Unit Tests](/docs/developer-guide/unit-tests/sociable).

## Mock Behavior Configuration

Suites provides advanced mocking capabilities to give you fine-grained control over your test doubles. You can
use `.mock().final()` for defining final mock behavior or `.mock().impl()` for flexible mock implementations.

### `.mock().final()`

Set the final behavior of the mock. The mock cannot be retrieved from the unit reference. This is useful when you want
to define the final behavior of a mock without the need to retrieve it for further stubbing or assertions.

```typescript
beforeAll(async () => {
  const { unit } = await TestBed.solitary(UserService)
    .mock(UserApi)
    .final({ getRandom: async () => ({ id: 1, name: 'John' }) })
    .compile();

  underTest = unit;
});
```

### `.mock().impl()`

This method provides a flexible way to define mock behavior using a callback function.

This approach allows you to specify default behaviors for your mocks while leaving other dependencies open for further
stubbing or assertions. It is particularly useful when you need to set up partial behavior for some dependencies while
keeping others unset.

```typescript
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.solitary(UserService)
    .mock(UserApi)
    .impl(stubFn => ({ getRandom: stubFn().mockResolvedValue({ id: 1, name: 'John' }) }))
    .compile();
});
```

In this setup:
- The `UserApi` dependency is mocked with a predefined behavior for the `getRandom` method.
- The rest of the dependencies for `UserApi` remain unset, allowing you to define additional behaviors later if needed.

This approach provides a balance between setting up default mock behaviors and retaining the flexibility to adjust mocks
as necessary during the test execution. It ensures that specific methods are pre-configured while leaving the overall
mock instance open for further modifications.

> :bulb: The `stubFn` is equivalent to the original mocking library stub function and can be used to define further the
> mock behaviors.

### Differences Between `.mock().final()` and `.mock().impl()`

- **`.mock().final()`**: Sets the final behavior of the mock. The mock cannot be retrieved from the unit reference.
- **`.mock().impl()`**: Allows defining the mock behavior while still enabling retrieval from the unit reference for
  further stubbing or assertions.

For more detailed information and examples, refer to the relevant sections:

- [Solitary Unit Tests](/docs/developer-guide/unit-tests/solitary)
- [Sociable Unit Tests](/docs/developer-guide/unit-tests/sociable)
