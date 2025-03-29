---
sidebar_position: 2
title: Quick Start
description: Learn how to set up and write your first test with Suites in minutes
---

# Quick Start Guide 🚀

This guide will walk you through building a small application and testing it with Suites in just a few minutes. You'll see firsthand how Suites simplifies testing in dependency injection environments.

:::tip What you'll learn
- Setting up a project with Suites
- Creating a simple application with dependency injection
- Writing your first unit test using Suites' TestBed
- Understanding key Suites concepts and patterns
:::

:::info
Complete source code for this example (and more) is available in the [Suites Examples repository](https://github.com/suites-dev/examples).
:::

## Prerequisites

- Basic knowledge of TypeScript and unit testing
- Node.js installed on your system
- Familiarity with dependency injection concepts

## Project Setup 🛠️

Let's create a new project and install the necessary dependencies:

### 1. Initialize Your Project

```bash
mkdir suites-quickstart
cd suites-quickstart
npm init -y
```

### 2. Install Suites Packages

```bash
# Install NestJS dependencies
npm install @nestjs/common @nestjs/core reflect-metadata rxjs

# Install Suites core and adapters
npm install --save-dev @suites/unit @suites/di.nestjs @suites/doubles.jest

# Install TypeScript and Jest
npm install --save-dev ts-jest @types/jest jest typescript
```

### 3. Configure TypeScript and Jest

Create a `tsconfig.json` file:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "noEmit": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "rootDir": "src",
    "types": ["node", "jest"]
  },
  "include": [
    "src/**/*.spec.ts",
    "global.d.ts"
  ]
}
```

Configure Jest for TypeScript:

```javascript title="jest.config.js"
module.exports = {
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: { '.ts': ['ts-jest', { isolatedModules: true } ] },
};
```

Create a `global.d.ts` file in your project root:

```typescript title="global.d.ts"
/// <reference types="@suites/doubles.jest/unit.d.ts" />
```

## Creating a Simple Application 📝

Let's create a small application with two classes that demonstrate dependency injection:

### 1. Define Data Types

```typescript title="src/types.ts"
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### 2. Create a Repository Class

```typescript title="src/user.repository.ts"
import { Injectable } from '@nestjs/common'; // Or your preferred DI framework
import { User } from './types';

@Injectable()
export class UserRepository {
  async getUserById(id: number): Promise<User> {
    // In a real app, this would fetch from a database
    return { id, name: 'John Doe', email: 'john@example.com' };
  }
}
```

### 3. Create a Service Class with a Dependency

```typescript title="src/user.service.ts"
import { Injectable } from '@nestjs/common'; // Or your preferred DI framework
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

## Writing Your First Test with Suites ✅

Now let's write a test for our `UserService` using Suites' TestBed:

```typescript title="src/user.service.spec.ts"
import { type Mocked, TestBed } from '@suites/unit';
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
    userRepository.getUserById.mockResolvedValue({ 
      id: 1, 
      name: 'John Doe', 
      email: 'john@doe.com' 
    });

    const result = await userService.getUserName(1);

    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    expect(result).toBe('John Doe');
  });
});
```

### Running Your Test

Run your tests with:

```bash
npm test
```

## Understanding How It Works 💡

Let's break down what happened in our test:

### Key Components of Suites

1. **TestBed**: A factory for creating isolated test environments
2. **Mocked\<T\>**: A type that represents a mocked version of a class
3. **unitRef**: An object that provides access to mocked dependencies

### The Magic Behind the Scenes ✨

When you called `TestBed.solitary(UserService).compile()`, Suites automatically:

1. Created an instance of `UserService` for testing
2. Created a mock for `UserRepository` (its dependency) 
3. Injected the mock into the `UserService` instance
4. Provided type-safe access to the mock through `unitRef`

All of this happened without you needing to manually create mocks or configure dependency injection!

### The Virtual DI Container ⚡

A key innovation in Suites is its "virtual DI container" approach. Here's what that means:

- **No Full Container Initialization**: Suites bypasses loading the entire DI container, which can be slow and bring in unrelated dependencies.
- **Metadata-Driven**: Instead, Suites uses the DI framework's own reflection and metadata capabilities to understand dependencies.
- **Lightweight Construction**: Suites builds a minimal, virtual container that includes only what's needed for your test.
- **Framework Integration**: This works seamlessly with your existing DI framework's annotations and decorators.

In traditional testing, you might:
1. Initialize the full DI container
2. Register mock implementations for dependencies
3. Retrieve the service under test

With Suites' virtual DI container, you get:
1. Faster test execution (no framework overhead)
2. Only the dependencies you need (reduced complexity)
3. The same dependency resolution rules as your actual application
4. Automatic mock creation for dependencies

This approach, inspired by Martin Fowler's writings on test isolation, gives you the benefits of dependency injection without the performance and complexity costs.

## Beyond the Basics

Suites offers many more capabilities to streamline your testing workflow:

### Configuring Mock Behavior

```typescript
// Using .mock().final() for immutable responses
const { unit } = await TestBed.solitary(UserService)
  .mock(UserRepository)
  .final({
    getUserById: async () => ({ id: 1, name: 'John Doe', email: 'john@example.com' })
  })
  .compile();

// Using .mock().impl() for flexible responses
const { unit, unitRef } = await TestBed.solitary(UserService)
  .mock(UserRepository)
  .impl(stubFn => ({
    getUserById: stubFn().mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@example.com' })
  }))
  .compile();
```

<div class="next-steps-section">

## What's Next? 🔍

Ready to explore more about Suites? Here are some resources to continue your journey:

- [**Unit Testing Fundamentals**](/docs/developer-guide/unit-tests/fundamentals) - Learn about the core principles of unit testing and how they apply to dependency injection
- [**Test Doubles**](/docs/developer-guide/unit-tests/test-doubles) - Understand how to work with mocks, stubs, and other test doubles in Suites
- [**Solitary Unit Testing**](/docs/developer-guide/unit-tests/solitary) - Dive deeper into testing components in complete isolation
- [**Sociable Unit Testing**](/docs/developer-guide/unit-tests/sociable) - Explore testing with real implementations of select dependencies

Need help? Join the [Suites community on GitHub Discussions](https://github.com/suites-dev/suites/discussions) or report issues on our [GitHub repository](https://github.com/suites-dev/suites).

</div>