---
sidebar_position: 12
title: Mocking MikroORM
description: How to mock MikroORM entity managers and repositories in your unit tests
---

# Mocking MikroORM

:::info Overview
For an overview of the pattern and approach to mocking ORMs, see the [Mocking ORMs overview](/docs/recipes/mocking-orm).
:::

:::tip Complete Examples
For complete, runnable MikroORM examples, see the [MikroORM examples](https://github.com/suites-dev/examples/tree/main/nestjs-jest-mikroorm) in the Suites Examples repository.
:::

MikroORM uses entity managers and repositories to interact with the database. Wrap these in injectable classes.

If you are using NestJS, you can follow the [NestJS MikroORM documentation](https://docs.nestjs.com/recipes/mikroorm).

## Step 1: Create an Injectable Repository

```typescript title="user.repository.ts"
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/core";
import { User } from "./user.entity";

@Injectable()
export class UserRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: number): Promise<User | null> {
    return this.em.findOne(User, { id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }

  async create(email: string, name: string): Promise<User> {
    const user = this.em.create(User, { email, name });
    await this.em.persistAndFlush(user);
    return user;
  }

  async save(user: User): Promise<User> {
    await this.em.persistAndFlush(user);
    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.em.findOne(User, { id });
    if (user) {
      await this.em.removeAndFlush(user);
    }
  }
}
```

## Step 2: Use the Repository in Your Service

```typescript title="user.service.ts"
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(email: string, name: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    return this.userRepository.create(email, name);
  }
}
```

## Step 3: Test with Suites

```typescript title="user.service.spec.ts"
import { TestBed, type Mocked } from "@suites/unit";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it("should get user by id", async () => {
    const mockUser: User = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
    };
    userRepository.findById.mockResolvedValue(mockUser);

    const result = await userService.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should create a new user", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    const newUser: User = { id: 1, email: "new@example.com", name: "New User" };
    userRepository.create.mockResolvedValue(newUser);

    const result = await userService.createUser("new@example.com", "New User");

    expect(result).toEqual(newUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith("new@example.com");
    expect(userRepository.create).toHaveBeenCalledWith(
      "new@example.com",
      "New User"
    );
  });

  it("should throw error if user already exists", async () => {
    const existingUser: User = {
      id: 1,
      email: "existing@example.com",
      name: "Existing",
    };
    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      userService.createUser("existing@example.com", "New Name")
    ).rejects.toThrow("User already exists");

    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
```

## Using Entity Manager Directly

If you need to use MikroORM's EntityManager directly for transactions or complex queries:

```typescript title="transaction.service.ts"
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/core";

@Injectable()
export class TransactionService {
  constructor(private readonly em: EntityManager) {}

  async executeInTransaction<T>(
    callback: (em: EntityManager) => Promise<T>
  ): Promise<T> {
    return this.em.transactional(callback);
  }
}
```

```typescript title="transaction.service.spec.ts"
import { TestBed, type Mocked } from "@suites/unit";
import { TransactionService } from "./transaction.service";
import { EntityManager } from "@mikro-orm/core";

describe("TransactionService", () => {
  let transactionService: TransactionService;
  let entityManager: Mocked<EntityManager>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(
      TransactionService
    ).compile();
    transactionService = unit;
    entityManager = unitRef.get(EntityManager);
  });

  it("should execute callback in transaction", async () => {
    const callback = jest.fn().mockResolvedValue("result");
    entityManager.transactional.mockImplementation(async (fn) =>
      fn(entityManager)
    );

    const result = await transactionService.executeInTransaction(callback);

    expect(result).toBe("result");
    expect(entityManager.transactional).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(entityManager);
  });
});
```

## Summary

- **Wrap MikroORM EntityManager** in injectable repository classes to make them mockable
- **Use Suites** to automatically mock repository dependencies in your service tests
- **EntityManager** can be injected directly for transactions and complex queries
- **Keep repositories focused** on data access, separating concerns from business logic

## Next Steps

- **[Solitary Unit Tests](/docs/guides/solitary)**: Deep dive into testing in isolation
- **[Test Doubles](/docs/guides/test-doubles)**: Understand mocks and stubs in depth
