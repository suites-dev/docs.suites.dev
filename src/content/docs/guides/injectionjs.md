---
sidebar_position: 5
title: Testing InjectionJS Services
description: Test InjectionJS constructor injection with Suites, Jest or Vitest, typed tokens, and mock overrides.
meta_title: "InjectionJS Unit Testing with Jest or Vitest"
---

Use `@suites/di.injectionjs` to test constructor-injected services with Jest or Vitest. Suites reads the constructor's dependencies, supplies mocks, and creates the service without starting a production injector.

This is the InjectionJS path in [Quick Start](/docs/get-started/quickstart/). Define a service, test it with a mocked dependency, then configure an override.

This guide uses Suites 4.1 or later and InjectionJS `^2.6.1`; CommonJS and ESM are supported. See [Installation](/docs/get-started/installation/#prerequisites) for Node.js and runner requirements.

## 1. Configure your test project

Complete [Installation](/docs/get-started/installation/) with the InjectionJS adapter and your chosen runner. For an existing Jest project:

```sh
pnpm add -D @suites/unit @suites/di.injectionjs @suites/doubles.jest
pnpm add injection-js reflect-metadata
```

For Vitest, install `@suites/doubles.vitest` in place of `@suites/doubles.jest`.

Include this file in your test tsconfig:

```typescript title="suites.d.ts"
/// <reference types="@suites/doubles.jest/unit" />
/// <reference types="@suites/di.injectionjs/metadata" />
```

For Vitest, use `@suites/doubles.vitest/unit` for the first reference. Keep exactly one doubles reference and one DI reference per test TypeScript project.

Enable `experimentalDecorators` and `emitDecoratorMetadata`. Your test runner's TypeScript transformer must emit decorator metadata too; use the [runner configuration](/docs/get-started/installation/#configure-the-test-runner) from Installation.

### Vitest module identity

Add this property inside the existing `test` object in `vitest.config.ts`:

```typescript
server: { deps: { external: ['injection-js'] } },
```

Keep your existing transformer and test settings. Externalizing `injection-js` makes the adapter and your tests use the same native module, preserving decorator and token identity.

## 2. Define a service and its token

An **injection token** identifies a dependency when a runtime class is not available, such as a TypeScript interface. Export the token so your service and tests share the same instance.

```typescript title="src/user.service.ts"
import 'reflect-metadata';
import { Inject, Injectable, InjectionToken } from 'injection-js';

export interface UserRepository {
  findName(id: string): Promise<string>;
}

export const USER_REPOSITORY = new InjectionToken<UserRepository>('UserRepository');

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly repository: UserRepository) {}

  findName(id: string): Promise<string> {
    return this.repository.findName(id);
  }
}
```

Load `reflect-metadata` before decorated classes. You can also import it once in your runner's setup file.

## 3. Test with mocked collaborators

A **solitary test** exercises the unit with all injected collaborators mocked. Compile the test bed in `beforeAll`, then configure the repository response and assert the result in `it`.

```typescript title="src/user.service.spec.ts"
import { beforeAll, describe, expect, it } from '@jest/globals';
import { TestBed, type Mocked } from '@suites/unit';
import { USER_REPOSITORY, UserService } from './user.service';
import type { UserRepository } from './user.service';

describe('UserService, solitary', () => {
  let unit: UserService;
  let repository: Mocked<UserRepository>;

  beforeAll(async () => {
    const testBed = await TestBed.solitary(UserService).compile();
    unit = testBed.unit;
    repository = testBed.unitRef.get<UserRepository>(USER_REPOSITORY);
  });

  it('returns the repository result', async () => {
    repository.findName.mockResolvedValue('Alice');

    await expect(unit.findName('1')).resolves.toBe('Alice');
    expect(repository.findName).toHaveBeenCalledWith('1');
  });
});
```

For Vitest, import `beforeAll`, `describe`, `expect`, and `it` from `vitest`. For NodeNext ESM projects, use `.js` extensions for relative imports and keep your runner's ESM configuration.

Run `pnpm exec jest` or `pnpm exec vitest run`. Expect **one passing test**: the service returns `Alice`, and the generated repository mock receives `'1'`.

## Your first test passes

You have a working solitary test. Continue to [Solitary Unit Tests](/docs/guides/solitary/) to extend this pattern, or [Sociable Unit Tests](/docs/guides/sociable/) to keep selected constructor-injected classes real. The remaining sections are optional details for dependency overrides and adapter support.

## Override a dependency

To configure behavior before compilation, replace the previous `beforeAll` hook with this one. Keep the same imports and test:

```typescript
beforeAll(async () => {
  const testBed = await TestBed.solitary(UserService)
    .mock<UserRepository>(USER_REPOSITORY)
    .impl(stub => ({ findName: stub().mockResolvedValue('Alice') }))
    .compile();
  unit = testBed.unit;
  repository = testBed.unitRef.get<UserRepository>(USER_REPOSITORY);
});
```

Use `.final(...)` to inject a supplied value instead. Final values cannot be retrieved through `unitRef`. Pass an explicit dependency type to token lookups and overrides, such as `.mock<UserRepository>(USER_REPOSITORY)`.

Tokens are compared by identity. Another `new InjectionToken<UserRepository>('UserRepository')` is a different dependency even though its description matches.

## Supported constructor patterns

| Pattern | Behavior |
| --- | --- |
| Class dependencies | Reads emitted constructor metadata |
| `@Inject(token)` | Accepts classes, nonempty strings, symbols, and `InjectionToken` instances |
| `@Inject(forwardRef(() => Dependency))` | Resolves the reference to the underlying token |
| Static `parameters` or lowered `ctorParameters` | Reads constructor metadata supported by InjectionJS |
| `TestBed.sociable(...).expose(...)` | Keeps selected class dependencies real; those classes must also use supported constructor injection |

Arbitrary object, numeric, and boolean tokens are not supported. Use `InjectionToken` when you need object identity.

## Scope and limitations

The adapter supports **constructor injection**. Contextual `inject()` calls, including field initializers, are not supported. Use constructor injection for the class under test and any exposed real dependencies, or test those classes with InjectionJS's own injector.

Suites builds a flat test container. It does not consume production provider configuration, run provider factories, collect multi-providers, or recreate injector hierarchies. `@Optional()`, `@Self()`, `@SkipSelf()`, and `@Host()` do not reproduce production lookup rules.

Optional dependencies are mocked like other dependencies. To test an absent optional dependency, supply `null` explicitly, for example `.mock<UserRepository | null>(USER_REPOSITORY).final(null)`.

## Summary

- Configure the InjectionJS metadata reference and your runner's decorator transform.
- Share injection tokens between the service and its test.
- Compile in `beforeAll` and retrieve typed mocks through `unitRef`.
- Use constructor injection for the unit and any exposed real dependencies.

## Next steps

- **[Solitary Unit Tests](/docs/guides/solitary/)**: Extend your first test with more mock configurations.
- **[Mock Configuration](/docs/api-reference/mock-configuration/)**: Configure implementations and final values.
- **[Sociable Unit Tests](/docs/guides/sociable/)**: Keep selected class dependencies real.
- **[Quick Start](/docs/get-started/quickstart/)**: Return to the overview or choose another framework.
