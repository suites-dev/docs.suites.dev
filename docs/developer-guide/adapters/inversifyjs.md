---
sidebar_position: 3
title: InversifyJS Identifiers
---

# Working with InversifyJS Identifiers 🧠

InversifyJS has unique concepts like different binding types and custom decorators that affect how you work with dependency injection. This guide covers InversifyJS-specific features and how Suites integrates with them.

<div class="in-this-section">

### What You'll Find in This Section

- **Multi-Inject Tokens** - Working with multiple implementations of a dependency
- **Tagged Bindings** - Differentiating between similar dependencies
- **Named Bindings** - Using names to identify specific implementations
- **Custom Decorators** - Handling advanced InversifyJS patterns

</div>

## Multi-Inject Tokens 💡

For scenarios where multiple implementations of a dependency are required, InversifyJS provides the `@multiInject` decorator.

**Example:**

```typescript
interface Weapon { ... }

@injectable()
export class Samurai {
  public constructor(@multiInject('Weapon') private weapons: Weapon[]) {}
}
```

In Suites, the `@multiInject` decorator works the same as the `@inject` decorator. See [Token-based injection](/docs/developer-guide/adapters/identifiers?suites-adapter=inverisfyjs#token-based-injection) for more details.

:::tip Learn More
Read more about [multi-injection](https://github.com/inversify/InversifyJS/blob/master/wiki/multi_injection.md) in the InversifyJS documentation.
:::

## Handling Metadata with InversifyJS 🧠

InversifyJS supports various types of metadata to provide additional context for dependency resolution. Suites supports these metadata patterns to give you full control over your test doubles.

### Tagged Bindings

Tagged bindings differentiate between multiple bindings of the same service:

```typescript
@injectable()
class Ninja {
  public constructor(
    @inject("Weapon") @tagged("canThrow", false) private katana: Weapon,
    @inject("Weapon") @tagged("canThrow", true) private shuriken: Weapon
  ) {}
}
```

In Suites, you can access these dependencies by specifying both the injection token and the corresponding metadata:

```typescript
// Get the non-throwable weapon
const katana = unitRef.get('Weapon', {canThrow: false});

// Get the throwable weapon
const shuriken = unitRef.get('Weapon', {canThrow: true});

// Mock the throwable weapon
await TestBed.solitary(Ninja)
  .mock('Weapon', {canThrow: true})
  .impl(stub => ({
    // mock implementation
  }))
  .compile();
```

### Named Bindings

Named bindings associate a specific name with a binding:

```typescript
@injectable()
class Weapon { ... }

@injectable()
class Samurai {
  constructor(@inject('Weapon') @named('katana') private weapon: Weapon) {}
}
```

In Suites, you can access named bindings using the metadata parameter:

```typescript
const katana = unitRef.get('Weapon', {name: 'katana'});

// For mocking
await TestBed.solitary(Samurai)
  .mock('Weapon', {name: 'katana'})
  .impl(stub => ({
    // mock implementation
  }))
  .compile();
```

:::tip Learn More
Read more about [named bindings](https://github.com/inversify/InversifyJS/blob/master/wiki/named_bindings.md) in the InversifyJS documentation.
:::

### Custom Tag Decorators 💡

InversifyJS supports custom tag decorators for advanced dependency injection patterns:

```typescript
const throwable = tagged('canThrow', true);
const notThrowable = tagged('canThrow', false);

@injectable()
class Ninja {
  constructor(
    @inject('Weapon') @notThrowable private katana: Weapon,
    @inject('Weapon') @throwable private shuriken: Weapon
  ) {}
}
```

Suites handles these custom decorators through the metadata parameter in the same way as other tagged bindings.

:::tip Learn More
Read more about [custom tag decorators](https://github.com/inversify/InversifyJS/blob/master/wiki/custom_tag_decorators.md) in the InversifyJS documentation.
:::

### Contextual Bindings

Contextual bindings allow for conditional dependency resolution based on context:

```typescript
@injectable()
class Ninja implements Ninja {
  // ...
}
```

In Suites, you can access contextual bindings using the `targetName` metadata:

```typescript
// Get a dependency with context
const weapon = unitRef.get('Weapon', {targetName: 'katana'});

// For mocking
await TestBed.solitary(Ninja)
  .mock('Weapon', {targetName: 'katana'})
  .impl(stub => ({
    // mock implementation
  }))
  .compile();
```

:::tip Learn More
Read more about [contextual bindings](https://github.com/inversify/InversifyJS/blob/master/wiki/contextual_bindings.md) in the InversifyJS documentation.
:::

### Unmanaged Dependencies

For dependencies that InversifyJS doesn't manage, you can use the `unmanaged` metadata:

```typescript
class Something {
  public constructor(@unmanaged private dep: SomeClass) {}
}
```

In Suites:

```typescript
// Get unmanaged dependency
const dep = unitRef.get(SomeClass, { unmanaged: true });

// For mocking
await TestBed.solitary(Something)
  .mock(SomeClass, { unmanaged: true })
  .impl(stub => ({
    // mock implementation
  }))
  .compile();
```

## Additional Considerations 💡

### Injection Token Priority

When both class and injection tokens are present, the injection token takes precedence:

```typescript
class Weapon { ... }

class Service {
  public constructor(@inject("Weapon") @targetName("katana") katana: Weapon) {}
}
```

In this case, `unitRef.get('Weapon')` is valid, while `unitRef.get(Weapon)` will not work because the explicit injection token is used.

### Base Identifier Resolution

You can resolve dependencies using only the base identifier (class or injection token) without metadata. This approach works but may not be precise enough when there are multiple matching dependencies.

## Next Steps

- [**Identifiers & Injection Tokens**](/docs/developer-guide/adapters/identifiers) - Learn about the different types of dependency identifiers
- [**Unit Testing Fundamentals**](/docs/developer-guide/unit-tests/fundamentals) - Explore the core principles of unit testing with Suites
- [**Writing Your First Test**](/docs/overview/quickstart) - Get hands-on with creating tests using Suites


