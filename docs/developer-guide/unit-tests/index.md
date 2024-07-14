---
sidebar_position: 1
title: Unit Testing
toc_min_heading_level: 3
---

# Unit Testing

## Introduction

This section is dedicated to exploring the core concepts and practices of unit testing with Suites.
Unit testing is a fundamental practice in software development, ensuring that individual components of your application
work as intended. Suites provides powerful tools and abstractions to streamline the creation and management of unit
tests, let's dive in and explore them.

## Unit Tests in The Context of Suites

Unit testing can take on different meanings depending on the programming paradigm. In object-oriented design, a "unit"
typically refers to a single class. In procedural or functional programming, it might refer to a single function.
**Within the context of Suites, we consider the smallest unit to be a class.**

Suites distinguishes between two types of unit testing: "solitary" and "sociable" unit tests:

- **Solitary Unit Tests**: Focus on testing a single class in complete isolation by mocking all its dependencies.

- **Sociable Unit Tests**: Test a class along with its real dependencies, simulating a more integrated environment
  without involving I/O operations.

## In this section
- [Fundamentals of Unit Testing](/docs/developer-guide/unit-tests/fundamentals)
- [Test Doubles (Mocks and Stubs)](/docs/developer-guide/unit-tests/test-doubles)
- [The Solitary Unit Testing Approach](/docs/developer-guide/unit-tests/solitary)
- [The Sociable Unit Testing Approach](/docs/developer-guide/unit-tests/sociable)


