---
title: "Flow Identity"
description: "Connect one stable flow ID across Gherkin, executable tests, effect contracts, and sealed runtime evidence."
sidebar_position: 4
keywords: ["Blackbox flow tag", "flow ID", "runner adapter", "Gherkin flow"]
---

A **flow ID** gives Blackbox one stable identity across reviewed intent, executable behavior, runtime evidence, and analysis.

## Use the Default Tag Prefix

The default recognized prefix is `@flow:`.

```text
@flow:subscribe-unknown-user
```

Only tags with configured flow prefixes trigger runtime capture. The prefix is configurable so Blackbox can coexist with runner and repository conventions.

## Keep the ID Consistent

For one flow, use `subscribe-unknown-user` in:

| Surface          | Representation                                  |
| ---------------- | ----------------------------------------------- |
| Gherkin          | `@flow:subscribe-unknown-user`                  |
| Executable suite | The runner-native flow tag or generated flow ID |
| Effect contract  | `flow: subscribe-unknown-user`                  |
| Evidence bundle  | Canonical flow identity                         |
| Analyzer output  | Result key for the same flow                    |

Blackbox uses explicit identity. Similar titles or natural-language descriptions do not establish a binding.

## Runner Adapters Own Native Syntax

The Playwright suite generator emits a tagged `test.describe()` with `test.describe.configure({ mode: "default" })` and `test.step()` blocks. The Playwright adapter maps native execution to the framework-neutral runner lifecycle.

Other runner adapters use their native metadata surfaces while producing the same canonical flow identity. The evidence protocol does not depend on Playwright syntax.

## Summary

- **Use one stable ID** across every artifact.
- **Use `@flow:` by default** for selected runtime flows.
- **Tag only flows that should trigger capture.**
- **Let each runner adapter map native metadata** to the same identity.
