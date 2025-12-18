---
sidebar_position: 8
title: Mocking ORMs
description: How to mock TypeORM, Prisma, and Drizzle in your unit tests
---

# Mocking ORMs

> **What this covers:** Mocking Object-Relational Mapping (ORM) libraries like TypeORM, Prisma, and Drizzle \
> **Time to read:** ~12 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals), [Solitary Unit Tests](./solitary) \
> **Best for:** Testing services that interact with databases without hitting real database connections

When testing services that interact with databases, you need to mock ORM clients to keep tests isolated. This guide shows you how to structure your code and write tests for three popular ORMs: TypeORM, Prisma, and Drizzle.

## Overview

This guide covers:

1. The pattern: Wrapping ORM clients in injectables
2. TypeORM: Mocking repositories and entity managers
3. Prisma: Mocking Prisma client instances
4. Drizzle: Mocking Drizzle database instances
5. Best practices for ORM mocking

## The Pattern: Wrap ORM Clients with Injectables

ORMs typically provide clients or managers that you import directly. To make them mockable with Suites, wrap them in injectable classes that your business logic depends on.

**Why wrap ORM clients?**

- **Explicit dependencies**: Suites can only mock dependencies passed through constructors
- **Type safety**: Full TypeScript support for mocked methods
- **Testability**: Easy to replace with mocks in tests
- **Abstraction**: Business logic doesn't depend on specific ORM implementation details

## TypeORM

TypeORM uses repositories and entity managers to interact with the database. Wrap these in injectables.

If you are using NestJS, you can follow the [NestJS TypeORM documentation](https://docs.nestjs.com/recipes/sql-typeorm).

### Step 1: Create an Injectable Repository

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

### Step 2: Use the Repository in Your Service

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

### Step 3: Test with Suites

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

### Using Entity Manager Directly

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

## Prisma

Prisma uses a generated client that you typically import directly. Wrap it in an injectable class.

If you are using NestJS, you can follow the [NestJS Prisma documentation](https://docs.nestjs.com/recipes/prisma).

### Step 1: Create a Prisma Injectable

```typescript title="prisma.service.ts"
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Step 2: Create a Repository Wrapper

```typescript title="user.repository.ts"
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { User, Prisma } from "@prisma/client";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
```

### Step 3: Use the Repository in Your Service

```typescript title="user.service.ts"
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "@prisma/client";

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

    return this.userRepository.create({ email, name });
  }
}
```

### Step 4: Test with Suites

```typescript title="user.service.spec.ts"
import { TestBed, type Mocked } from "@suites/unit";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { User } from "@prisma/client";

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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userRepository.findById.mockResolvedValue(mockUser);

    const result = await userService.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should create a new user", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    const newUser: User = {
      id: 1,
      email: "new@example.com",
      name: "New User",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userRepository.create.mockResolvedValue(newUser);

    const result = await userService.createUser("new@example.com", "New User");

    expect(result).toEqual(newUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith("new@example.com");
    expect(userRepository.create).toHaveBeenCalledWith({
      email: "new@example.com",
      name: "New User",
    });
  });
});
```

### Direct Prisma Client Injection

If you prefer to inject PrismaService directly:

```typescript title="user.service.ts"
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

```typescript title="user.service.spec.ts"
import { TestBed, type Mocked } from "@suites/unit";
import { UserService } from "./user.service";
import { PrismaService } from "./prisma.service";

describe("UserService", () => {
  let userService: UserService;
  let prisma: Mocked<PrismaService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    prisma = unitRef.get(PrismaService);
  });

  it("should get user by id", async () => {
    const mockUser = { id: 1, email: "test@example.com", name: "Test" };
    prisma.user.findUnique.mockResolvedValue(mockUser as any);

    const result = await userService.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
```

## Drizzle

Drizzle uses a database instance that you typically import directly. Wrap it in an injectable class.

### Step 1: Create a Database Injectable

```typescript title="database.service.ts"
import { Injectable } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

@Injectable()
export class DatabaseService {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool, { schema });
  }

  getDb() {
    return this.db;
  }
}
```

### Step 2: Create a Repository Wrapper

```typescript title="user.repository.ts"
import { Injectable } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { users } from "./schema";
import { eq } from "drizzle-orm";

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: number) {
    const db = this.database.getDb();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findByEmail(email: string) {
    const db = this.database.getDb();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  }

  async create(email: string, name: string) {
    const db = this.database.getDb();
    const result = await db.insert(users).values({ email, name }).returning();
    return result[0];
  }
}
```

### Step 3: Use the Repository in Your Service

```typescript title="user.service.ts"
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: number) {
    return this.userRepository.findById(id);
  }

  async createUser(email: string, name: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    return this.userRepository.create(email, name);
  }
}
```

### Step 4: Test with Suites

```typescript title="user.service.spec.ts"
import { TestBed, type Mocked } from "@suites/unit";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it("should get user by id", async () => {
    const mockUser = { id: 1, email: "test@example.com", name: "Test User" };
    userRepository.findById.mockResolvedValue(mockUser);

    const result = await userService.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should create a new user", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    const newUser = { id: 1, email: "new@example.com", name: "New User" };
    userRepository.create.mockResolvedValue(newUser);

    const result = await userService.createUser("new@example.com", "New User");

    expect(result).toEqual(newUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith("new@example.com");
    expect(userRepository.create).toHaveBeenCalledWith(
      "new@example.com",
      "New User"
    );
  });
});
```

### Direct Database Injection

If you prefer to inject DatabaseService directly and mock the database instance:

```typescript title="user.service.ts"
import { Injectable } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { users } from "./schema";
import { eq } from "drizzle-orm";

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  async getUserById(id: number) {
    const db = this.database.getDb();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] || null;
  }
}
```

```typescript title="user.service.spec.ts"
import { TestBed, type Mocked } from "@suites/unit";
import { UserService } from "./user.service";
import { DatabaseService } from "./database.service";

describe("UserService", () => {
  let userService: UserService;
  let database: Mocked<DatabaseService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    database = unitRef.get(DatabaseService);
  });

  it("should get user by id", async () => {
    const mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest
        .fn()
        .mockResolvedValue([{ id: 1, email: "test@example.com" }]),
    };
    database.getDb.mockReturnValue(mockDb as any);

    const result = await userService.getUserById(1);

    expect(result).toEqual({ id: 1, email: "test@example.com" });
    expect(database.getDb).toHaveBeenCalled();
  });
});
```

## Summary

- **Wrap ORM clients** in injectables to make them mockable
- **Create repository classes** that encapsulate ORM-specific logic
- **Use Suites** to automatically mock repository dependencies
- **Keep repositories focused** on data access, not business logic
- **Type everything** for full TypeScript support
- **Test error scenarios** in addition to happy paths

## Next Steps

- **[Solitary Unit Tests](./solitary)**: Learn more about testing in isolation
- **[Sociable Unit Tests](./sociable)**: Test multiple components together
- **[Test Doubles](./test-doubles)**: Understand mocks and stubs in depth
