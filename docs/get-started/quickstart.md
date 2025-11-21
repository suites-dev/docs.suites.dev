---
sidebar_position: 4
title: Quick Start
description: Write your first test with Suites in 5 minutes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start Guide

Write the first Suites test in 5 minutes. No manual mocks, no dependency injection configuration, no boilerplate.

**What this covers:**
* Solitary tests with automatic mocking
* Sociable tests with real dependencies
* Zero-config testing

:::info
Complete source code for this example (and more) is available in the [Suites Examples repository](https://github.com/suites-dev/examples).
:::

## Prerequisites

Before starting, ensure the [Installation guide](/docs/get-started/installation) has been completed to set up the project with Suites.

- Basic knowledge of TypeScript and unit testing
- Familiarity with dependency injection patterns
- Familiarity with unit testing basic concepts

## Step 1: Creating the Application Code

This guide creates example `UserService` and `UserRepository` classes to test. NestJS decorators are used here, but
**Suites works with any DI framework** (InversifyJS, etc.) or even plain TypeScript classes with constructor injection:

```typescript title='src/types.ts'
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### Create a Repository Class

```typescript title='src/user.repository.ts'
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

### Create a Service Class with a Dependency

```typescript title='src/user.service.ts'
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

## Step 2: Writing the First Test with Suites

This example writes a test for a `UserService` that depends on a `UserRepository`:

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
      email: 'john@doe.com',
    });

    const result = await userService.getUserName(1);

    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    expect(result).toBe('John Doe');
  });
});
```

### Running the Test

Run tests with:

```bash
npm test
```

You should see output like:

```
 PASS  src/user.service.spec.ts
  User Service Unit Spec
    ✓ should return the user name and call repository (5ms)

Tests:  1 passed, 1 total
Time:   0.5s
```

### What Just Happened?

When `TestBed.solitary(UserService).compile()` is called, Suites automatically:

1. **Analyzed** `UserService`'s constructor and discovered its `UserRepository` dependency
2. **Created** a type-safe mock of `UserRepository` with all methods automatically stubbed
3. **Injected** the mock into `UserService` without manual wiring
4. **Provided** type-safe access to both the service (`unit`) and its mocks (`unitRef`)

**What was not required:** Manually creating mocks, configuring dependency injection, or writing test setup boilerplate.

:::tip Key Terminology

- **Solitary Test**: A test where all dependencies are automatically mocked (complete isolation)
- **Mock**: A fake object with stubbed methods (e.g., `Mocked<UserRepository>`)
- **Stub**: A fake method that returns predefined values (e.g., `mockResolvedValue(...)`)
:::

## Step 3: Testing with Real Dependencies (Sociable Mode)

Test how components work together using real implementations with **sociable tests**:

```typescript title='src/notification.service.spec.ts'
import { TestBed } from '@suites/unit';
import { NotificationService } from './notification.service';
import { TemplateService } from './template.service';
import { EmailClient } from './email.client';

describe('Notification Service Sociable Spec', () => {
  it('should use real TemplateService but mock EmailClient', async () => {
    const { unit, unitRef } = await TestBed.sociable(NotificationService)
      .expose(TemplateService) // Use real TemplateService
      .compile();

    const emailClient = unitRef.get(EmailClient);
    emailClient.send.mockResolvedValue({ success: true });

    await unit.sendWelcomeEmail('user@example.com');

    // TemplateService.format() runs with REAL logic
    // EmailClient.send() is mocked
    expect(emailClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        subject: 'Welcome!',
      })
    );
  });
});
```

:::tip
Sociable tests verify that components integrate correctly while keeping tests fast by mocking external boundaries (databases, HTTP clients, etc.).

Learn more in the [Sociable Unit Testing guide](/docs/guides/sociable).
:::

## How It Works: No Modules, No Bootstrapping

This guide uses NestJS's `@Injectable()` decorators but never creates a NestJS module or calls `Test.createTestingModule()`. This is by design, **and NestJS is just one example**. Suites works the same way with InversifyJS, TSyringe, or any TypeScript class with constructor injection.

### The Traditional Testing Problem

Traditional testing approaches require extensive boilerplate and manual setup:

<Tabs>
<TabItem value="manual" label="Manual" default>

```typescript
// Manual: Define mock classes for every dependency
class MockUserRepository {
  findById = jest.fn();
  save = jest.fn();
  delete = jest.fn();
  // ... more methods
}

class MockEmailService {
  send = jest.fn();
  validate = jest.fn();
  // ... more methods
}

const mockRepo = new MockUserRepository();
const mockEmail = new MockEmailService();
const userService = new UserService(mockRepo, mockEmail);
// No DI benefits, pure manual wiring
```

</TabItem>
<TabItem value="nestjs" label="NestJS">

```typescript
// NestJS: Complex module setup
const module = await Test.createTestingModule({
  imports: [DatabaseModule, ConfigModule, LoggerModule],
  providers: [
    UserService,
    { provide: UserRepository, useValue: mockRepo },
    { provide: EmailService, useValue: mockEmail },
    // ... wire every dependency
  ]
}).compile();
// Wait 2-5 seconds for module initialization...
```

</TabItem>
<TabItem value="inversify" label="InversifyJS">

```typescript
// InversifyJS: Container configuration
const container = new Container();
container.bind(TYPES.UserRepository).toConstantValue(mockRepo);
container.bind(TYPES.EmailService).toConstantValue(mockEmail);
container.bind(TYPES.UserService).toSelf();
// Manual container setup for every test
```

</TabItem>
</Tabs>

### The Suites Solution: Virtual Test Container

Suites bypasses framework initialization entirely:

```typescript
// Suites: Direct to testing, no ceremony
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
// Ready in 50-100ms
```

**How it works:**
1. **Metadata extraction** - Reads TypeScript decorator metadata directly
2. **Selective mocking** - Creates only the dependencies your class needs
3. **Direct instantiation** - Constructs your class with mocks injected
4. **Zero overhead** - No modules, no framework, no waiting

**The result:** Tests run 20-100x faster while remaining type-safe and maintainable.

**Deep dive:** [Virtual Test Container Guide](/docs/guides/virtual-test-container)

## What's Next?

- [Unit Testing Fundamentals](/docs/guides/fundamentals) - Learn about the core principles of unit testing
- [Test Doubles](/docs/guides/test-doubles) - Understand how to work with mocks, stubs, and other test doubles
- [Solitary Unit Testing](/docs/guides/solitary) - Dive deeper into testing components in complete isolation
- [Sociable Unit Testing](/docs/guides/sociable) - Explore testing with real implementations of select dependencies

Need help? Join the [Suites community on GitHub Discussions](https://github.com/suites-dev/suites/discussions) or report issues on our [GitHub repository](https://github.com/suites-dev/suites).
