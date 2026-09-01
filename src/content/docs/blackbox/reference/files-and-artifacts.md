---
draft: true
title: "Files and Artifacts"
description: "Distinguish reviewed behavioral source, generated alignment contracts, sealed runtime evidence, and derived findings."
sidebar_position: 8
keywords: ["Blackbox artifacts", "sealed evidence", "generated contracts"]
---

One verified case moves through four artifact classes. A person reviews the intent, Blackbox generates alignment contracts, Runtime seals what happened, and the Analyzer derives findings.

:::info Public Layout Not Frozen
This page defines artifact ownership for the Alpha target. Exact filenames, directories, schemas, retention commands, and report fields are not committed here.
:::

## Keep Artifact Classes Separate

| Artifact class                    | Owner                       | Purpose                                                                 |
| --------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| **Reviewed behavioral source**    | Person                      | Approved Gherkin, effect claims, and analysis policy.                   |
| **Generated alignment contracts** | Compiler and runner adapter | Bind accepted meaning to typed executable realization.                  |
| **Sealed runtime evidence**       | Runtime                     | Preserve one attempt's observations, lifecycle, identities, and limits. |
| **Derived findings and reports**  | Analyzer and renderer       | Evaluate claims and present the result without mutating evidence.       |

An artifact from a later class cannot redefine an earlier one. Runtime observations do not rewrite Gherkin or claims, and a report does not rewrite sealed evidence.

## Review and Version the Behavioral Source

Keep these project-owned inputs under review:

- Approved Gherkin and its stable case identities.
- Project-owned system or E2E suite.
- Reviewed effects-catalog vocabulary and effect claims.
- SUT, isolation, capture, and analysis policy.

The public catalog authoring syntax is not frozen. Do not standardize a prototype YAML filename or shape as the Alpha contract.

## Regenerate Alignment Contracts

Generated alignment artifacts may include a type contract, runtime registration, and plan projection. They guide the project-owned suite and preserve its relationship to the accepted plan. The runner adapter separately owns the concrete realization.

Regenerate them from their canonical inputs. Do not hand-edit generated output into a second source of meaning.

## Seal Runtime Evidence Per Attempt

Sealed evidence preserves or references:

- Exact plan and realization identity.
- Case, assignment, attempt, retry, and evidence-window identity.
- Participating services, capabilities, and executed artifacts.
- Raw observations and normalized effects.
- Completion, settling, loss, closeout, and integrity facts.

Retries and sequence members retain separate evidence. Sealing makes the attempt immutable; it does not make incomplete evidence complete.

## Derive Analysis Without Rewriting Evidence

Effect findings, integrity findings, optional ODC results, and rendered reports are derived from the exact accepted inputs and sealed evidence.

Reanalysis may reproduce a result when those inputs remain identical. An implementation or alignment repair requires a fresh runtime execution.

## Retain the Verification Chain

- Commit reviewed behavioral source according to project policy.
- Keep generated alignment contracts reproducible from accepted inputs.
- Retain the complete sealed attempt when a CI finding needs investigation.
- Preserve artifact identities and integrity facts with any derived report.
- Never edit sealed evidence to obtain a different verdict.

## See Also

- [Plans and Realizations](/docs/blackbox/reference/plans-and-realizations)
- [Capture Lifecycle and Correlation](/docs/blackbox/reference/capture-lifecycle-and-correlation)
- [Effects Catalog Contract](/docs/blackbox/reference/catalog-schema)
