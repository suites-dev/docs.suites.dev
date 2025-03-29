---
sidebar_position: 6
title: Suites Testing API
---

# Suites Testing API

Suites provides a comprehensive and flexible API for setting up and managing unit tests. Whether you're writing solitary
unit tests or sociable unit tests, Suites simplifies the process with a consistent and semantic interface.

## Terminology Clarification

In Suites, we use the following terminology:

- **Mock**: A complete replacement of a dependency class where each method has been replaced with a stub
- **Stub**: An individual method replacement that provides predefined responses
- **Mocked\<T\>**: The type representing a mocked dependency with stubbed methods

## Solitary Unit Tests

Solitary unit tests focus on testing a single unit of work in complete isolation from its dependencies. In Suites,
the `TestBed.solitary()` method is used to create a test environment where all dependencies are automatically mocked.

### Example Setup

```typescript {10}
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, Database } from './services';

describe('UserService Tests', () => {
  let userService: UserService;
  let database: Mocked<Database>; // A mock with stubbed methods

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;

    database = unitRef.get(Database); // Get the mock
  });
});
```

For a detailed guide on solitary unit tests, refer to [Solitary Unit Tests](/docs/developer-guide/unit-tests/solitary).

## Sociable Unit Tests

Sociable unit tests involve testing a unit of work in the context of its interactions with real implementations of its
immediate dependencies. The `TestBed.sociable()` method is used to set up such tests.

> 💡 When using `TestBed.sociable()`, there must be at least one invocation of the `.expose()` method.

### Example Setup

```typescript {10-12}
import { TestBed, Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserApi, Database, HttpService } from './services';

describe('UserService Tests', () => {
  let userService: UserService;
  let database: Mocked<Database>; // Still a mock with stubbed methods

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.sociable(UserService)
      .expose(UserApi) // UserApi will be a real implementation
      .compile();

    userService = unit;
    database = unitRef.get(Database); // Get the mock for Database
  });
});
```

For more information on sociable unit tests, see [Sociable Unit Tests](/docs/developer-guide/unit-tests/sociable).

## Mock Configuration

Suites provides advanced capabilities to give you fine-grained control over your mocks and their stubbed methods. You can
use `.mock().final()` for defining immutable stub behavior or `.mock().impl()` for flexible stub implementations.

### `.mock().final()`

Set the final behavior of stubbed methods in a mock. When using `.final()`, the mock cannot be retrieved from the unit reference. This is useful when you want to define the responses once and ensure they aren't modified later.

```typescript
beforeAll(async () => {
  const { unit } = await TestBed.solitary(UserService)
    .mock(UserApi) // Specify the dependency to configure
    .final({ 
      // Define the stubbed methods' responses
      getRandom: async () => ({ id: 1, name: 'John' }) 
    })
    .compile();

  userService = unit;
  // Note: userApi cannot be retrieved from unitRef
});
```

### `.mock().impl()`

This method provides a flexible way to define stub behavior using callbacks from the underlying mock library.

This approach allows you to specify default behaviors for your stubbed methods while leaving other methods open for further
configuration. It's particularly useful when you need to set up partial behavior for some methods while
keeping others undefined.

```typescript
beforeAll(async () => {
  const { unit, unitRef } = await TestBed.solitary(UserService)
    .mock(UserApi) // Specify the dependency to configure
    .impl(stubFn => ({ 
      // stubFn gives you access to the underlying mock library's function
      getRandom: stubFn().mockResolvedValue({ id: 1, name: 'John' }) 
    }))
    .compile();
    
  // The mock can still be retrieved and further configured
  const userApi = unitRef.get(UserApi);
});
```

In this setup:
- The `UserApi` dependency is mocked with a predefined behavior for the `getRandom` method.
- The rest of the methods in `UserApi` remain unset, which makes it possible to define additional behaviors later if needed.

This approach provides a balance between setting up default behaviors and retaining the flexibility to adjust them
as necessary during the test execution.

> 💡 The `stubFn` is equivalent to the underlying mock library's function (e.g., `jest.fn()` in Jest) and can be used to create stubs with the library's full functionality.

### Differences Between `.mock().final()` and `.mock().impl()`

- **`.mock().final()`**: Sets the behavior of stubbed methods permanently. The mock cannot be retrieved from the unit reference.
- **`.mock().impl()`**: Allows defining the stub behavior while still enabling retrieval of the mock from the unit reference for
  further configuration.

## Unit Reference

When you set up your test environment using Suites' `TestBed`, it returns two key objects: `unit` (the class under test)
and `unitRef` (the `UnitReference` type). `UnitReference` plays an essential role in retrieving and interacting with the
mocked dependencies within the test context.

### Using `unitRef.get()`

The `unitRef.get()` method allows you to retrieve mocked instances of the dependencies within the testing environment. It's
particularly useful when you want to configure the behavior of stubbed methods or verify method calls. Here's a basic
usage example:

```typescript
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
const userApi = unitRef.get(UserApi); // Get the mock for UserApi
```

In this example, `unitRef.get(UserApi)` retrieves the mocked instance of `UserApi` that was automatically generated
during the setup.

### Limitations with Exposed Classes

When using sociable tests and calling `.expose()` to make a class part of the "real" system under test, you **cannot**
retrieve that exposed class using `unitRef.get()`. This is an intentional design choice to prevent the developer from
mistakenly trying to mock or stub methods on what should be a real implementation. For more on this, refer to
the [Sociable Unit Tests](/docs/developer-guide/unit-tests/sociable) section.

### Resolving Dependencies Using Identifiers

In some cases, especially when dealing with complex DI frameworks or when classes have been registered using custom
identifiers, you need to use the appropriate identifier to retrieve dependencies. `UnitReference` supports retrieval
using identifiers, allowing for precise access to the correct instances. To understand more about using identifiers,
check out the [Identifiers](/docs/developer-guide/adapters/identifiers) guide.

```typescript
// Retrieving a dependency using a custom identifier
const logger = unitRef.get(LOGGER_IDENTIFIER);
```

### Best Practices for Using `UnitReference`

- **Access Mocks for Stub Configuration:** Use `unitRef.get()` primarily to retrieve mocked instances for configuring their stubbed methods.
- **Avoid Overusing in Sociable Tests:** In sociable unit tests, limit the use of `unitRef.get()` to dependencies that should be mocked. Remember, classes exposed with `.expose()` are meant to be real implementations.
- **Use Identifiers When Necessary:** If a class was registered with a custom identifier in the DI framework, use that
  same identifier to retrieve it with `unitRef.get()`.

