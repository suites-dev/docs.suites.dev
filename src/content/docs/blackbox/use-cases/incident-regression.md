---
title: "Prevent an Incident Regression"
description: "Turn the behavioral cause of an incident into required and forbidden effects that fail when it returns."
sidebar_position: 3
keywords:
  ["incident regression test", "postmortem testing", "forbidden effects"]
---

An incident regression should preserve the behavioral distinction that made the incident harmful, not only the response that accompanied it.

## Example: A Rejected User Was Charged

Suppose the API returned `404` for an unknown user, but the system had already requested payment and published an order. A response assertion can pass while the incident returns.

Keep the `404` assertion and review this effect contract:

```yaml
specVersion: "0.1"
flow: subscribe-unknown-user
requires:
  - { boundary: postgres, op: SELECT, key: users, service: bff }
forbids:
  - { boundary: http, op: POST, key: /v1/payment_intents, service: bff }
  - { boundary: postgres, op: INSERT, key: subscriptions, service: bff }
  - { boundary: sqs, op: SendMessage, key: subscription-orders }
```

The native test protects the visible response. Runtime analysis protects the absence of payment, persistence, and publication.

## Post-Incident Workflow

1. Reproduce the narrow flow in a controlled capture cell.
2. Identify the effects that distinguish fixed from broken behavior.
3. Review the contract with the incident owner.
4. Add an EARS requirement when the rule needs normative traceability.
5. Seal and retain evidence when the CI gate fails.
6. Return deterministic findings to the coding agent without changing the contract.

Blackbox does not replace monitoring, incident management, or root-cause analysis. It turns one selected failure mode into a recurring pre-merge behavior check.

## Next Steps

- [Effects and Contracts](/docs/blackbox/concepts/effects-and-catalogs)
- [Add Verification Gates to CI](/docs/blackbox/guides/reports-and-ci-gates)
