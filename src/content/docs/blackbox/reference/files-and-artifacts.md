---
title: "Files and Artifacts"
description: "Reference for Blackbox requirements, feature files, effect contracts, runtime evidence, reports, and recommended Git policy."
sidebar_position: 8
keywords: ["blackbox artifacts", "generated files", "git policy"]
toc_min_heading_level: 2
seo:
  primary_keyword: "blackbox artifacts"
  secondary_keywords:
    [
      "generated files",
      "observable decision report",
      "effect contract",
      "feature files",
    ]
  search_intent: "reference intent from users who need to know which Blackbox files are inputs, outputs, review artifacts, or temporary evidence"
  snippet_angle: "map EARS, feature files, effect YAML, spans, coverage reports, observable decision reports, and CI artifacts to their purpose and git policy"
---

Blackbox keeps accepted behavior separate from evidence produced by a test run. Commit the files that define behavior. Ignore generated evidence by default, then archive it from CI when a failure needs investigation.

## Artifact Families

Blackbox has four artifact families:

1. **Intent artifacts:** EARS requirements and Gherkin feature files.
2. **Executable flows:** Playwright tests with stable `@flow:<id>` tags.
3. **Effect contracts:** `features/<flow>.effects.yaml` files with required and forbidden effects.
4. **Runtime evidence and reports:** `.blackbox-coverage/` spans, coverage, verdicts, and summaries.

The first three are usually reviewed like source. The last family is generated evidence.

## Files Blackbox Reads

| File or directory                                         | Purpose                                                                                  | Usually committed?              |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------- |
| `requirements/**/*.ears`                                  | Reviewed EARS requirement sources.                                                       | Yes, when using requirements.   |
| `features/**/*.feature`                                   | Reviewed Gherkin scenarios with `@flow` and `@requirement` tags.                         | Yes, when using Gherkin.        |
| `features/<flow>.effects.yaml`                            | Required and forbidden effects for one flow.                                             | Yes.                            |
| `playwright.config.*`                                     | Playwright scheduling, projects, reporters, and test selection.                          | Yes.                            |
| Playwright system-test files                              | Execute flows and declare `@flow:<id>` tags.                                             | Yes.                            |
| Project testbed module, such as `e2e/blackbox-testbed.ts` | Describes the runnable topology, managed services, reset policy, and artifact directory. | Yes.                            |
| `docker-compose.yml` or equivalent topology config        | Starts the SUT and managed dependencies.                                                 | Yes, as project infrastructure. |
| Service source directories                                | Used to resolve observable decision branch locations and snippets.                       | Yes, as normal source.          |

There is no public root `blackbox.config.yaml` contract in this wave. Docker Compose can still use YAML because it is external topology configuration, not a Blackbox behavior artifact.

## Files Blackbox Writes

The default artifact directory is `.blackbox-coverage/`.

| Artifact                                           | What it means                                                  | Primary reader                  | Git policy                                            |
| -------------------------------------------------- | -------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------- |
| `.blackbox-coverage/catalog/coverage.json`         | Effect contract coverage summary.                              | Tools and reviewers             | Usually ignored; useful for CI comparison.            |
| `.blackbox-coverage/shape/coverage.json`           | Boundary-shape coverage summary.                               | Tools and reviewers             | Usually ignored; useful for CI comparison.            |
| `.blackbox-coverage/effects-report.md`             | Human-readable effect and shape coverage summary.              | Reviewers and CI summaries      | Usually ignored; attach to a run or PR.               |
| `.blackbox-coverage/effects-report.html`           | Browser view of effect and shape coverage.                     | Developers investigating a run  | Ignore; publish or attach as CI artifact.             |
| `.blackbox-coverage/requirements/coverage.json`    | EARS verdicts produced by `verify` or `requirements coverage`. | Tools, CI, agents, reviewers    | Usually ignored; archive when requirements gate CI.   |
| `.blackbox-coverage/omcdc/verdict.json`            | Machine-readable observable decision evidence.                 | Tools, CI, agents               | Usually ignored; archive in CI when useful.           |
| `.blackbox-coverage/omcdc/verdict.md`              | Markdown observable decision report.                           | Humans in review or editor      | Usually ignored; attach when branch evidence matters. |
| `.blackbox-coverage/omcdc/verdict.html`            | Interactive branch-arm evidence report.                        | Humans debugging coverage       | Ignore; publish or attach as CI artifact.             |
| `.blackbox-coverage/omcdc.junit.xml`               | JUnit XML form when the JUnit reporter is enabled.             | CI test report UI               | Ignore; CI consumes it.                               |
| `.blackbox-coverage/code-coverage/coverage.json`   | Istanbul-compatible coverage data.                             | Coverage tooling                | Ignore; archive when needed.                          |
| `.blackbox-coverage/code-coverage/html/index.html` | Istanbul HTML coverage report.                                 | Humans comparing code coverage  | Ignore; publish or attach as CI artifact.             |
| `.blackbox-coverage/spans/*.spans.json`            | Per-flow runtime spans collected from SUT debug endpoints.     | Diagnostics and replay          | Ignore; archive only for debugging.                   |
| `.blackbox-coverage/node/v8/*.json`                | Per-test Node V8 coverage payloads.                            | Decision producer and replay    | Ignore; archive only for debugging.                   |
| `.blackbox-coverage/ambient/ambient.json`          | Effects classified as ambient rather than flow-owned.          | Diagnostics and policy tuning   | Ignore; inspect when attribution is unclear.          |
| `.blackbox-coverage/image-manifest.json`           | Instrumented testbed image metadata.                           | Reproducibility and diagnostics | Ignore; archive with a failing run.                   |

## Feature And Effect Files

Feature files, EARS requirements, and effect files answer different questions.

Feature files are readable behavior. They use Gherkin language and carry flow and requirement tags.

EARS files are normative requirements. Requirement IDs become traceable through Gherkin tags and flow IDs.

Effect files are runtime contracts. They declare concrete required and forbidden effects such as Redis reads, Postgres writes, HTTP calls, queue messages, or forbidden deletes.

## Artifact Routing

Blackbox can write reports to files, stdout, or CI-facing surfaces. The important distinction is whether an output defines accepted behavior or records evidence from one run.

1. File output is for durable review and later comparison.
2. Stdout is for quick inspection and scripting.
3. CI output is for gate signals and annotations.
4. The same proof can be routed differently without changing what was proven.

## Reporter And Sink Defaults

Coverage modules write JSON and observable decision artifacts independently of presentation reporters. The default presentation reporter writes `effects-report.md` and `effects-report.html`:

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

## Practical Defaults

1. Commit EARS requirements, feature files, Playwright flows, and effect contracts when those layers are accepted.
2. Ignore `.blackbox-coverage/` by default.
3. Archive `.blackbox-coverage/` in CI when a failure needs investigation.
4. Treat spans and runtime coverage payloads as diagnostic evidence, not hand-edited source.
5. Treat effect YAML changes as behavior changes that require review.
