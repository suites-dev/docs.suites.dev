---
sidebar_position: 2
title: Distinguishing Between Unit and Integration
---

# Distinguishing Between Unit and Integration Tests in Suites

In the Suites framework, the distinction between unit and integration tests is nuanced:

- **Solitary Unit Tests**: These tests isolate the unit from all of its external interactions using mocks or stubs
  (facilitated by `@suites/unit`). They focus on the unit’s internal logic and are crucial for testing functionality
  independently.

- **Sociable Unit Tests**: These involve testing the unit in the context of its real interactions with other units, but
  without involving I/O operations. Sociable tests are not quite integration tests in traditional terms but test the
  integration of units within the application itself.

- **Integration Tests**: In Suites, integration tests are explicitly designed to test the interactions between
  components and their I/O operations, ensuring that the system works as a whole.

