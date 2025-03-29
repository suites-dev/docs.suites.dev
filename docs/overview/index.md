---
sidebar_position: 1
title: Overview
description: Introduction to Suites - a specialized unit testing framework for dependency injection
toc_min_heading_level: 3
---

# Overview of Suites

## Welcome to Suites! :wave:

This section introduces you to the core concepts, benefits, and features of Suites, helping you understand how it can transform your testing workflow.

<div class="in-this-section">

### What You'll Find in This Section

- **Quick Start** - Set up your first test with Suites in minutes
- **Problems Solved** - Discover the specific testing challenges Suites addresses
- **Features** - Explore the key features that make Suites powerful
- **Installation** - Learn how to install and configure Suites for your project

</div>

## What is Suites?

Suites is a framework for unit testing applications built with dependency injection. It creates a simplified, virtual DI container for your tests that automatically handles dependency mocking and wiring, making it easier to write clean, maintainable tests.

Key aspects of Suites include:

- **Automatic dependency mocking** - Replace all dependencies with mocks in one line of code
- **Framework agnostic** - Works with popular DI frameworks like NestJS, InversifyJS, and more
- **Adaptable to your testing library** - Integrates with Jest, Sinon, Vitest, and others
- **Type-safe** - Full TypeScript support with accurate type inference

### Simplifying Testing with DI

In traditional testing approaches for dependency injection, you often need to:

1. Manually create mock objects for each dependency
2. Configure each mock's behavior
3. Wire everything together
4. Handle complex initialization requirements

Suites eliminates these pain points by automatically handling the tedious parts of test setup, which enables developers to concentrate on
writing the actual test logic.

<div class="next-steps-section">

## Key Documentation Areas

- [**Quick Start**](/docs/overview/quickstart/) - Hands-on guide to writing your first tests
- [**Installation**](/docs/overview/installation/) - Setup instructions for different environments
- [**What Problems Does Suites Solve?**](/docs/overview/problems-solved/) - Common testing challenges addressed
- [**Migrating from Automock**](/docs/overview/migrating-from-automock/) - Guide for existing Automock users

</div>
Ready to dive in? Start with [What is Suites?](/docs/overview/what-is-suites/) to understand the core concepts, or jump straight to the [Quick Start](/docs/overview/quickstart/) if you prefer a hands-on approach.

