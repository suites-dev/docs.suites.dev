---
title: "Prevent an Incident Regression"
description: "Turn the behavioral cause of an incident into approved system effects that fail when it returns."
sidebar_position: 3
keywords:
  ["incident regression test", "postmortem testing", "forbidden effects"]
---

An incident regression should preserve the behavioral distinction that made the incident harmful, not only the visible response that accompanied it.

## Example: A Rejected User Was Charged

Suppose the API returned `404` for an unknown user, but the system had already requested payment and published an order.

```gherkin
Scenario: Reject an unknown user without creating downstream work
  When an unknown user submits a subscription request
  Then the response status is 404
  And no payment charge is requested
  And no subscription record is written
  And no subscription order is published
```

The Gherkin expresses the approved incident boundary. Catalog-backed claims give each hidden effect a deterministic proof burden:

| Effect intent                  | Accepted claim |
| ------------------------------ | -------------- |
| `payment-charge-request`       | Exactly zero.  |
| `subscription-record-written`  | Exactly zero.  |
| `subscription-order-published` | Exactly zero.  |

The native test protects the visible `404`. Runtime analysis protects the absence of payment, persistence, and publication within the complete declared evidence scope.

## Preserve the Incident Boundary

1. Reproduce the narrow case in a fresh managed-capture attempt.
2. Identify the effects that distinguish fixed from broken behavior.
3. Review the Gherkin, catalog vocabulary, and claims with the incident owner.
4. Bind the accepted case to its executable system realization.
5. Run with fresh capture and retain the sealed attempt when the finding fails.
6. Return deterministic findings to the coding agent without changing the target.

One observed forbidden effect establishes a violation. A satisfied absence claim additionally requires complete eligible evidence.

Blackbox does not replace monitoring, incident management, or root-cause analysis. It turns one selected failure mode into a recurring pre-merge behavior check.

## Next Steps

- [OpenTelemetry and Effects](/docs/blackbox/concepts/effects-and-catalogs)
- [Effect Claim Evaluation](/docs/blackbox/reference/matchers-and-effect-builders)
- [Add Blackbox to CI](/docs/blackbox/guides/reports-and-ci-gates)
