---
title: "Unit, Integration, System, and E2E Testing"
description: "Compare unit, integration, system, end-to-end, black-box, and white-box testing, and show where Suites Unit and Suites Blackbox fit."
sidebar_position: 2
keywords: ["unit testing vs integration testing", "blackbox vs whitebox testing", "system testing", "e2e testing", "testing pyramid"]
toc_min_heading_level: 2
seo:
  primary_keyword: "unit testing vs integration testing"
  secondary_keywords: ["blackbox vs whitebox testing", "what is system testing", "what is e2e testing", "testing pyramid"]
  search_intent: "comparison and education for teams choosing the right test layer"
  snippet_angle: "explain each test layer, then show where Suites Unit and Suites Blackbox fit"
---

## Abstract

Blackbox is named after black-box testing, but the product is more specific: Suites Blackbox helps teams prove system and end-to-end behavior from runtime evidence. Suites Unit works closer to the code, at the unit and integration layers. The two tools answer different confidence questions and should be used together when the risk profile justifies it.

This page defines the testing layers the Blackbox docs use, including the difference between managed and unmanaged dependencies.

## Audience

Developers, engineering leads, and agent-workflow builders who need a clear map of where unit, integration, system, end-to-end, black-box, and white-box testing belong.

## The Short Answer

Unit tests verify small pieces of code. Integration tests verify several code pieces working together. System tests verify a composed system with dependencies the team controls. E2E tests verify a full journey in an environment closer to production, often involving remote or unmanaged dependencies.

Suites Unit helps at the unit and integration layers. Suites Blackbox helps at the system and E2E layers by observing runtime behavior from the outside.

## The Testing Layers

| Layer | What it verifies | Typical dependencies | Where Suites fits |
| --- | --- | --- | --- |
| Unit test | One function, class, provider, or module | Mostly mocked, faked, or in-memory | Suites Unit |
| Integration test | Several code units or providers working together | Controlled collaborators, in-process wiring, fakes, or test containers | Suites Unit and ordinary test runners |
| System test | A composed application or service topology | Managed dependencies such as database, queue, cache, local services, Docker Compose, or Testcontainers | Suites Blackbox |
| E2E test | A full user or business journey through a deployed or production-like environment | Often includes remote services, auth, email, payment sandboxes, third-party APIs, or shared environments | Suites Blackbox can observe the run |
| Black-box test | Behavior observed from the outside | Depends on the chosen layer | Suites Blackbox when the layer is system or E2E |
| White-box test | Behavior checked with knowledge of internals | Source code, branches, classes, modules, and implementation paths | Suites Unit and code coverage tools |

Teams use these names differently. In the Blackbox docs, the distinction is about scope, control, and what kind of proof the test produces.

## Managed And Unmanaged Dependencies

A **managed dependency** is something the team controls during the test run. Examples include a local database, queue, cache, containerized service, fake mail server, OpenTelemetry collector, or Docker Compose dependency created for the test.

An **unmanaged dependency** is something outside the test's direct control. Examples include a real auth provider, real email delivery, SMS, payment processors, vendor APIs, production-like shared environments, or remote infrastructure owned by another team.

This distinction matters because repeatability changes the meaning of the result:

1. System tests usually include managed dependencies and replace, stub, sandbox, or omit unmanaged dependencies.
2. E2E tests more often involve unmanaged dependencies or remote environments.
3. System tests usually make stronger CI gates because the environment is controlled.
4. E2E tests usually give stronger journey realism, but with more latency, flakiness, and external variance.

Blackbox can collect runtime evidence from both system tests and E2E tests. The evidence is still useful, but teams should interpret failures differently depending on how much of the environment they control.

## Unit Testing Vs Integration Testing

A unit test keeps the scope small. It checks a class, function, provider, or module with most collaborators replaced by test doubles. The value is speed, locality, and fast feedback when an implementation changes.

An integration test checks several pieces working together. In a TypeScript backend, that might mean a provider graph, a service and repository, a controller and service, or a small module boundary. Some dependencies may still be mocked, but the test is no longer only about one isolated unit.

Suites Unit is strongest in this part of the stack. It helps teams create solitary and sociable unit tests around TypeScript classes, providers, and dependency graphs without turning every test into manual mocking work. For the deeper unit-testing model, see [Unit Testing Fundamentals](/docs/guides/fundamentals) and [Why Suites](/docs/get-started/why-suites).

## System Testing Vs E2E Testing

A system test runs the composed system under controlled conditions. It may start the API, worker, database, queue, cache, local service dependencies, and telemetry collector. The goal is to prove behavior across real boundaries while keeping the test environment repeatable.

An end-to-end test runs a complete journey through something closer to the real deployment path. It may use a remote environment, real login flow, sandbox email inbox, payment sandbox, third-party API, feature flag service, or other unmanaged dependency.

Suites Blackbox belongs here. It observes a real run, captures runtime evidence, turns that evidence into effects, and reports what behavior was proven, missing, forbidden, or newly observed.

## Black-Box Vs White-Box Testing

White-box testing uses knowledge of the implementation. A test might care about a class method, branch, provider graph, or internal module boundary. This is useful for fast diagnosis and local refactor safety.

Black-box testing observes behavior from the outside. A test cares that a user was created, an event was published, an email effect was emitted, a database row changed, or a downstream call happened. It should not need to know which private method caused the behavior.

Suites Blackbox is a black-box system and E2E testing tool. It is not just a generic definition of black-box testing. It gives teams a concrete way to collect runtime evidence, build effect coverage, and use the result as a behavioral verification gate.

## How The Pyramid Shifts In The AI Era

The testing pyramid still matters. Fast unit and integration tests should remain the cheapest feedback layer. AI coding agents do not remove that need.

What changes is the cost of producing code and the risk of accepting behavior too early. Agents can generate more code faster, specs can drift faster, and a green unit suite can still miss system behavior at the boundary. The top of the pyramid needs a stronger proof layer.

Blackbox does not flip the pyramid. It adds a clearer system and E2E verification layer:

1. Use unit tests to catch local behavior quickly.
2. Use integration tests to catch collaborator and provider wiring issues.
3. Use system tests to prove behavior across controlled runtime boundaries.
4. Use E2E tests when the full journey and unmanaged dependencies matter.
5. Use Blackbox evidence to decide whether the observed runtime effects match the intended behavior.

For AI-assisted development, this gives agents and reviewers an external stop condition: the implementation is not done because the diff looks plausible. It is done when the required runtime effects were observed and forbidden effects were absent.

## FAQ

### Is Blackbox only another name for black-box testing?

No. The name comes from black-box testing, but Suites Blackbox is specifically about system and E2E runtime evidence, effects, and coverage artifacts.

### Should every team write E2E tests for everything?

No. E2E tests are useful for critical journeys, but system tests are usually easier to control and gate in CI.

### Where do Suites Unit and Suites Blackbox meet?

Suites Unit catches local behavior and integration slices closer to code. Suites Blackbox catches composed system behavior at runtime boundaries.

## What To Read Next

1. [System Effects](/docs/blackbox/concepts/system-effects)
2. [Runtime Evidence](/docs/blackbox/concepts/system-tests-and-runtime-evidence)
3. [OMC/DC Coverage](/docs/blackbox/concepts/omc-dc-coverage)
4. [Writing Scenarios](/docs/blackbox/guides/writing-scenarios)

## Figure Placeholder

**Caption:** The testing pyramid with Suites Unit at the unit/integration layers and Suites Blackbox at the system/E2E boundary.

**Slot:** `<!-- TODO: insert testing pyramid comparison diagram here -->`
