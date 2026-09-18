---
draft: true
title: "Empty or Incomplete Capture"
description: "Diagnose an attempt that produced no eligible evidence or cannot support a completeness-dependent finding."
sidebar_position: 1
keywords:
  ["empty Blackbox evidence", "capture integrity", "missing runtime effects"]
---

An empty effect set does not prove that the system did nothing. It means Blackbox has no eligible matching evidence for the requested claim.

## Check the Lifecycle in Order

1. Confirm the selected case, realization, assignment, and physical attempt agree.
2. Confirm required participants and capture capabilities were admitted before relevant work began.
3. Confirm the fresh evidence window opened for this attempt.
4. Confirm supported correlation reached every service that performed relevant work.
5. Confirm application completion and admitted in-flight work settled.
6. Confirm ended observations drained before receiver closeout and sealing.
7. Check for loss, rejection, late evidence, or an unsupported capability.

Do not skip to effect matching. A lifecycle or identity failure limits what the Analyzer may conclude from the observations it received.

## Match the Symptom to the Boundary

| Symptom                                        | Likely boundary                                              |
| ---------------------------------------------- | ------------------------------------------------------------ |
| No observation belongs to the attempt          | Selection, assignment, or correlation identity.              |
| Expected service never participates            | Admission, topology, or service startup.                     |
| Parent work appears but detached work does not | Explicit asynchronous correlation or application completion. |
| Ended work is missing at closeout              | Drain, export, receiver intake, or recorded loss.            |
| Observations exist but cannot become effects   | Capability admission or normalization support.               |
| Zero matches with incomplete capture           | Completeness proof burden, not confirmed absence.            |

Timing overlap, matching titles, and a shared OpenTelemetry trace ID do not establish attempt ownership by themselves.

## Read the Result Correctly

- **Inconclusive** means execution occurred but evidence cannot support the requested completeness-dependent conclusion.
- **Unsupported** means the required capability or claim kind is outside the declared support cell.
- **Integrity failure** means identity, participation, lifecycle, loss, or sealing invariants failed.

None of these results passes an absence, upper-bound, or exact-count requirement.

## Preserve the Diagnostic Chain

Collect:

- Approved case and selected realization identity.
- Assignment, attempt, retry, sequence-member, and evidence-window identity.
- Participating services and admitted capabilities.
- Application-completion, settling, drain, loss, closeout, and seal facts.
- Raw observations, normalized effects, and the resulting integrity and claim findings.

## See Also

- [Capture Lifecycle and Correlation](/docs/blackbox/reference/capture-lifecycle-and-correlation)
- [Runtime Evidence Boundaries](/docs/blackbox/concepts/runtime-evidence)
- [Effect Claim Evaluation](/docs/blackbox/reference/matchers-and-effect-builders)
