---
sidebar_position: 1
title: Overview
description: Introduction to Suites - a specialized unit testing framework for dependency injection
toc_min_heading_level: 3
---

# Overview of Suites

## Welcome to Suites! :wave:

Suites is a framework for unit testing applications built with dependency injection. It creates a simplified, virtual DI container for your tests that automatically handles dependency mocking and wiring.

<div class="quick-links">

### 🚀 Popular Starting Points

<div class="cards-container">
  <div class="card">
    <h4><a href="/docs/overview/quickstart">Quick Start</a></h4>
    <p>Set up your first test with Suites in minutes with hands-on examples</p>
  </div>
  <div class="card">
    <h4><a href="/docs/developer-guide/unit-tests/solitary">Solitary Unit Tests</a></h4>
    <p>Learn how to test components in isolation with automatic mocking</p>
  </div>
  <div class="card">
    <h4><a href="/docs/developer-guide/unit-tests/">Unit Testing Guide</a></h4>
    <p>Comprehensive guide to unit testing with Suites</p>
  </div>
</div>

</div>

## What is Suites?

Suites eliminates the tedious parts of test setup for dependency injection frameworks, enabling developers to focus on writing test logic rather than boilerplate code.

### Key Features

- **🎯 Automatic dependency mocking** - Replace all dependencies with mocks in one line of code
- **🔧 Framework agnostic** - Works with NestJS, InversifyJS, and more
- **🧪 Testing library flexibility** - Integrates with Jest, Sinon, Vitest, and others
- **📘 Type-safe** - Full TypeScript support with accurate type inference

### Why Suites?

Traditional testing with dependency injection requires:
1. Manually creating mock objects for each dependency
2. Configuring each mock's behavior
3. Wiring everything together
4. Handling complex initialization

**Suites automates all of this**, reducing test setup from dozens of lines to just a few.

<div class="academy-promo-section">

## 🎓 Ready to Go Deeper? Visit Suites Academy!

<div class="academy-card">
  <div class="academy-icon-wrapper">
    <img src="/img/icons/academy-icon.svg" alt="Suites Academy" class="academy-promo-icon" />
  </div>
  <div class="academy-content">
    <h3>Master Advanced Testing Concepts</h3>
    <p>Explore advanced concepts, design principles, and expert strategies to master unit testing with Suites. The Academy complements our documentation with in-depth tutorials and architectural guidance.</p>
    <a href="/academy" class="academy-cta">Explore the Academy →</a>
  </div>
</div>

</div>

<div class="navigation-section">

## Documentation Structure

### 📚 Getting Started
- [**Installation**](/docs/overview/installation/) - Setup instructions for different environments
- [**Quick Start**](/docs/overview/quickstart/) - Hands-on guide to writing your first tests
- [**What Problems Does Suites Solve?**](/docs/overview/problems-solved/) - Common testing challenges addressed
- [**Migrating from Automock**](/docs/overview/migrating-from-automock/) - Guide for existing Automock users

### 🛠️ Developer Guide
- [**Unit Testing**](/docs/developer-guide/unit-tests/) - Complete testing guide
  - [Solitary Tests](/docs/developer-guide/unit-tests/solitary) - Testing in isolation
  - [Sociable Tests](/docs/developer-guide/unit-tests/sociable) - Testing with real dependencies
  - [Test Doubles](/docs/developer-guide/unit-tests/test-doubles) - Mocks, stubs, and spies
- [**Dependency Injection Adapters**](/docs/developer-guide/adapters/) - Framework integrations
- [**Design for Testability**](/academy/) - Best practices and principles

</div>

Ready to dive in? Start with the [**Quick Start**](/docs/overview/quickstart/) for a hands-on introduction, or explore [**Unit Testing**](/docs/developer-guide/unit-tests/) for comprehensive guidance.

