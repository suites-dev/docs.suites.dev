---
title: "Files and Artifacts"
description: "Reference for Blackbox contracts, specification files, runtime evidence, reports, and recommended Git policy."
sidebar_position: 8
keywords: ["blackbox artifacts", "generated files", "git policy"]
toc_min_heading_level: 2
seo:
  primary_keyword: "blackbox artifacts"
  secondary_keywords:
    ["generated files", "omcdc report", "effect catalog", "feature files"]
  search_intent: "reference intent from users who need to know which Blackbox files are inputs, outputs, review artifacts, or temporary evidence"
  snippet_angle: "map feature files, effects YAML, spans, V8 coverage, OMC/DC reports, and CI artifacts to their purpose and git policy"
---

Blackbox keeps reviewed intent separate from evidence produced by a test run. Commit the files that define behavior. Ignore generated evidence by default, then archive it from CI when a failure needs investigation.

## Artifact Families

Blackbox has four artifact families:

1. **Executable flows:** Playwright tests that drive the system and carry stable flow IDs.
2. **Reviewed intent:** effect catalogs, optional EARS requirements and bindings, and optional generated Gherkin.
3. **Runtime evidence:** spans and runtime-specific coverage payloads captured from the SUT.
4. **Verdicts and reports:** effect coverage, requirement coverage, OMC/DC, and human-readable summaries.

The first two are usually reviewed like source. The last two are generated evidence and should be treated according to the workflow you choose.

## Files Blackbox Reads

| File or directory                                         | Purpose                                                                                        | Usually committed?                   |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------ |
| Project testbed module, such as `e2e/blackbox-testbed.ts` | Describes the runnable topology, managed services, reset policy, and artifact directory.       | Yes                                  |
| `docker-compose.yml` or equivalent topology config        | Starts the SUT and managed dependencies.                                                       | Yes                                  |
| `e2e/tests/__effects__/*.effects.yaml`                    | Effect catalog entries for required and forbidden behavior.                                    | Yes                                  |
| `requirements/**/*.ears`                                  | Optional normative requirements in EARS.                                                       | Yes, when using requirement coverage |
| `e2e/tests/__requirements__/*.req.yaml`                   | Optional bindings from requirement IDs to flow IDs.                                            | Yes, when using requirement coverage |
| `features/*.feature`, or `BLACKBOX_FEATURES_DIR`          | Optional Gherkin projection generated from executable tests. The showcase uses `e2e/features`. | Yes, when it is part of review       |
| Playwright system-test files                              | Drive the workflow and identify the flows that create evidence.                                | Yes                                  |
| Service source directories                                | Used to resolve OMC/DC branch locations and snippets.                                          | Yes, as normal source                |

## Files Blackbox Writes

The default artifact directory in the showcase is `.blackbox-coverage/`. Your project may configure a different directory.

