---
sidebar_position: 3
title: Quick Start
description: Learn how to set up and write your first test with Suites in minutes
---

# Quick Start Guide 🚀

Get up and running with Suites in just **5 minutes**! This guide will walk you through building a small application and testing it with Suites, showing you how it eliminates boilerplate and simplifies testing.

<div class="quick-start-overview">

## 📋 What You'll Build

In this guide, you'll create:
- ✅ A simple user service with dependency injection
- ✅ Your first unit test using Suites' TestBed
- ✅ Automated mocks for all dependencies
- ✅ Type-safe testing with full IntelliSense support

**Time to complete:** ~5 minutes  
**Prerequisites:** Basic TypeScript knowledge, Node.js installed

</div>

:::tip Before You Start
This guide uses **NestJS** as an example, but Suites works with any DI framework. Check out our [adapters documentation](/docs/developer-guide/adapters/) for other frameworks.
:::

## 🎯 Choose Your Path

<div class="cards-container">
  <div class="card">
    <h4>📚 I want to understand the concepts</h4>
    <p>Continue reading this guide for a complete walkthrough</p>
  </div>
  <div class="card">
    <h4>⚡ Just show me the code!</h4>
    <p>Jump to the <a href="#complete-example">complete example</a> or check out our <a href="https://github.com/suites-dev/examples">examples repository</a></p>
  </div>
</div>

## Project Setup 🛠️

Let's create a new project and install the necessary dependencies:

### 1. Initialize Your Project

```bash
mkdir suites-quickstart
cd suites-quickstart
npm init -y
```

### 2. Install Dependencies

<details>
<summary>📦 <strong>For NestJS Projects</strong></summary>

```bash
# Core dependencies
npm install @nestjs/common @nestjs/core reflect-metadata rxjs

# Suites packages
npm install --save-dev @suites/unit @suites/di.nestjs @suites/doubles.jest

# Testing dependencies
npm install --save-dev jest @types/jest ts-jest typescript
```

</details>

<details>
<summary>📦 <strong>For InversifyJS Projects</strong></summary>

```bash
# Core dependencies
npm install inversify reflect-metadata

# Suites packages
npm install --save-dev @suites/unit @suites/di.inversify @suites/doubles.jest

# Testing dependencies
npm install --save-dev jest @types/jest ts-jest typescript
```

</details>

### 3. Configure TypeScript and Jest

<details>
<summary>⚙️ <strong>Configuration Files</strong></summary>

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

</details>

## Building Your Application 📝

Let's create a simple user management system to demonstrate Suites in action.

### Step 1: Define Your Domain

```typescript title="src/types.ts"
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### Step 2: Create a Repository

```typescript title="src/user.repository.ts"
import { Injectable } from '@nestjs/common';
import { User } from './types';

@Injectable()
export class UserRepository {
  async getUserById(id: number): Promise<User> {
    // In a real app, this would fetch from a database
    return { id, name: 'John Doe', email: 'john@example.com' };
  }
}
```

### Step 3: Create a Service with Dependencies

```typescript title="src/user.service.ts"
import { Injectable } from '@nestjs/common';
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

## Writing Your First Test ✅

Now comes the magic! Let's test our `UserService` with Suites:

```typescript title="src/user.service.spec.ts" {7,10-12}
import { type Mocked, TestBed } from '@suites/unit';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('User Service Unit Spec', () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>; // Type-safe mock!

  beforeAll(async () => {
    // One line to create your test environment!
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    
    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it('should return the user name', async () => {
    // Arrange: Setup mock behavior with full type safety
    userRepository.getUserById.mockResolvedValue({ 
      id: 1, 
      name: 'Jane Smith', 
      email: 'jane@example.com' 
    });

    // Act: Call the method under test
    const result = await userService.getUserName(1);

    // Assert: Verify behavior
    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    expect(result).toBe('Jane Smith');
  });
});
```

