---
sidebar_position: 2
title: What is Suites?
description: What is Suites?
toc_min_heading_level: 3
---

Suites is an opinionated, flexible [testing meta-framework](/docs/overview/meta-framework) aim at elevating the software testing experience within
backend systems. By integrating a wide array of testing tools into a cohesive framework, Suites simplifies the process
of creating reliable tests, thereby ensuring the development of high-quality software.
[Originating from the solid foundation laid by Automock](/docs/overview/the-shift-from-automock), Suites has evolved into a more comprehensive solution,
aimed at addressing a broader range of testing challenges.

Currently, Suites shines in enhancing **unit testing within dependency injection frameworks** such as NestJS
and InversifyJS (and more to come). It offers a streamlined and opinionated approach to crafting reliable unit tests.
However, Suites' vision extends far beyond the realm of DI-centric unit testing. In the future, we plan to expand
Suites' capabilities to encompass a broader range of testing scenarios, including integration testing and more.

## Prerequisites

  - Familiarity with [TypeScript](https://www.typescriptlang.org/)
  - Familiarity with [basic testing principles and practices](/docs)
  - Use [dependency injection framework in your code](/docs)

## Supported Technologies

Suites supports a broad spectrum of DI frameworks and testing libraries, including but not limited to:

- **Dependency Injection Frameworks**: NestJS, InversifyJS (TSyringe coming soon!)
- **Mocking Libraries**: Jest, Sinon, and Vitest (Bun and Deno coming soon!)