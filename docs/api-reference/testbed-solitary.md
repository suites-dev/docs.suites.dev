---
sidebar_position: 2
title: TestBed.solitary()
description: Create isolated unit tests with all dependencies mocked
---

# TestBed.solitary()

Creates a test environment where all dependencies are automatically mocked for testing a class in complete isolation.

## Signature

```typescript
TestBed.solitary<T>(targetClass: Type<T>): SolitaryTestBedBuilder<T>
```

## Parameters

| Parameter     | Type      | Description                                |
|---------------|-----------|--------------------------------------------|
| `targetClass` | `Type<T>` | The class constructor to test in isolation |

## Returns

Returns a `SolitaryTestBedBuilder<TClass>` instance with methods for configuring the test environment:

- **`.mock(dependency)`** - Configure specific mock behavior before compilation
- **`.compile()`** - Finalizes configuration and creates the test environment

## Description

`TestBed.solitary()` creates a test environment where all of the class's dependencies are mocked by default. This is ideal for testing the internal logic of a class in complete isolation.

Suites automatically identifies and mocks all constructor dependencies, which can then be accessed via `unitRef.get()`. Learn more in the [Virtual Test Container](/docs/guides/virtual-test-container) guide.

## Configuring Mocks

See [Mock Configuration](/docs/api-reference/mock-configuration) for details on `.mock().final()` and `.mock().impl()`.

## Examples

### Basic Usage

```typescript
// All dependencies of UserService are auto-mocked
const { unit, unitRef } = await TestBed.solitary(UserService).compile();

// Retrieve and configure mocks as needed for a test
const userRepository = unitRef.get(UserRepository);
userRepository.findById.mockResolvedValue(testUser);
```

### Token Injections

```typescript
// Class with token-injected dependencies
@Injectable()
class PaymentService {
  constructor(
    @Inject('CONNECTION') private connection: Connection,
    @Inject('API_KEY') private apiKey: string
  ) {}
}

const { unitRef } = await TestBed.solitary(PaymentService).compile();

// Retrieve mocks by token
const database = unitRef.get<Connection>('CONNECTION');
const apiKey = unitRef.get<string>('API_KEY');
```

### Type Safety

All retrieved mocks are fully type-safe, providing autocompletion and compile-time checks.

```typescript
const repository = unitRef.get(UserRepository);

// ✅ TypeScript knows all methods
repository.findById.mockResolvedValue(user);

// ❌ Compile error: method doesn't exist
repository.invalidMethod.mockReturnValue(123);
```

## See Also

- [Solitary Tests Guide](/docs/guides/fundamentals#solitary-tests) - Conceptual guide
- [TestBed.sociable()](/docs/api-reference/testbed-sociable) - Test with real dependencies
- [UnitReference](/docs/api-reference/types#unitreference) - Accessing mocked dependencies with `unitRef.get()`
- [Virtual Test Container](/docs/guides/virtual-test-container) - How Suites auto-mocks dependencies
