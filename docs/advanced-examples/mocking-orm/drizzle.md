---
sidebar_position: 11
title: Mocking Drizzle
description: How to mock Drizzle database instances in your unit tests
---

# Mocking Drizzle

:::info Overview
For an overview of the pattern and approach to mocking ORMs, see the [Mocking ORMs overview](../mocking-orm).
:::

Drizzle uses a database instance that you typically import directly. Wrap it in an injectable class.

## Step 1: Create a Database Injectable

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

## Step 2: Create a Repository Wrapper

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

## Step 3: Use the Repository in Your Service

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

## Step 4: Test with Suites

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

## Direct Database Injection

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

