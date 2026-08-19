---
title: "Modernize a Legacy System"
description: "Build a reviewed behavior map around a legacy system, then replace components without silently changing critical effects."
sidebar_position: 2
keywords:
  [
    "legacy modernization testing",
    "brownfield system tests",
    "characterization testing",
  ]
---

Legacy modernization is risky when implementation code is the only description of behavior. Blackbox lets you create a small reviewed contract around one working flow before moving components.

## Start at a Business Boundary

Choose a workflow the business already depends on: subscription, invoice generation, account closure, reconciliation, or webhook processing.

Classify the first runtime evidence into:

- Behavior that must survive the migration.
- Incidental behavior that should not be frozen.
- Defective behavior that should be forbidden or fixed first.

Capturing the present is characterization. Accepting selected effects is a human decision.

## Move One Slice at a Time

1. Review one executable flow.
2. Accept its effect contract.
3. Bind requirements when traceability matters.
4. Replace one component, datastore, queue, or service boundary.
5. Record the same flow in the candidate capture cell.
6. Analyze the sealed bundle against the accepted contract.
7. Repair failures or review an intentional contract change.

The contract can remain stable while implementation technology changes. When the desired behavior changes, update it through review instead of accepting migration noise automatically.

## Compare Old and New Systems

When both systems can run, execute the same flow in separate capture cells. Analyze each sealed bundle against the same contract before comparing implementation-specific evidence.

Gherkin can provide a readable behavior inventory. EARS can preserve normative requirements. Use only the artifacts that participate in migration decisions.

## Limits

Blackbox does not discover the whole legacy domain or decide whether historical behavior is correct. It provides runtime facts and deterministic verdicts for the slices you deliberately cover.

## Next Steps

- [Recover One Flow From Existing Tests](/docs/blackbox/guides/recover-behavior-from-existing-tests)
- [Choose How Blackbox Starts Your SUT](/docs/blackbox/guides/set-up-the-testbed)
