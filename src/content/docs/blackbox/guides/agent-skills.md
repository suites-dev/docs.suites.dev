---
title: "Repair a Blackbox Finding With a Coding Agent"
description: "Give a coding agent one violated finding and verify the repair without changing the behavioral contract."
sidebar_position: 6
keywords: ["Blackbox agent skills", "coding agents", "behavioral verification"]
---

Use this guide after a person has approved a behavioral contract and the project can run its system or E2E test locally. The coding agent repairs the implementation, while the contract remains under human approval.

For the responsibility split behind this workflow, read [Human-Agent Verification Loop](/docs/blackbox/concepts/human-agent-verification-loop).

## 1. Give the Agent One Finding

Name the contract case, the violated finding, the implementation area, and the verification steps that are in scope.

```text title="Example agent task"
Repair checkout-completion.

The system test returned 201, but Blackbox observed two POST requests
to /payments/charges. The behavioral contract allows at most one.

Keep the behavioral contract unchanged. Repair the implementation,
run a fresh attempt, and report both the test result and finding.
```

If the agent concludes that the behavioral contract must change, stop the repair and return that proposal to a person.

## 2. Validate Before Running

Validate the behavioral contract and its system-test binding before allocating a runtime attempt.

```text title="Conceptual pseudocode"
<validate behavioral contract>
<validate system-test binding>
```

Use the commands published for the installed Blackbox distribution. The placeholders above are not CLI syntax.

## 3. Run the Same Contract Case

Run the selected case through the project's declared Blackbox entrypoint. Keep the native test result and Blackbox finding separate.

```text
System test       passed: checkout returned 201
Blackbox finding  violated: payment charge requests, maximum 1, observed 2
```

## 4. Route the Result

- Let the agent repair implementation or test realization work it owns.
- Return any proposed behavioral-contract change to a person.
- Stop on unsupported capabilities instead of weakening the contract.
- Repair incomplete capture at the boundary that owns it.

## 5. Verify With Fresh Evidence

Run a fresh attempt after the repair. Confirm that the behavioral contract did not change, the native test result is present, and every selected effect claim has a finding.

The repair is complete when fresh evidence satisfies the same behavioral contract. Keep earlier attempts so the finding that caused the repair remains reviewable.

## Next Steps

- [Human-Agent Verification Loop](/docs/blackbox/concepts/human-agent-verification-loop)
- [Add Blackbox to CI](/docs/blackbox/guides/reports-and-ci-gates)
- [CLI and Exit Behavior](/docs/blackbox/reference/cli)
