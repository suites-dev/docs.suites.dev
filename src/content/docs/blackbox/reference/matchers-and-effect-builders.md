---
title: "Effect Verification Model"
description: "Reference the language-neutral rules for required, forbidden, unlisted, and mismatched runtime effects."
sidebar_position: 4
keywords:
  [
    "effect verification",
    "required effects",
    "forbidden effects",
    "effect matching",
  ]
---

Effect verification compares normalized observations from a sealed evidence bundle with a human-approved effect contract.

## Contract Outcomes

| Outcome                    | Verdict        | Meaning                                                |
| -------------------------- | -------------- | ------------------------------------------------------ |
| Required effect matched    | Pass           | The accepted effect occurred                           |
| Required effect missing    | Fail           | The accepted effect did not occur                      |
| Forbidden effect absent    | Pass           | The rejected behavior stayed absent                    |
| Forbidden effect observed  | Fail           | The system performed rejected behavior                 |
| Valid observation unlisted | No finding     | Evidence remains available without constraining policy |
| Observation unsupported    | Integrity fail | Capture cannot normalize the observation soundly       |
| Contract mismatch          | Fail           | Evidence and contract cannot be compared as declared   |
| Evidence incomplete        | Fail           | Bundle integrity cannot support the requested verdict  |

Unlisted normalized effects remain evidence. Unsupported capture and contract mismatches fail because the analyzer must not turn uncertainty into success.

## Language-Neutral Shape

An effect contract describes boundary behavior with normalized fields:

```yaml
requires:
  - { boundary: postgres, op: INSERT, key: subscriptions, service: bff }
forbids:
  - { boundary: http, op: POST, key: /v1/refunds, service: bff }
```

Runner adapters do not define this vocabulary. Language capture implementations translate supported observations into the canonical evidence model. Helpers from `@suites/blackbox/effects` compile to the same contract semantics.

## Counts and Patterns

Contracts can constrain effect values and occurrence counts. The accepted YAML schema remains the behavioral authority; convenience builders must compile to the same semantics.

See [Effect Contract Schema](/docs/blackbox/reference/catalog-schema) for the reviewed source format.

## Analysis Boundary

The offline analyzer owns matching and verdict computation. A reporter can display the result, and a runner adapter can surface it, but neither may reinterpret the evidence.

## Summary

- **Contracts define required and forbidden behavior.**
- **Capture implementations produce canonical observations.**
- **Offline analysis computes the verdict.**
- **Unsupported, mismatched, and incomplete evidence fails integrity or verification.**
- **Valid unlisted effects remain evidence without becoming requirements.**
