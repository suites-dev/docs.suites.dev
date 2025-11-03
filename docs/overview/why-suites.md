---
sidebar_position: 4
title: Why Suites?
description: Learn why Suites is essential for testing TypeScript backends with dependency injection
---

# Why Suites?

Large, critical codebases require **quality assurance at the unit level** - but achieving it is harder than it sounds. Unit testing in modern TypeScript backends involves extensive mocking, which makes the process **expensive, slow**, and often skews the **value-to-effort ratio**. Dependency injection only compounds the complexity, turning what should be a simple test into a maze of wiring, stubs, and setup code.

Teams usually face these issues:

**Manual mocks are fragile:** backend teams spend an enormous amount of time manually mocking dependencies. These mocks are often **not typed**, which means they break silently during refactors. When a dependency’s interface changes, the issue is then missed at compile time, and the test fails on execution.

**Missing implementations cause cryptic errors:** manually written mocks tend to be incomplete. Developers often miss implementing certain dependency methods, leading to **undefined return values** or **nonsensical test errors**, even when the unit’s logic is perfectly correct. This erodes confidence in the test suite and wastes time debugging the wrong problem.

**Naïve auto-mocking isn’t safe:** some attempt to solve the boilerplate involved with mocking by using automatic mocking, but they are not type-aware. They allow calling non-existent methods, creating **silently broken tests**. This issue is 10x worse with LLM hallucinations. The result is a false sense of coverage and dangerous gaps in verification.

**Too much boilerplate, creating cognitive load and loss of intent:** each engineer ends up writing mocks differently, wiring up dependencies manually, and repeating the same setup logic across hundreds of tests. This boilerplate hides test intention and slows down development. It also introduces inconsistency and cognitive overhead - especially when onboarding new engineers or integrating with AI-assisted coding tools.

**Inconsistent Testing Practices Across Teams:** Different teams often develop their own approaches to testing DI-based applications, leading to inconsistent practices, varied code quality, and challenges when developers switch between projects.

**Steep learning curve for new developers:** New team members often struggle to understand complex testing setups, especially when working with dependency injection frameworks. This learning curve slows down onboarding and can lead to poor testing practices.

**LLMs get confused with noisy context:** manually written test setup is verbose and overloaded with boilerplate - every mock, dependency, and initialization adds lines of code that obscure test intent. This verbosity confuses coding assistants (e.g. Claude Code, Cursor) when they try to read and understand existing tests. Moreover, when these tools attempt to generate tests, the excessive boilerplate makes it harder for them to produce correct and complete setups, leading to inconsistent or invalid code.

**LLMs need clear feedback to self-correct:** even when LLMs successfully generate test code, the feedback loop that follows is often poor. Because manually written mocks frequently produce cryptic or misleading runtime errors (from missing implementations, undefined returns, to silent method mismatches) LLMs can’t interpret what went wrong, leading to infinite loops and burn of tokens.

### How does Suites solve it?

Suites provides an **opinionated, declarative API** for unit testing TypeScript backends that use dependency injection. Instead of writing mocks by hand, you simply wrap your unit with a single function, and Suites automatically builds a correct, type-safe test environment.

**Type-Safe Mocks:** Suites generates **fully typed mocks**, bound to your implementation. This ensures that refactors don’t break tests silently. You can only call existing dependency methods, and every mock interaction is validated at compile time.

**Smart Mock Tracking:** Every mock is aware of which dependency it represents. Suites automatically tracks and verifies mock usage, eliminating false negatives and providing clear error messages when tests fail.

**Declarative API:** By describing your unit’s dependencies declaratively, Suites removes the need for repetitive wiring and setup. Tests become shorter, intention-revealing, and much easier to maintain.

**DI and Test Library Integration:** Suites integrates seamlessly with popular DI frameworks like **NestJS** and **InversifyJS**, and testing libraries such as **Jest**, **Vitest**, and **Sinon** - working out of the box in existing projects.

**AI-Friendly by Design:** Because Suites eliminates boilerplate and enforces type safety, LLMs can now generate **correct unit tests in a single pass**. Suites reduces the amount of context needed to reason about dependencies, allowing AI-assisted tools to understand, modify, and maintain tests accurately.

**Standardized Testing Across Teams**: Suites provides a standardized, opinionated approach to testing that works consistently across different DI frameworks. This creates a unified testing experience for all teams while allowing flexibility in implementation details.

**Intuitive Onboarding and Testing Model**: With its intuitive API and consistent patterns, Suites reduces the learning curve for new developers. The clear separation between solitary and sociable testing approaches provides a straightforward mental model that's easy to grasp.

### In Summary

Suites replaces thousands of lines of brittle, manual test setup with a single, declarative call - giving backend teams confidence in their tests, improving refactor safety, and enabling both developers and AI tools to write and maintain reliable test suites effortlessly.
