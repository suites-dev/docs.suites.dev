---
title: "Install Blackbox"
description: "Show project-local installation, CLI verification, upgrade notes, and uninstall expectations."
sidebar_position: 2
keywords: ["install blackbox", "blackbox cli", "typescript package"]
toc_min_heading_level: 2
seo:
  primary_keyword: "install blackbox"
  secondary_keywords: ["blackbox cli", "typescript package", "playwright docker testing"]
  search_intent: "installation intent from developers adding Blackbox to a TypeScript system-test project"
  snippet_angle: "install the Blackbox runtime/testbed package and optional CLI, then verify the binary and first system-test path"
---

## Abstract

This page gets a repo from prerequisites to a verifiable install with the fewest moving parts.

## Audience

Developers who want to know the install worked before they try a full proof run.

## What Success Looks Like

1. The package is installed locally.
2. The CLI is reachable.
3. The version or help output matches the expected binary.
4. The project is ready for the first proof run.

## Project-Local Install

Install the runtime/testbed package in the project that owns your system tests:

```bash
pnpm add -D @suites/blackbox
```

Add `testcontainers` packages only when your testbed uses the programmatic Testcontainers path. If your project already has Docker Compose, the first Blackbox dependency can stay focused on the kit.

Install the CLI package when you want the `blackbox` binary for feature files, coverage replay, and static instrumentation commands:

```bash
pnpm add -D @suites/blackbox-cli
```

The current Blackbox repo uses `pnpm@9.15.4` and Node `>=22`.

## Verify The CLI

```bash
pnpm exec blackbox --help
pnpm exec blackbox features check --help
```

You should see the `features`, `coverage`, and `otel` command topics. If the binary is not found, confirm that `@suites/blackbox-cli` is installed in the same workspace package where you run the command.

## Verify The Testbed Path

The CLI does not replace your system-test command. Your project still owns the command that starts the topology and runs Playwright.

In the Blackbox showcase repository, that command is:

```bash
pnpm test:system
```

That script delegates to the e2e package, builds the Blackbox package, builds the local bootstrap image, and runs Playwright.

For your own project, create an equivalent project script once the testbed config and Playwright setup are in place.

## Bootstrap Image

Local development may need the OpenTelemetry bootstrap image:

```bash
pnpm build:otel-image
```

That builds `blackbox-otel-bootstrap:local` from the bootstrap Dockerfile. Packaged or CI setups may instead pull a published image or use `BLACKBOX_OTEL_IMAGE`.

You do not need to add `@opentelemetry/*` packages, edit service Dockerfiles, or set `NODE_OPTIONS` by hand for the default testbed path.

## Uninstall

Remove the packages you installed and delete generated artifacts if you no longer need them:

```bash
pnpm remove @suites/blackbox @suites/blackbox-cli
```

Generated reports usually live under `.blackbox-coverage/` and can be deleted like other local test output.
