---
sidebar_position: 6
title: Testing InversifyJS Classes
description: Test InversifyJS classes with Suites, symbol tokens, named dependencies, and selected real collaborators using Jest or Vitest.
---

Use `@suites/di.inversify` to construct an InversifyJS class with typed dependency mocks. Suites reads injection metadata directly, so these unit tests do not need an application `Container` or production bindings.

This guide targets Suites 4 and InversifyJS 7 or 8, with Jest or Vitest. Check [Installation](/docs/get-started/installation/#prerequisites) for supported runtime and runner versions.

## 1. Configure the test project

Follow [Installation](/docs/get-started/installation/) with `@suites/di.inversify` and one doubles adapter. Include these references in your test TypeScript project:

```typescript title="suites.d.ts"
/// <reference types="@suites/doubles.jest/unit" />
/// <reference types="@suites/di.inversify/metadata" />
```

For Vitest, change the first reference to `@suites/doubles.vitest/unit`. Load only one DI adapter's metadata reference and one doubles reference per test project.

Enable `experimentalDecorators` and `emitDecoratorMetadata`, and configure your runner's transformer to emit legacy decorator metadata. See [runner configuration](/docs/get-started/installation/#configure-the-test-runner).

## 2. Define a token and its consumer

An **injection token** identifies a dependency when a TypeScript interface has no runtime class. Export it and use the same token in both the constructor and the test.

```typescript title="src/user.service.ts"
import 'reflect-metadata';
import { inject, injectable } from 'inversify';

export const USER_DIRECTORY = Symbol('USER_DIRECTORY');
export interface UserDirectory {
  findName(id: string): Promise<string>;
}

@injectable()
export class NameFormatter {
  format(name: string): string {
    return name.trim();
  }
}

@injectable()
export class UserService {
  constructor(
    @inject(USER_DIRECTORY) private readonly directory: UserDirectory,
    @inject(NameFormatter) private readonly formatter: NameFormatter,
  ) {}

  async greet(id: string): Promise<string> {
    const name = await this.directory.findName(id);
    return `Hello, ${this.formatter.format(name)}!`;
  }
}
```

Load `reflect-metadata` before decorated classes. You can also load it once in your runner's setup file. No `Container.bind()` calls are needed for this test.

## 3. Configure and verify the mocks

A **solitary test** exercises the unit with all injected collaborators mocked.

```typescript title="src/user.service.spec.ts"
import { beforeAll, describe, expect, it } from '@jest/globals';
import { TestBed, type Mocked } from '@suites/unit';
import { NameFormatter, USER_DIRECTORY, UserService, type UserDirectory } from './user.service';

describe('UserService, solitary', () => {
  let unit: UserService;
  let directory: Mocked<UserDirectory>;
  let formatter: Mocked<NameFormatter>;

  beforeAll(async () => {
    const testBed = await TestBed.solitary(UserService).compile();
    unit = testBed.unit;
    directory = testBed.unitRef.get<UserDirectory>(USER_DIRECTORY);
    formatter = testBed.unitRef.get(NameFormatter);
  });

  it('greets a user from the directory', async () => {
    directory.findName.mockResolvedValue(' Ada ');
    formatter.format.mockReturnValue('Ada');

    await expect(unit.greet('user-1')).resolves.toBe('Hello, Ada!');
    expect(directory.findName).toHaveBeenCalledWith('user-1');
    expect(formatter.format).toHaveBeenCalledWith(' Ada ');
  });
});
```

For Vitest, import `beforeAll`, `describe`, `expect`, and `it` from `vitest`. For NodeNext ESM projects, use `.js` extensions for relative imports and the runner's ESM configuration.

Run `pnpm exec jest` or `pnpm exec vitest run`. The test should pass without a real directory implementation: the generated mock supplies the name, and the service produces the greeting.

## 4. Run a selected collaborator's real logic

A **sociable test** exercises the unit with selected real collaborators. Add this test to the same spec file, using its existing imports:

```typescript
describe('UserService, sociable', () => {
  let unit: UserService;
  let directory: Mocked<UserDirectory>;

  beforeAll(async () => {
    const testBed = await TestBed.sociable(UserService)
      .expose(NameFormatter)
      .compile();
    unit = testBed.unit;
    directory = testBed.unitRef.get<UserDirectory>(USER_DIRECTORY);
  });

  it('trims the name with the real formatter', async () => {
    directory.findName.mockResolvedValue(' Ada ');

    await expect(unit.greet('user-1')).resolves.toBe('Hello, Ada!');
  });
});
```

`.expose(NameFormatter)` selects the real class. The directory remains mocked. Select each real collaborator explicitly and check its dependencies for I/O. Exposed classes cannot be retrieved through `unitRef`.

## Retrieve a named dependency

Supply the matching **metadata**, the name or tags attached to an injection site, when retrieving or configuring its mock.

```typescript title="src/directory.service.ts"
import 'reflect-metadata';
import { inject, injectable, named } from 'inversify';
import { USER_DIRECTORY, type UserDirectory } from './user.service';

@injectable()
export class DirectoryService {
  constructor(
    @inject(USER_DIRECTORY) @named('primary') private readonly primary: UserDirectory,
  ) {}

  findName(id: string): Promise<string> {
    return this.primary.findName(id);
  }
}
```

```typescript title="src/directory.service.spec.ts"
import { beforeAll, describe, expect, it } from '@jest/globals';
import { TestBed, type Mocked } from '@suites/unit';
import { DirectoryService } from './directory.service';
import { USER_DIRECTORY, type UserDirectory } from './user.service';

describe('DirectoryService', () => {
  let unit: DirectoryService;
  let primary: Mocked<UserDirectory>;

  beforeAll(async () => {
    const testBed = await TestBed.solitary(DirectoryService).compile();
    unit = testBed.unit;
    primary = testBed.unitRef.get<UserDirectory>(USER_DIRECTORY, { named: 'primary' });
  });

  it('reads the named primary directory', async () => {
    primary.findName.mockResolvedValue('Ada');

    await expect(unit.findName('user-1')).resolves.toBe('Ada');
    expect(primary.findName).toHaveBeenCalledWith('user-1');
  });
});
```

To configure the named mock before compilation, replace the previous `beforeAll` hook with this one:

```typescript
beforeAll(async () => {
  const testBed = await TestBed.solitary(DirectoryService)
    .mock<UserDirectory>(USER_DIRECTORY, { named: 'primary' })
    .impl(stub => ({ findName: stub().mockResolvedValue('Ada') }))
    .compile();
  unit = testBed.unit;
  primary = testBed.unitRef.get<UserDirectory>(USER_DIRECTORY, { named: 'primary' });
});
```

For `@tagged('region', 'eu')`, pass `{ region: 'eu' }`. When an injection site has both a name and tags, include the complete record, such as `{ named: 'primary', region: 'eu' }`. See [Types](/docs/api-reference/types/#dependency-identifier-metadata).

## Supply values and understand the boundary

| Need | Approach |
| --- | --- |
| Configure a generated mock during the test | `unitRef.get<Dependency>(TOKEN)` |
| Configure a mock before construction | `.mock<Dependency>(TOKEN).impl(stub => ({ ... }))` |
| Inject an existing value or implementation | `.mock<Dependency>(TOKEN).final(value)` |
| Exercise a selected real class | `.sociable(Service).expose(Collaborator)` |
| Validate application bindings, scopes, or container modules | Test using your configured InversifyJS `Container` |

Suites reads constructor and supported property injection metadata, including names and tags. It does not recreate production binding configuration, container hierarchies, scopes, or activation hooks. Direct imports and exposed code execute normally; Suites does not detect or block their I/O.

Token dependencies are mocked by default, but `.final()` can supply a value or implementation. Final values and exposed real classes are not retrievable through `unitRef`.

## Summary

- Share injection tokens between the application class and the test.
- Retrieve token mocks with an explicit dependency type.
- Match names and tags in both lookups and overrides.
- Select real classes with `.expose()` and use an application container test for production wiring.

## Next steps

- **[Mock Configuration](/docs/api-reference/mock-configuration/)**: Choose between `.impl()` and `.final()`.
- **[UnitReference](/docs/api-reference/unit-reference/)**: Retrieve and configure dependency mocks.
- **[NestJS](/docs/guides/nestjs/)** and **[InjectionJS](/docs/guides/injectionjs/)**: Use the same TestBed pattern with other adapters.

## Additional resources

- **[InversifyJS Suites integration](https://inversify.io/docs/ecosystem/suites/)**: The ecosystem introduction. This guide uses the current `.expose()` API and Suites 4 `/metadata` declarations.
