---
sidebar_position: 6
title: Types
description: TypeScript types and interfaces used in Suites
---

# Types

TypeScript type definitions used throughout Suites.

## Core Types

### `Mocked<T>`

A deeply nested mock type. All methods become mock functions, nested objects are mocked recursively.

```typescript
interface UserService {
  repository: {
    find(id: string): User;
    save(user: User): void;
  };
  validate(user: User): boolean;
}

const service: Mocked<UserService> = unitRef.get(UserService);

// All methods mocked, including nested
service.validate.mockReturnValue(true);
service.repository.find.mockResolvedValue(testUser);
service.repository.save.mockReturnValue(undefined);
```

### `UnitReference`

Interface for accessing mocked dependencies.

```typescript
interface UnitReference {
  get<T>(token: Type<T> | string | symbol): Mocked<T>;
}
```

See [UnitReference](/docs/api-reference/unit-reference) for detailed usage.

See [`mock()` and `stub()`](/docs/api-reference/mock) for creating standalone mocked instances.

## Framework-Specific Mocked Types

The `Mocked<T>` type maps to different underlying types based on your testing library:

### Jest

```typescript
// Suites type
Mocked<UserService>

// Maps to Jest's type
jest.Mocked<UserService>
```

### Vitest

```typescript
// Suites type
Mocked<UserService>

// In Vitest, it's just Mocked (not prefixed)
Mocked<UserService>
```

### Sinon

```typescript
// Suites type
Mocked<UserService>

// Maps to Sinon's type
SinonStubbedInstance<UserService>
```

:::tip
You always import from `@suites/unit` regardless of testing library. Suites handles the type mapping automatically based on your installed adapters.
:::

## Type Safety Example

```typescript
interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

const emailService: Mocked<EmailService> = unitRef.get(EmailService);

// TypeScript ensures correct signatures
emailService.send.mockResolvedValue(undefined);  // ✅ Correct
emailService.send.mockResolvedValue("wrong");    // ❌ Type error
```


## Common Type Errors and Solutions

### "Type 'Mocked' is not generic"
Ensure you're importing from the correct package:
```typescript
import { Mocked } from "@suites/unit";  // ✅ Correct
import { Mocked } from "jest";          // ❌ Wrong
```

### "Cannot find name 'MockFunction'"
The internal MockFunction type is aliased based on your testing library. Use `Mocked<T>` instead of trying to use MockFunction directly.

### "Type instantiation is excessively deep"
This can occur with very complex interfaces. Consider simplifying or breaking down the interface:
```typescript
// Instead of one massive interface
interface ComplexService {
  // 100+ methods
}

// Break it down
interface UserMethods {
  getUser(): User;
  saveUser(user: User): void;
}

interface OrderMethods {
  getOrder(): Order;
  saveOrder(order: Order): void;
}

interface Service extends UserMethods, OrderMethods {}
```

## See Also

- [UnitReference](/docs/api-reference/unit-reference) - Using the UnitReference interface
- [Mock Configuration](/docs/api-reference/mock-configuration) - Configuring mocks with proper types
- [TypeScript Configuration](/docs/get-started/installation#typescript-configuration) - Setting up TypeScript for Suites