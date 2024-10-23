---
sidebar_position: 2
title: Quick Start
---

# Quick Start

In this guide, we'll build a small, two-class application and test it using Suites. While the example uses Jest and
NestJS annotations for convenience, Suites supports a wide range of dependency injection (DI) frameworks and mocking
libraries. The principles remain the same, so you can adapt this guide to your preferred tools.

:::info
:bulb: You can find this example and more in the [Suites Examples](https://github.com/suites-dev/examples) repository
:::

## Setup

First, let's set up our project. Ensure you have Node.js installed and initialize a new project:

```bash
mkdir suites-quickstart
cd suites-quickstart
npm init -y
```

Install the necessary Suites packages:

```bash
npm install --save-dev @suites/unit @suites/di.nestjs @suites/doubles.jest
```

Install additional packages for TypeScript and Jest:

```bash
npm install --save-dev ts-jest @types/jest jest typescript
```

And lastly, [install the reflect-metadata package](https://github.com/rbuckton/reflect-metadata?tab=readme-ov-file#metadata-reflection-api):

```bash
npm install reflect-metadata
```

### Project Structure

```plaintext
suites-quickstart/
├── src/
│   ├── types.ts
│   ├── user.repository.ts
│   ├── user.service.ts
│   └── user.service.spec.ts
├── tsconfig.json
└── jest.config.js
└── package.json
```

<details>
  <summary><code>package.json</code></summary>

  ```json
  {
    "name": "suites-nestjs-jest-example",
    "private": true,
    "scripts": {
      "test": "jest"
    },
    "dependencies": {
      "@nestjs/common": "^10.3.10",
      "@nestjs/core": "^10.3.10",
      "reflect-metadata": "^0.1.13",
      "rxjs": "^7.8.1"
    },
    "devDependencies": {
      "@suites/unit": "^3.0.0-alpha.2",
      "@suites/di.nestjs": "^3.0.0-alpha.2",
      "@suites/doubles.jest": "^3.0.0-alpha.2",
      "jest": "^29.7.0",
      "ts-jest": "^29.1.5",
      "typescript": "^5.5.3"
    }
  }
  ```
</details>

Create a basic `tsconfig.json`:

<details>
  <summary><code>tsconfig.json</code></summary>

```json
{
  "compilerOptions": {
    "target": "es2020",
    "types": ["node", "jest"],
    "module": "commonjs",
    "noEmit": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node"
  }
}
```

</details>

Configure Jest for TypeScript:

```javascript title="jest.config.js"
module.exports = {
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: { '.ts': ['ts-jest', { isolatedModules: true } ] },
};
```

## Create the Classes

Let's create a simple application with a `UserService` that depends on a `UserRepository` to fetch user data.

### Define the Interfaces and Classes

Here are the interfaces and classes we'll use in our example:

```typescript title="types.ts"
export interface User {
  id: number;
  name: string;
  email: string;
}
```

```typescript title="user.repository.ts"
import { Injectable } from 'any-di-framework';

@Injectable()
export class UserRepository {
  async getUserById(id: number): Promise<User> {
    // Imagine this fetches from a database
    return { id, name: 'John Doe', email: 'john@doe.com' };
  }
}
```

```typescript title="user.service.ts"
import { Injectable } from 'any-di-framework';
import { UserRepository } from './user.repository';
import { User } from './types';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserName(id: number): Promise<string> {
    const user = await this.userRepository.getUserById(id);
    return user.name;
  }
}
```

## Set Up the Test

To test the `UserService` class in isolation, we'll use the `TestBed` factory from the `@suites/unit` package to create
our test environment.

### Example Setup and Test

Here’s the setup and test for `UserService`:

```typescript title="user.service.spec.ts" {1,2,7-8,11-13}
import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('User Service Unit Spec', () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it('should return the user name and call repository', async () => {
    userRepository.getUserById.mockResolvedValue({id: 1, name: 'John Doe'});

    const result = await userService.getUserName(1);

    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    expect(result).toBe('John Doe');
  });
});
```

**When the class under test is instantiated using `TestBed.solitary()`, all its dependencies are automatically mocked.**
These mocks start as stubs with no predefined behaviors or return values. \
This setup offers a clean slate, allowing to define specific behaviors required for each test scenario.

### Running the Test
Run your tests with:

```bash
$ npm test
```

## Review

### Explanation of `unit` and `unitRef`

- **unit**: This represents the instance of the class under test created by the `TestBed`.
- **unitRef**: This allows you to retrieve instances of the mocked dependencies created by the `TestBed`.


### The `Mocked<T>` Type

This type is used to type the mocked instances of the classes. This type is provided by the `@suites/unit` package. This type relies on the mocking library used in the test environment.


### Key Highlights

- **Solitary Unit Testing**: We're using `TestBed.solitary()` to isolate the `UserService` class.

- **Automatic Mocking**: When the class under test (`UserService`) is instantiated using `TestBed.solitary()`,
  all its dependencies are automatically mocked.

- **Virtual DI Container**: Suites skips the full DI container and creates an isolated container leveraging the DI
  framework's reflection and metadata.

### Why there isn't a DI container here?

Suites bypasses the traditional DI container by directly utilizing the DI framework's reflection and metadata
capabilities to construct an isolated test environment. This means that instead of loading the entire DI container,
Suites creates a lightweight, virtual container that mirrors the dependency injection mechanism. This streamlined
approach reduces setup complexity and overhead, leading to faster test execution while still benefiting from dependency
injection principles.

### More than Solitary

In this quick start, we've focused on a [solitary test setup](/docs/developer-guide/unit-tests/solitary).
To explore more complex scenarios, including [sociable unit tests](/docs/developer-guide/unit-tests/sociable),
check out the [Unit Testing](/docs/unit-tests) section.

### Adapting to Different Libraries

Although this example uses Jest and NestJS annotations, Suites supports various DI frameworks and mocking libraries. To
adapt this guide to your preferred tools, simply install the appropriate Suites adapters and follow the same principles:

- **DI Frameworks**: `@suites/di.nestjs`, `@suites/di.inversifyjs`, `@suites/di.tsyringe`
- **Mocking Libraries**: `@suites/doubles.jest`, `@suites/doubles.sinon`, `@suites/doubles.vitest`

## What's Next?

Now that you've completed the quick start guide, you're ready to explore more advanced testing scenarios with Suites.
Check out the [Developer Guide](/docs/guides) section for in-depth tutorials and examples.

If you have any questions or need help, feel free to reach out to the Suites community
on [Github Discussions](https://github.com/suites-dev/suites).