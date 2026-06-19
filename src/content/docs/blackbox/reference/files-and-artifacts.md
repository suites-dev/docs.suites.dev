---
title: "Files and Artifacts"
description: "Document files Blackbox reads, writes, modifies, and expects teams to commit or ignore."
sidebar_position: 8
keywords: ["blackbox artifacts", "generated files", "git policy"]
toc_min_heading_level: 2
seo:
  primary_keyword: "blackbox artifacts"
  secondary_keywords: ["generated files", "omcdc report", "effect catalog", "feature files"]
  search_intent: "reference intent from users who need to know which Blackbox files are inputs, outputs, review artifacts, or temporary evidence"
  snippet_angle: "map feature files, effects YAML, spans, V8 coverage, OMC/DC reports, and CI artifacts to their purpose and git policy"
---

## Abstract

This page tells you what lives in the workspace, what gets generated, what is ephemeral, and what is likely worth committing.

## Audience

Developers deciding what to commit, what to ignore, what to archive from CI, and what to review when behavior changes.

## Artifact Families

Blackbox has four artifact families:

1. **Behavior specs:** `.feature` files that make scenarios readable and reviewable.
2. **Effect contracts:** `.effects.yaml` files that declare required and forbidden runtime effects.
3. **Runtime evidence:** spans and V8 coverage captured from a real system-test run.
4. **Reports:** OMC/DC, catalog, shape, HTML, Markdown, JSON, XML, and CI-facing outputs.

The first two are usually reviewed like source. The last two are generated evidence and should be treated according to the workflow you choose.

## Files Blackbox Reads

| File or directory | Purpose | Usually committed? |
| --- | --- | --- |
| `blackbox-testbed.ts` | Points Blackbox at the runnable topology, services, source directories, ports, and artifact directory. | Yes |
| `docker-compose.yml` or equivalent topology config | Starts the SUT and managed dependencies. | Yes |
| `e2e/features/*.feature` | Runtime-backed behavior spec surface. | Yes, if feature artifacts are part of review |
| `e2e/tests/__effects__/*.effects.yaml` | Effect catalog entries for required and forbidden behavior. | Yes |
| System-test files | Drive the workflow that creates evidence. | Yes |
| Service source directories | Used to resolve OMC/DC branch locations and snippets. | Yes, as normal source |

## Files Blackbox Writes

The default artifact directory in the showcase is `.blackbox-coverage/`. Your project may configure a different directory.

| Artifact | What it means | Primary reader | Git policy |
| --- | --- | --- | --- |
| `.blackbox-coverage/omcdc/verdict.json` | Machine-readable OMC/DC propagation report. | Tools, CI, agents | Usually ignored; archive in CI when useful |
| `.blackbox-coverage/omcdc/verdict.md` | Markdown form of the OMC/DC report. | Humans in review or editor | Usually ignored, sometimes attached to PR/CI |
| `.blackbox-coverage/omcdc/verdict.html` | Interactive branch-by-branch OMC/DC report. | Humans debugging coverage | Ignore; publish or attach as CI artifact |
| `.blackbox-coverage/catalog/coverage.json` | Effect catalog coverage summary. | Tools and reviewers | Usually ignored; useful for CI comparison |
| `.blackbox-coverage/shape/coverage.json` | Boundary-shape coverage summary. | Tools and reviewers | Usually ignored; useful for CI comparison |
| `.blackbox-coverage/omcdc.junit.xml` | JUnit XML form when the JUnit reporter is enabled. | CI test report UI | Ignore; CI consumes it |
| `.blackbox-coverage/code-coverage/coverage.json` | Istanbul-compatible coverage data. | Coverage tooling | Ignore; archive when needed |
| `.blackbox-coverage/html/index.html` | Istanbul HTML coverage report. | Humans comparing code coverage | Ignore; publish or attach as CI artifact |
| `.blackbox-coverage/spans/*.json` | Per-test runtime spans collected from SUT debug endpoints. | Diagnostics, replay, agents | Ignore; archive only for debugging |
| `.blackbox-coverage/v8-per-test/*.json` | Per-test V8 coverage captured from SUT processes. | OMC/DC engine, replay | Ignore; archive only for debugging |

## Feature And Effect Files

Feature files and effect files are different artifacts and should not be collapsed into one mental bucket.

Feature files are the readable behavior surface. They explain the workflow in Given/When/Then-style language and are useful for review, product discussion, and stale-spec detection.

Effect files are the executable behavior contract. They declare concrete required and forbidden effects such as Redis reads, Postgres writes, HTTP calls, queue messages, or forbidden deletes/refunds.

You can use either layer independently:

1. Existing system tests can produce runtime evidence before feature files exist.
2. Existing BDD teams can keep feature files and add effect contracts later.
3. Teams focused on CI gates can start with effect files and reports.
4. Teams focused on documentation can start by generating feature artifacts.

## Artifact Routing

Blackbox can write artifacts to files, stdout, or CI-facing surfaces. The key question is not where every byte goes; it is which outputs are durable review artifacts and which are transient plumbing.

1. File output is for durable review and later comparison.
2. Stdout is for quick inspection and scripting.
3. CI output is for gate signals and annotations.
4. The same proof can be routed differently without changing what was proven.

## Reporter And Sink Defaults

By default, Blackbox enables these reporters:

```bash
BLACKBOX_REPORTERS=json,markdown,html,catalog-json,shape-json
```

JUnit is opt-in:

```bash
BLACKBOX_REPORTERS=json,markdown,html,catalog-json,shape-json,junit
```

By default, Blackbox writes files. In GitHub Actions, the default sink expands to files plus GitHub Actions annotations.

```bash
BLACKBOX_SINKS=file
BLACKBOX_SINKS=file,stdout,github-actions
```

The file sink writes artifacts under the configured artifact directory. For backwards compatibility, `BLACKBOX_COVERAGE_OUTPUT` can override the path for `catalog/coverage.json` only.

## Practical Defaults

1. Commit testbed config, scenarios, feature files, and effect catalogs when they are part of the durable workflow.
2. Ignore `.blackbox-coverage/` by default.
3. Archive `.blackbox-coverage/` in CI when a failure needs investigation.
4. Attach `omcdc/verdict.html` and `omcdc/verdict.md` to CI or PRs when reviewers need branch-level context.
5. Treat span and V8 files as diagnostic evidence, not hand-edited source.

## Figure Placeholder

**Caption:** The Blackbox artifact map: feature files and effects as durable behavior surfaces; spans, V8 coverage, and reports as generated runtime evidence.

**Slot:** `<!-- TODO: insert artifact map diagram or interactive file tree here -->`
