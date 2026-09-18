---
draft: true
title: "Report Contracts"
description: "Understand the language-neutral analyzer results and the boundary for Blackbox reporter extensions."
sidebar_position: 9
keywords: ["Blackbox reports", "effect verdict", "ODC report", "reporter SDK"]
---

Blackbox analyzes a sealed evidence bundle offline and produces structured results. Reporters format and deliver those results without changing them.

## Analysis Results

| Result                       | Required behavior                                                           |
| ---------------------------- | --------------------------------------------------------------------------- |
| Bundle integrity             | Reports missing, inconsistent, or unsupported evidence                      |
| Effect verification          | Fails missing requirements, forbidden observations, and contract mismatches |
| Effect coverage              | Reports which accepted clauses were exercised                               |
| Observable decision coverage | Runs by default and remains report-only until explicitly gated              |

Keep these results separate. A green native test does not override an effect failure, and a high ODC score does not prove the effect contract passed.

## Reporter Extensions

Blackbox report adapters produce outputs such as:

- Human-readable summaries.
- HTML reports.
- Machine-readable JSON.
- JUnit.
- CI annotations.

A reporter receives analyzer results. It must not reopen the SUT, reinterpret raw language-specific data, or recalculate the verdict.

## Automation Rules

1. Parse the structured analyzer result, not rendered Markdown or HTML.
2. Preserve the sealed bundle when a gate fails.
3. Identify protocol, sidecar, runner, and capture versions with the report.
4. Treat unsupported or malformed capture as an integrity failure; retain valid unlisted effects as evidence.
5. Read Observable Decision Coverage as a separate Alpha finding.

## See Also

- [Add Verification Gates to CI](/docs/blackbox/guides/reports-and-ci-gates) - Apply reports in a lifecycle.
- [Observable Decision Coverage](/docs/blackbox/concepts/omc-dc-coverage) - Interpret decision-to-effect findings.
