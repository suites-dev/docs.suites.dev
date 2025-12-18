---
sidebar_position: 8
title: Mocking ORMs
description: How to mock TypeORM, Prisma, Drizzle, and MikroORM in your unit tests
---

# Mocking ORMs

> **What this covers:** Mocking Object-Relational Mapping (ORM) libraries like TypeORM, Prisma, Drizzle, and MikroORM \
> **Time to read:** ~12 minutes \
> **Prerequisites:** [Unit Testing Fundamentals](/docs/guides/fundamentals), [Solitary Unit Tests](../solitary) \
> **Best for:** Testing services that interact with databases without hitting real database connections

When testing services that interact with databases, you need to mock ORM clients to keep tests isolated. This guide shows you how to structure your code and write tests for popular ORMs: TypeORM, Prisma, Drizzle, and MikroORM.

## Overview

This guide covers:

1. The pattern: Wrapping ORM clients in injectables
2. [TypeORM](./typeorm): Mocking repositories and entity managers
3. [Prisma](./prisma): Mocking Prisma client instances
4. [Drizzle](./drizzle): Mocking Drizzle database instances
5. [MikroORM](./mikroorm): Mocking entity managers and repositories

## The Pattern: Wrap ORM Clients with Injectables

ORMs typically provide clients or managers that you import directly. To make them mockable with Suites, wrap them in injectable classes that your business logic depends on.

**Why wrap ORM clients?**

- **Explicit dependencies**: Suites can only mock dependencies passed through constructors
- **Type safety**: Full TypeScript support for mocked methods
- **Testability**: Easy to replace with mocks in tests
- **Abstraction**: Business logic doesn't depend on specific ORM implementation details

## ORM-Specific Guides

Each ORM has its own guide with detailed examples:

- **[TypeORM](./typeorm)** - Mocking TypeORM repositories and EntityManager
- **[Prisma](./prisma)** - Mocking Prisma client instances
- **[Drizzle](./drizzle)** - Mocking Drizzle database instances
- **[MikroORM](./mikroorm)** - Mocking MikroORM EntityManager and repositories

## Summary

- **Wrap ORM clients** in injectables to make them mockable
- **Create repository classes** that encapsulate ORM-specific logic
- **Use Suites** to automatically mock repository dependencies
- **Keep repositories focused** on data access, not business logic
- **Type everything** for full TypeScript support
- **Test error scenarios** in addition to happy paths

## Next Steps

- **[Solitary Unit Tests](../solitary)**: Learn more about testing in isolation
- **[Sociable Unit Tests](../sociable)**: Test multiple components together
- **[Test Doubles](../test-doubles)**: Understand mocks and stubs in depth
