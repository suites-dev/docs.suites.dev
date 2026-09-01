---
title: "Use Blackbox With Coding Agents"
description: "Use Blackbox Skills to propose behavior, realize tests, route deterministic findings, and preserve human approval."
sidebar_position: 4
keywords: ["Blackbox agent skills", "coding agents", "behavioral verification"]
---

Blackbox Skills guide coding agents through the verification loop. They can propose and repair work, but deterministic producers and people retain authority over product truth.

## Give the Agent Bounded Work

Tell the agent which product requirement, case, files, and verification gates are in scope. Keep the input checkpoint immutable while the agent works.

The agent may:

- Propose Gherkin or direct behavioral declarations.
- Complete generated Playwright bindings.
- Implement or repair application behavior.
- Run the required validation and execution gates.
- Present findings and route the next permitted action.

The agent may not approve its own proposed behavior, infer requirements from effects, rewrite producer findings, or choose a weaker rerun gate.

## Preserve the Verification Direction

```text
person-approved behavior
        ↓ feedforward
coding agent realizes the test and implementation
        ↓
Blackbox captures and analyzes one fresh attempt
        ↓ deterministic feedback
coding agent repairs, or person reviews a meaning change
```

## Run Deterministic Gates

Use the canonical validation sequence where applicable:

```bash
blackbox features check
blackbox scenarios check
blackbox suites typecheck
```

Each producer owns its capability status, finding, verdict, repair owner, permitted actions, and earliest required rerun gate. The Skill preserves and routes those fields.

## Route Failures Correctly

| Failure belongs to            | Agent action                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| Authored or semantic input    | Propose a correction and return protected meaning to a person when approval is required |
| Playwright realization        | Repair bindings or test implementation, then rerun the owning validation gate           |
| Application behavior          | Repair implementation and perform a fresh runtime execution                             |
| Capture or evidence integrity | Repair the owning runtime boundary and perform a fresh execution                        |
| Unsupported capability        | Stop and report the exact unsupported cell                                              |

Report-only reanalysis is valid only when the producer says it is the earliest required gate. It cannot certify an application or capture repair.

## Keep History

Preserve rejected proposals, previous findings, earlier attempts, and human decisions. A new passing attempt does not erase the evidence that caused the repair.

## Next Steps

- [Human Authority and the Agent Loop](/docs/blackbox/concepts/human-agent-verification-loop)
- [Add Blackbox to CI](/docs/blackbox/guides/reports-and-ci-gates)