:::warning Getting "Cannot find name 'Mocked'" error?
If you see TypeScript errors about the `Mocked` type, you need to set up type references. This is a required step in the [installation process](/docs/overview/installation#-required-type-reference-configuration). Make sure you have a `global.d.ts` file with the appropriate type reference for your mocking library.
:::

### 🎉 Run Your Test

```bash
npm test
```

That's it! You've just written a fully isolated unit test with:
- ✅ Zero boilerplate for mock creation
- ✅ Automatic dependency resolution
- ✅ Full type safety
- ✅ Clean, readable test code

## How Suites Works 🔍

<div class="how-it-works-section">

### The Magic Behind `TestBed.solitary()`

When you call `TestBed.solitary(UserService).compile()`, Suites:

1. **Creates a virtual DI container** - No heavy framework initialization
2. **Analyzes dependencies** - Uses reflection to find what `UserService` needs
3. **Auto-generates mocks** - Creates Jest mocks for all dependencies
4. **Injects mocks** - Wires everything together automatically
5. **Provides type safety** - Gives you fully typed mocks via `Mocked<T>`

### Traditional Testing vs. Suites

<div class="comparison-table">

| Traditional Approach | With Suites |
|---------------------|-------------|
| Initialize full DI container | Virtual lightweight container |
| Manually create each mock | Automatic mock generation |
| Wire mocks into container | Automatic dependency injection |
| Lots of boilerplate | One line setup |
| Easy to miss dependencies | All dependencies handled |

</div>

</div>

## Common Testing Patterns 🎯

### Pattern 1: Configure Mock Responses

```typescript
// Option 1: Using Jest's mock functions (flexible)
userRepository.getUserById.mockResolvedValue({ 
  id: 1, name: 'Test User', email: 'test@example.com' 
});

// Option 2: Using .mock().final() for immutable responses
const { unit } = await TestBed.solitary(UserService)
  .mock(UserRepository)
  .final({
    getUserById: async () => ({ 
      id: 1, name: 'Test User', email: 'test@example.com' 
    })
  })
  .compile();
```

### Pattern 2: Test Error Scenarios

```typescript
it('should handle repository errors gracefully', async () => {
  userRepository.getUserById.mockRejectedValue(
    new Error('Database connection failed')
  );

  await expect(userService.getUserName(1))
    .rejects.toThrow('Database connection failed');
});
```

### Pattern 3: Verify Complex Interactions

```typescript
it('should cache user lookups', async () => {
  const mockUser = { id: 1, name: 'Cached User', email: 'cache@example.com' };
  userRepository.getUserById.mockResolvedValue(mockUser);

  // Call twice
  await userService.getUserName(1);
  await userService.getUserName(1);

  // Verify repository was only called once (if caching is implemented)
  expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
});
```

## Complete Example

Here's everything together for easy copy-paste:

<details>
<summary>📄 <strong>Complete Working Example</strong></summary>

```typescript title="src/complete-example.spec.ts"
import { Injectable } from '@nestjs/common';
import { type Mocked, TestBed } from '@suites/unit';

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

// Repository
@Injectable()
class UserRepository {
  async getUserById(id: number): Promise<User> {
    throw new Error('Should not be called in tests');
  }
}

// Service
@Injectable()
class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserName(id: number): Promise<string> {
    const user = await this.userRepository.getUserById(id);
    return user.name;
  }
}

// Test
describe('UserService', () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it('should return user name', async () => {
    userRepository.getUserById.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    });

    const name = await userService.getUserName(1);

    expect(name).toBe('John Doe');
    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
  });
});
```

</details>

<div class="next-steps-section">

## Next Steps 🚀

Congratulations! You've successfully written your first test with Suites. Here's where to go next:

### 📚 Learn More
- [**Solitary Unit Tests**](/docs/developer-guide/unit-tests/solitary) - Deep dive into isolated testing
- [**Sociable Unit Tests**](/docs/developer-guide/unit-tests/sociable) - Test with real dependencies
- [**Test Doubles**](/docs/developer-guide/unit-tests/test-doubles) - Master mocks, stubs, and spies

### 🛠️ Advanced Topics
- [**Dependency Injection Adapters**](/docs/developer-guide/adapters/) - Use Suites with other DI frameworks
- [**Design for Testability**](/docs/developer-guide/design-for-testability/) - Write more testable code

### 💬 Get Help
- [GitHub Discussions](https://github.com/suites-dev/suites/discussions) - Ask questions and share ideas
- [GitHub Issues](https://github.com/suites-dev/suites/issues) - Report bugs or request features
- [Examples Repository](https://github.com/suites-dev/examples) - More code examples

</div>

---

**Ready to write better tests with less code?** Explore our [Unit Testing Guide](/docs/developer-guide/unit-tests/) for comprehensive coverage of all Suites features.