---
title: "Files and Artifacts"
description: "Separate reviewed behavioral source, immutable runtime evidence, native artifacts, and derived analysis results."
sidebar_position: 8
keywords: ["Blackbox artifacts", "sealed evidence", "effect contract"]
---

People review and version the behavioral harness. Blackbox generates and seals evidence for each execution.

## Reviewed Source

| Artifact                           | Authority                                     |
| ---------------------------------- | --------------------------------------------- |
| `requirements/**/*.ears`           | Normative product intent                      |
| `e2e/features/<flow>.feature`      | Reviewable scenario projection                |
| `e2e/<flow>.system.test.ts`        | Executable flow and native assertions         |
| `e2e/features/<flow>.effects.yaml` | Required and forbidden effects                |
| `blackbox.config.ts`               | SUT, isolation, evidence, and analysis policy |

## Sealed Run Layout

```text
.blackbox/evidence/<run-id>/
  manifest.json
  config.snapshot.json
  policy.snapshot.json
  contracts/<flow>.effects.yaml
  cells/<cell-id>/
    manifest.json
    events.jsonl
    attempts/<attempt-id>/events.jsonl
  artifacts/sha256/<digest>
  derived/
    effects/<attempt-id>.json
    decisions/<attempt-id>.json
    odc/verdict.json
    odc/verdict.md
  reports/
    summary.json
    junit.xml
```

The manifest records run, cell, worker, flow, attempt, retry, isolation, reset, service, producer, capabilities, artifact references, versions, and integrity findings.

## Content-Addressed Native Artifacts

The artifact store can contain executed JavaScript, source maps, V8 coverage, language-specific coverage, debug metadata, and other exact analyzer inputs.

Runtime paths are discovery hints. SHA-256 digests and recorded byte lengths establish artifact identity across host, container, and CI paths.

## Derived Analysis

Derived effects, decisions, ODC, and reports can be regenerated with:

```bash
pnpm exec blackbox analyze --run <run-id>
```

Do not edit sealed evidence to change a verdict. Change accepted policy through review or record a new execution.

## Retention

- Commit reviewed source files.
- Ignore local evidence during normal development.
- Retain the complete run when CI fails.
- Keep structured analyzer output with the run.
- Preserve the original manifest and content-addressed artifacts.
