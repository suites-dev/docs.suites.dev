---
title: "Network Access and Isolation"
description: "Explain what outbound network access Blackbox needs and how to isolate runs safely."
sidebar_position: 2
keywords: ["network access", "isolation", "blackbox security"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Network Access and Isolation"
  secondary_keywords: ["network access", "isolation"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Explain what outbound network access Blackbox needs and how to isolate runs safely.

This page should make the trust boundary concrete: what can talk to what, when the testbed needs the network, and how to keep a run hermetic when that matters.

## Audience

Teams deciding whether Blackbox can run inside their network or CI constraints.

## Network Model

1. The test runner talks to the SUT and any local dependencies it stands up.
2. The SUT may talk to its own downstream services if the scenario requires it.
3. Blackbox should document any external calls that happen during setup, execution, or artifact upload.
4. Isolation should make it clear which parts of the run are hermetic and which are not.

## Content Outline

1. State the default network assumptions.
2. Explain which parts of the run need outbound access, if any.
3. Show how to isolate the testbed and containers.
4. Note what changes for local development versus CI.

## Safe Operating Defaults

1. Prefer a testbed that does not depend on the public internet.
2. Allow outbound access only when the scenario depends on it.
3. Document any proxy, DNS, or firewall assumptions.
4. Keep the isolation model the same in local development and CI when possible.

## Evidence To Add

- A network diagram showing runner, testbed, SUT, and external services.
- A table of allowed outbound dependencies by mode.
- Links to What Blackbox Runs, Data and Telemetry, and Secrets and Containers.

## Figure Placeholder

**Caption:** The network boundary for a Blackbox run.

**Slot:** `<!-- TODO: insert network-isolation diagram or sandbox topology graphic here -->`
