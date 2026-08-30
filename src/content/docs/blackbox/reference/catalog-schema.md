---
title: "Effects Catalog Contract"
description: "Reference the stable responsibilities of the effects catalog while its public authoring syntax and support matrix remain unfrozen."
sidebar_position: 5
keywords:
  [
    "effects catalog",
    "effect intent",
    "OpenTelemetry normalization",
    "effect capability",
    "EffectFact",
  ]
---

The catalog intent `payment-charge-request` names one portable system effect. An eligible HTTP client observation may establish that effect, but its trace ID, span name, and raw attributes do not become the accepted claim.

The **effects catalog** defines shared effect vocabulary and the evidence qualifications behind it. Human-approved claims separately decide which effects are required, forbidden, or count-constrained.

:::info Public Syntax Not Frozen
Effects are the committed core of Blackbox. The catalog authoring format, matcher operators, generated types, and certified capability matrix remain an Alpha target. Examples in the Concepts documentation are illustrative, not a supported YAML schema.
:::

## Keep Catalog Vocabulary Separate From Policy

| Catalog responsibility        | Question it answers                                                    |
| ----------------------------- | ---------------------------------------------------------------------- |
| **Effect intent**             | What portable system behavior does this effect name?                   |
| **Observation qualification** | Which admitted capability and normalized facts may establish it?       |
| **Proof strength**            | Can the evidence establish observed, succeeded, or committed behavior? |
| **Compatibility**             | Which normalizer and capability versions can produce comparable facts? |

The catalog does not decide whether an effect must happen. A separate accepted claim supplies presence, absence, cardinality, or ordering policy.

Observed behavior may inform a catalog or claim proposal. Runtime never adds vocabulary or policy automatically.

## Admit Observations Before Matching

Blackbox processes observations in one direction:

```text
raw observation
  -> admitted capability and provider
  -> versioned normalization
  -> portable effect fact
  -> catalog effect intent
  -> accepted claim evaluation
```

A normalizer uses supported semantic attributes, span kind, instrumentation scope, and schema version. It does not normalize an observation from its display name alone.

Only attributable, eligible evidence enters catalog matching. Foreign, unsupported, unfinished, or unrecognized observations cannot silently become an empty successful match set.

## Preserve a Portable Effect Fact

The Alpha contract requires normalized facts to preserve these semantic groups. This table describes product responsibility, not a public file schema.

| Group                    | Required meaning                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------- |
| **Evidence identity**    | The source evidence and normalization version behind the fact.                      |
| **Execution identity**   | The attempt, evidence window, service instance, and executed realization.           |
| **Capability identity**  | The admitted capability and provider that recognized the operation.                 |
| **Boundary behavior**    | The normalized boundary, operation, target, and supported fields.                   |
| **Runtime relationship** | Timing and trace or span relationships needed for attribution and diagnostics.      |
| **Proof strength**       | Whether the evidence establishes observed, succeeded, or separately committed work. |

Raw OTLP remains immutable evidence input. A versioned normalizer may produce portable effect facts from eligible observations without rewriting the raw capture.

## Require Capability Support

Every claim depends on a declared semantic capability, such as supported HTTP client or SQL client observation. Provider admission establishes the runtime, library, instrumentation, operation, and lifecycle scope that capability covers.

An unavailable capability produces **unsupported**. A participation, identity, loss, or sealing conflict produces an **integrity failure**. Neither becomes an empty satisfied claim.

Current real-OTLP HTTP and PostgreSQL work is prototype evidence. It is not a broad language, framework, library, or protocol support claim. Support must follow the certified Alpha matrix when that matrix is published.

## Freeze the Public Contract Before Publishing Syntax

The public catalog format is ready only when Blackbox freezes and tests:

- Catalog identity, versioning, and compatibility rules.
- Exact matchable fields and matcher operators.
- Effect-intent references from accepted claims.
- Capability and normalizer compatibility requirements.
- Proof-strength declarations and validation.
- Unknown-field and unsupported-operation behavior.
- Deterministic diagnostics and canonical serialization.
- Certified runtime, library, and instrumentation support cells.

Until then, do not treat a prototype YAML shape, TypeScript type, package helper, or fixture schema as public API.

## See Also

- [OpenTelemetry and Effects](/docs/blackbox/concepts/effects-and-catalogs): See the illustrative catalog and observation-to-finding model.
- [Effect Claim Evaluation](/docs/blackbox/reference/matchers-and-effect-builders): Look up cardinality, completeness, and verdict rules.
- [Capture Lifecycle and Correlation](/docs/blackbox/reference/capture-lifecycle-and-correlation): Understand when an observation is eligible for matching.
