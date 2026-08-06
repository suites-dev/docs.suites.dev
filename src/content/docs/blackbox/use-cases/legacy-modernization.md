---
title: "Legacy Modernization"
description: "Build a reviewed behavior map around a legacy system, then modernize components without silently changing critical boundary effects."
sidebar_position: 2
keywords:
  [
    "legacy modernization testing",
    "legacy refactor",
    "brownfield system tests",
    "characterization testing",
  ]
---

Legacy modernization is risky when the implementation is the only reliable description of behavior. Blackbox can turn selected running behavior into a smaller, reviewed contract before components move.

## Start With a Boundary, Not the Codebase

Choose a workflow the business already depends on: subscription, invoice generation, account closure, reconciliation, or webhook processing.

The first run records what the system currently does at supported boundaries. Review that recording into three sets:

- behavior that must survive the migration;
- behavior that is incidental and should not be frozen;
- behavior that is wrong and should become forbidden or be fixed before baselining.

Capturing the present is characterization. Approving selected effects is contract work. Keep those steps separate.

## Incremental Migration Loop

1. Drive the legacy path through one Playwright flow.
2. Review its effect catalog.
3. Bind existing requirements to the flow when traceability matters.
4. Replace one component, datastore, queue, or service boundary.
5. Run the same flow against the candidate topology.
6. Repair missing or forbidden behavior.
7. Ratify an intentional catalog change before moving to the next slice.

The catalog can remain stable even when implementation technology changes. If a Postgres write intentionally becomes a queue publication, the contract should change through review rather than being silently accepted as migration noise.

## Parallel Old/New Comparison

When both systems can run, execute the same flow against each controlled topology and compare the behavior that should remain equivalent. Blackbox's experimental observation comparison can help during a test reshape or migration, but the effect catalog remains the stable reviewed contract.

Generated Gherkin can provide a readable inventory for domain reviewers. EARS can retain normative requirements. Neither should be generated and ignored; use only artifacts that participate in migration decisions.

## Limits

Blackbox does not discover the whole legacy domain, make an unsupported runtime observable, or decide whether historical behavior is correct. It gives the team runtime facts and a gate for the slices they deliberately cover.

Start with [Covering Before Refactor](/docs/blackbox/use-cases/covering-before-refactor), then use [Testbed and Instrumentation](/docs/blackbox/guides/set-up-the-testbed) to build the controlled topology.
