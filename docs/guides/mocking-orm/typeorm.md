---
sidebar_position: 1
title: Mocking TypeORM
description: How to mock TypeORM repositories and entity managers in your unit tests
---

# Mocking TypeORM

:::info Overview
For an overview of the pattern and approach to mocking ORMs, see the [Mocking ORMs overview](../mocking-orm).
:::

TypeORM uses repositories and entity managers to interact with the database. Wrap these in injectables.

If you are using NestJS, you can follow the [NestJS TypeORM documentation](https://docs.nestjs.com/recipes/sql-typeorm).

## Step 1: Create an Injectable Repository

```typescript title="user.repository.ts"
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly typeOrmRepo: Repository<User>
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.typeOrmRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.typeOrmRepo.findOne({ where: { email } });
  }

  async save(user: User): Promise<User> {
    return this.typeOrmRepo.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.typeOrmRepo.delete(id);
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

    const user = new User();
    user.email = email;
    user.name = name;
    return this.userRepository.save(user);
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
    userRepository.save.mockResolvedValue(newUser);

    const result = await userService.createUser("new@example.com", "New User");

    expect(result).toEqual(newUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith("new@example.com");
    expect(userRepository.save).toHaveBeenCalled();
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

    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
```

## Using Entity Manager Directly

If you need to use TypeORM's EntityManager for transactions or complex queries:

```typescript title="transaction.service.ts"
import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

@Injectable()
export class TransactionService {
  constructor(private readonly entityManager: EntityManager) {}

  async executeInTransaction<T>(
    callback: (manager: EntityManager) => Promise<T>
  ): Promise<T> {
    return this.entityManager.transaction(callback);
  }
}
```

```typescript title="transaction.service.spec.ts"
import { TestBed, type Mocked } from "@suites/unit";
import { TransactionService } from "./transaction.service";
import { EntityManager } from "typeorm";

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
    entityManager.transaction.mockImplementation(async (fn) =>
      fn(entityManager)
    );

    const result = await transactionService.executeInTransaction(callback);

    expect(result).toBe("result");
    expect(entityManager.transaction).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(entityManager);
  });
});
```

