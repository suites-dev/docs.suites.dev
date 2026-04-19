---
sidebar_position: 10
title: Mocking Prisma
description: How to mock Prisma client instances in your unit tests
---

# Mocking Prisma

:::info Overview
For an overview of the pattern and approach to mocking ORMs, see the [Mocking ORMs overview](/docs/recipes/mocking-orm).
:::

:::tip Complete Examples
For complete, runnable Prisma examples, see the [Prisma examples](https://github.com/suites-dev/examples/tree/main/nestjs-jest-prisma) in the Suites Examples repository.
:::

Prisma uses a generated client that you typically import directly. Wrap it in an injectable class.

If you are using NestJS, you can follow the [NestJS Prisma documentation](https://docs.nestjs.com/recipes/prisma).

## Step 1: Create a Prisma Injectable

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

## Step 2: Create a Repository Wrapper

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

## Step 3: Use the Repository in Your Service

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

## Step 4: Test with Suites

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

## Direct Prisma Client Injection

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

## Summary

- **Wrap Prisma client** in an injectable `PrismaService` class to make it mockable
- **Create repository wrappers** for clean separation between data access and business logic
- **Use Suites** to automatically mock repository dependencies in your service tests
- **Direct client injection** is possible but requires more complex mock setup

## Next Steps

- **[Solitary Unit Tests](/docs/guides/solitary)**: Deep dive into testing in isolation
- **[Test Doubles](/docs/guides/test-doubles)**: Understand mocks and stubs in depth