| Artifact                                           | What it means                                                  | Primary reader                  | Git policy                                           |
| -------------------------------------------------- | -------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------- |
| `.blackbox-coverage/catalog/coverage.json`         | Effect catalog coverage summary.                               | Tools and reviewers             | Usually ignored; useful for CI comparison            |
| `.blackbox-coverage/shape/coverage.json`           | Boundary-shape coverage summary.                               | Tools and reviewers             | Usually ignored; useful for CI comparison            |
| `.blackbox-coverage/effects-report.md`             | Human-readable effect and shape coverage summary.              | Reviewers and CI summaries      | Usually ignored; attach to a run or PR               |
| `.blackbox-coverage/effects-report.html`           | Browser view of effect and shape coverage.                     | Developers investigating a run  | Ignore; publish or attach as a CI artifact           |
| `.blackbox-coverage/requirements/coverage.json`    | EARS requirement verdicts produced by `requirements coverage`. | Tools, CI, agents, reviewers    | Usually ignored; archive when requirements gate CI   |
| `.blackbox-coverage/omcdc/verdict.json`            | Machine-readable OMC/DC propagation report.                    | Tools, CI, agents               | Usually ignored; archive in CI when useful           |
| `.blackbox-coverage/omcdc/verdict.md`              | Markdown form of the OMC/DC report.                            | Humans in review or editor      | Usually ignored; attach when branch evidence matters |
| `.blackbox-coverage/omcdc/verdict.html`            | Interactive branch-by-branch OMC/DC report.                    | Humans debugging coverage       | Ignore; publish or attach as a CI artifact           |
| `.blackbox-coverage/omcdc.junit.xml`               | JUnit XML form when the JUnit reporter is enabled.             | CI test report UI               | Ignore; CI consumes it                               |
| `.blackbox-coverage/code-coverage/coverage.json`   | Istanbul-compatible coverage data.                             | Coverage tooling                | Ignore; archive when needed                          |
| `.blackbox-coverage/code-coverage/html/index.html` | Istanbul HTML coverage report.                                 | Humans comparing code coverage  | Ignore; publish or attach as a CI artifact           |
| `.blackbox-coverage/spans/*.spans.json`            | Per-flow runtime spans collected from SUT debug endpoints.     | Diagnostics and replay          | Ignore; archive only for debugging                   |
| `.blackbox-coverage/node/v8/*.json`                | Per-test Node V8 coverage payloads.                            | OMC/DC producer and replay      | Ignore; archive only for debugging                   |
| `.blackbox-coverage/ambient/ambient.json`          | Effects classified as ambient rather than flow-owned.          | Diagnostics and policy tuning   | Ignore; inspect when attribution is unclear          |
| `.blackbox-coverage/image-manifest.json`           | Instrumented testbed image metadata.                           | Reproducibility and diagnostics | Ignore; archive with a failing run                   |

## Feature And Effect Files

Feature files, EARS requirements, and effect files are different artifacts and should not be collapsed into one mental bucket.

Feature files are an optional readable behavior projection. They explain the workflow in Given/When/Then language and are useful for review and test-to-feature drift detection.

EARS files are optional normative requirements. Binding sidecars connect their IDs to executable flow IDs; requirement coverage then joins those bindings to effect coverage.

Effect files are the executable behavior contract. They declare concrete required and forbidden effects such as Redis reads, Postgres writes, HTTP calls, queue messages, or forbidden deletes/refunds.

You can use either layer independently:

1. Existing system tests can produce runtime evidence before feature files exist.
2. Teams can add EARS requirements and flow bindings after effect verification works.
3. Teams can generate Gherkin from executable tests without adopting EARS.
4. EARS and Gherkin can be used together because they answer different questions.

## Artifact Routing

Blackbox can write artifacts to files, stdout, or CI-facing surfaces. The key question is not where every byte goes; it is which outputs are durable review artifacts and which are transient plumbing.

1. File output is for durable review and later comparison.
2. Stdout is for quick inspection and scripting.
3. CI output is for gate signals and annotations.
4. The same proof can be routed differently without changing what was proven.

## Reporter And Sink Defaults

Coverage modules write their JSON and OMC/DC artifacts independently of presentation reporters. The default presentation reporter writes `effects-report.md` and `effects-report.html`:

```bash
BLACKBOX_REPORTERS=effects-report
```

JUnit is opt-in:

```bash
BLACKBOX_REPORTERS=effects-report,junit
```

By default, Blackbox writes files. In GitHub Actions, the default sink expands to files plus GitHub Actions annotations.

```bash
BLACKBOX_SINKS=file
BLACKBOX_SINKS=file,stdout,github-actions
```

The file sink writes artifacts under the configured artifact directory. For backwards compatibility, `BLACKBOX_COVERAGE_OUTPUT` can override the path for `catalog/coverage.json` only.

## Practical Defaults

1. Commit the testbed config, Playwright flows, and effect catalogs.
2. Commit EARS, requirement bindings, and generated Gherkin only when those layers are part of the workflow.
3. Ignore `.blackbox-coverage/` by default.
4. Archive `.blackbox-coverage/` in CI when a failure needs investigation.
5. Treat spans and runtime coverage payloads as diagnostic evidence, not hand-edited source.
