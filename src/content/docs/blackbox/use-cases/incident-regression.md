---
title: "Incident Regression"
description: "Turn a known incident into a Playwright flow with required and forbidden runtime effects that fail if the behavior returns."
sidebar_position: 3
keywords:
  [
    "incident regression test",
    "postmortem testing",
    "forbidden effects",
    "behavioral regression",
  ]
---

An incident regression test should preserve the behavioral distinction that made the incident harmful, not only the response that happened to accompany it.

## Example: Rejected User Was Charged

Suppose the API returned `404` for an unknown user, but a payment request was already sent and an order message was published. A response-only regression test can pass while the incident returns.

Create a named flow and keep the response assertion:

```ts
test.system("subscribe-unknown-user", "rejecting an unknown subscriber", () => {
  test("stops before downstream work", async ({ capture, request, system }) => {
    const response = await request.post(
      `${system.bff.hostBaseUrl}/subscriptions`,
      {
        data: { userId: "ghost-user", paymentMethodId: "pm_card_visa" },
      },
    );

    expect(response.status()).toBe(404);
    await expect(capture).toMatchCatalog();
  });
});
```

Ratify the incident boundary in the catalog:

```yaml
subscribe-unknown-user:
  requires:
    - { boundary: postgres, op: SELECT, key: users, service: bff }
  forbids:
    - { boundary: http, op: POST, key: /v1/payment_intents, service: bff }
    - { boundary: postgres, op: INSERT, service: bff }
    - { boundary: sqs, op: SendMessage, key: subscription-orders }
```

The regression now fails if payment, persistence, or publication returns, even when the API response remains `404`.

## Post-Incident Workflow

1. Reproduce the narrow flow in a controlled testbed.
2. Identify the required and forbidden effects that distinguish fixed from broken behavior.
3. Review the catalog with the incident owner.
4. Add an EARS requirement when the rule should remain normative and traceable.
5. Run the flow in CI with catalog baselining disabled.
6. Retain the failing runtime artifacts when the gate trips.

Blackbox does not replace monitoring, incident management, or root-cause analysis. It turns one selected failure mode into a recurring pre-merge behavior check.

See [Effects, Catalogs, and Coverage](/docs/blackbox/concepts/effects-and-catalogs) and [Reports and CI Gates](/docs/blackbox/guides/reports-and-ci-gates).
