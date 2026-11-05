---
sidebar_position: 5
title: Testing NestJS Services
description: Test NestJS services with Suites, typed dependency mocks, custom injection tokens, and selected real collaborators.
meta_title: "NestJS Unit Testing with Jest or Vitest"
---

Use `@suites/di.nestjs` to test a NestJS **provider**, a class managed by dependency injection. Suites reads its dependency metadata and constructs the class with mocks without bootstrapping a Nest application.

This is the NestJS path in [Quick Start](/docs/get-started/quickstart/). Define a service, test it with mocked dependencies, then keep a selected collaborator real. This guide targets Suites 4 with Jest or Vitest; check [Installation](/docs/get-started/installation/#prerequisites) for supported versions.

## 1. Configure the test project

Follow [Installation](/docs/get-started/installation/) with `@suites/di.nestjs` and either `@suites/doubles.jest` or `@suites/doubles.vitest`. Include these references in the TypeScript project that runs your tests:

```typescript title="suites.d.ts"
/// <reference types="@suites/doubles.jest/unit" />
/// <reference types="@suites/di.nestjs/metadata" />
```

For Vitest, change the first reference to `@suites/doubles.vitest/unit`. Keep exactly one doubles reference and one DI reference per test project.

Enable `experimentalDecorators` and `emitDecoratorMetadata`. Your test runner's transformer must emit legacy decorator metadata too. Use the [runner configuration](/docs/get-started/installation/#configure-the-test-runner) from Installation; the TypeScript options alone do not configure the transform.

## 2. Define the service and its collaborators

```typescript title="src/user.service.ts"
import 'reflect-metadata';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  async findName(id: string): Promise<string> {
    throw new Error(`Database access is not configured for ${id}`);
  }
}

@Injectable()
export class NameFormatter {
  format(name: string): string {
    return name.trim();
  }
}

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly formatter: NameFormatter,
  ) {}

  async greet(id: string): Promise<string> {
    const name = await this.repository.findName(id);
    return `Hello, ${this.formatter.format(name)}!`;
  }
}
```

The repository deliberately throws if its real method runs. The following tests replace it, so no database implementation is needed. Load `reflect-metadata` before decorated classes, either as shown or in your runner's setup file.

## 3. Test with mocked collaborators

A **solitary test** exercises the unit with all injected collaborators mocked.

```typescript title="src/user.service.spec.ts"
import { beforeAll, describe, expect, it } from '@jest/globals';
import { TestBed, type Mocked } from '@suites/unit';
import { NameFormatter, UserRepository, UserService } from './user.service';

describe('UserService, solitary', () => {
  let unit: UserService;
  let repository: Mocked<UserRepository>;
  let formatter: Mocked<NameFormatter>;

  beforeAll(async () => {
    const testBed = await TestBed.solitary(UserService).compile();
    unit = testBed.unit;
    repository = testBed.unitRef.get(UserRepository);
    formatter = testBed.unitRef.get(NameFormatter);
  });

  it('greets the user returned by the repository', async () => {
    repository.findName.mockResolvedValue(' Ada ');
    formatter.format.mockReturnValue('Ada');

    await expect(unit.greet('user-1')).resolves.toBe('Hello, Ada!');
    expect(repository.findName).toHaveBeenCalledWith('user-1');
    expect(formatter.format).toHaveBeenCalledWith(' Ada ');
  });
});
```

For Vitest, import `beforeAll`, `describe`, `expect`, and `it` from `vitest`. For NodeNext ESM projects, use `.js` extensions for relative imports and your runner's ESM configuration.

Run `pnpm exec jest` or `pnpm exec vitest run`. Expect **one passing test**: the repository receives the requested ID, and the service returns the greeting using the configured formatter result.

## Your first test passes

You have a working solitary test. Continue to [Solitary Unit Tests](/docs/guides/solitary/) to extend this pattern, or [Sociable Unit Tests](/docs/guides/sociable/) to test selected real collaborators. The remaining examples are optional; use them when your service needs real collaborators, custom tokens, or framework-specific configuration.

## 4. Keep selected business logic real

A **sociable test** exercises the unit together with selected real collaborators. Add this test to the same spec file, using the imports above:

```typescript
describe('UserService, sociable', () => {
  let unit: UserService;
  let repository: Mocked<UserRepository>;

  beforeAll(async () => {
    const testBed = await TestBed.sociable(UserService)
      .expose(NameFormatter)
      .compile();
    unit = testBed.unit;
    repository = testBed.unitRef.get(UserRepository);
  });

  it('formats the mocked repository response with the real formatter', async () => {
    repository.findName.mockResolvedValue(' Ada ');

    await expect(unit.greet('user-1')).resolves.toBe('Hello, Ada!');
  });
});
```

`NameFormatter.format()` now runs its real trimming logic. The repository stays mocked. Exposed real classes cannot be retrieved through `unitRef`; see [UnitReference](/docs/api-reference/unit-reference/#important-limitations).

Run the same test command again. With both examples in the spec file, expect **two passing tests**.

## Supply custom injection tokens

Use `@Inject(token)` when a dependency has no runtime class, such as a configuration interface. Export the token so the service and test share its identity.

```typescript title="src/greeting.service.ts"
import 'reflect-metadata';
import { Inject, Injectable } from '@nestjs/common';

export const GREETING_OPTIONS = Symbol('GREETING_OPTIONS');
export interface GreetingOptions {
  prefix: string;
}

@Injectable()
export class GreetingService {
  constructor(@Inject(GREETING_OPTIONS) private readonly options: GreetingOptions) {}

  greet(name: string): string {
    return `${this.options.prefix}, ${name}!`;
  }
}
```

```typescript title="src/greeting.service.spec.ts"
import { beforeAll, describe, expect, it } from '@jest/globals';
import { TestBed, type Mocked } from '@suites/unit';
import { GREETING_OPTIONS, GreetingService, type GreetingOptions } from './greeting.service';

describe('GreetingService', () => {
  let unit: GreetingService;

  beforeAll(async () => {
    const testBed = await TestBed.solitary(GreetingService)
      .mock<GreetingOptions>(GREETING_OPTIONS)
      .final({ prefix: 'Welcome' })
      .compile();
    unit = testBed.unit;
  });

  it('uses the supplied greeting options', () => {
    expect(unit.greet('Ada')).toBe('Welcome, Ada!');
  });
});
```

`.final()` injects the supplied value as-is. It is not retrievable through `unitRef`. For token-based method mocks, use `unitRef.get<DependencyType>(TOKEN)` or configure `.mock<DependencyType>(TOKEN).impl(...)`. NestJS calls do not take a second metadata argument.

## Choose the right test boundary

| Test goal | Approach |
| --- | --- |
| Service behavior with controlled collaborators | `TestBed.solitary(Service)` |
| Service behavior with selected real classes | `TestBed.sociable(Service).expose(Collaborator)` |
| Module imports, provider factories, or provider overrides | Nest's `Test.createTestingModule()` |
| HTTP routing, guards, pipes, or interceptors in the request lifecycle | A Nest application test with the relevant modules |

Suites reads constructor and supported property injection metadata. It does not boot the Nest module graph, execute module provider factories, or validate your production provider registrations. Direct imports and exposed code execute normally, including any I/O they perform.

## Summary

- Load the NestJS adapter's `/metadata` reference and configure decorator metadata emission.
- Retrieve generated mocks by their dependency class or token.
- Use `.expose()` for selected real collaborators and `.final()` for supplied values.
- Use Nest's testing tools when the test needs module wiring or application behavior.

## Next steps

- **[Solitary Unit Tests](/docs/guides/solitary/)**: Extend your first test with more mock configurations.
- **[Mock Configuration](/docs/api-reference/mock-configuration/)**: Configure mocks before construction.
- **[Sociable Unit Tests](/docs/guides/sociable/)**: Choose which collaborators run real code.
- **[Quick Start](/docs/get-started/quickstart/)**: Return to the overview or choose another framework.

## Additional resources

- **[NestJS Suites recipe](https://docs.nestjs.com/v11/recipes/suites)**: Nest's introduction to Suites. Use this guide's `/metadata` declaration path and the current Jest or Vitest setup for Suites 4.
