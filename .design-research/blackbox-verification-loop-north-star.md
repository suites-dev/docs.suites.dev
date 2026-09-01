# Blackbox Verification Loop North Star

> Internal product reference for evaluating Blackbox features, documentation, demos, and agent workflows.

Blackbox turns product intent into an executable, human-approved verification target. It combines system-test results with runtime evidence to return deterministic findings that keep coding agents repairing the implementation against that target.

## The Loop

```mermaid
flowchart LR
    I[Product intent] --> M{Authoring mode}
    M --> G[Reviewed Gherkin]
    M --> D[Direct behavioral<br/>declarations]
    G --> A{Person approves?}
    D --> A
    A -->|Revise| M
    A -->|Approve| T[Agent builds the system test<br/>and implementation]
    T --> R[Run the system test]
    R --> O[OpenTelemetry<br/>observations]
    R --> C[Assurance control<br/>facts]
    O --> E[Seal eligible<br/>attempt evidence]
    C --> E
    E --> F[Blackbox returns a finding<br/>and one of five verdicts]
    A -. Approved target .-> F
    F -->|Satisfied| V[Verified behavior]
    F -->|Producer routes repair| X[Agent repairs the<br/>implementation]
    F -->|Meaning change| A
    X --> R
```

The person controls what behavior is accepted. The agent may propose behavior, build tests, implement it, and repair failures, but it cannot change the approved target to make a finding pass.

## What Blackbox Adds

- **Feedforward:** Approved Gherkin or direct behavioral declarations guide the agent before it implements the behavior.
- **Runtime verification:** System-test assertions check the visible result. OpenTelemetry observations reveal supported system work, while separate control facts establish evidence eligibility and limits.
- **Deterministic feedback:** The same approved behavior, declared test, analysis rules, and sealed evidence produce the same finding.
- **Verdict-aware repair:** Findings preserve the producer-owned repair owner, permitted actions, and earliest rerun gate. Changes to accepted behavior return to a person for approval.

## Non-Negotiable Boundaries

- Every case attempt, retry, and sequence member receives fresh managed capture.
- Runtime effects are the core evidence used to verify behavior beyond the visible test result. Effects never create requirements.
- Incomplete evidence cannot prove absence, an upper bound, or an exact count.
- Observable Decision Coverage may add insight after effect analysis, but it cannot change an ordinary effect finding.
- A distributed system may behave differently between runs. Determinism applies to analysis of fixed inputs and evidence.

## Product Test

Every addition to Blackbox should strengthen at least one part of this loop: translating intent, approving behavior, realizing a test, capturing evidence, producing findings, or guiding repair. It must not weaken human authority over the verification target.
