---
sidebar_position: 2
title: What is Suites?
description: Understanding what Suites is and how it can help you write better tests
toc_min_heading_level: 3
---

**Suites is a progressive, flexible unit-testing framework aimed at elevating the software testing experience within backend systems.** By providing a powerful set of tools tailored for dependency injection testing, Suites simplifies the process of creating reliable unit tests,
thereby ensuring the development of high-quality software.

Suites focuses specifically on dependency injections patterns, a subset of the broader inversion of control (IoC) principle, to provide a consistent and
scalable approach to managing dependency-injected classes. [Originating from the solid foundation laid by Automock](/docs/overview/migrating-from-automock/),
Suites has evolved into a comprehensive solution for testing DI-based applications, aimed at addressing
[a broader range of testing challenges](/docs/overview/problems-solved/).

## Supported Libraries

Suites works seamlessly with popular DI frameworks and testing libraries including:

✅ **Dependency Injection Frameworks:** NestJS, InversifyJS (TSyringe coming soon!) \
✅ **Mocking Libraries:** Jest, Sinon, and Vitest (Bun and Deno coming soon!)

## How Suites Works

Suites integrates with your existing testing libraries and DI frameworks, such as Jest, Sinon, and Vitest with
NestJS and InversifyJS. Through this integration, Suites provides specialized tools and utilities that make it easier to 
write, run, and manage tests for dependency-injected classes. It handles the complexity of mocking dependencies and managing
the DI container, which lets developers focus on writing meaningful tests.

:::info Want to become a Suites expert?
Visit **[Suites Academy](/academy/)** for in-depth tutorials on design principles, advanced testing strategies, and architectural patterns that will help you get the most out of Suites.
:::

## Prerequisites

  - **TypeScript project**: Suites requires TypeScript with decorators and metadata reflection enabled
  - **Node.js environment**: Compatible with Node.js 16.x and above
  - **Dependency injection framework**: One of the supported frameworks (NestJS, InversifyJS)
  - **Testing library**: One of the supported libraries (Jest, Sinon, Vitest)
  - **Basic understanding of unit testing**: Knowledge of concepts like mocking, stubbing, and test isolation

<div class="next-steps-section">

## What's Next?

Now that you have a basic understanding of what Suites is, you can explore the features and capabilities it
offers. To get started, check out the [Quick Start](/docs/overview/quickstart) guide to learn how to set up Suites in
your project and start writing tests.

</div>
