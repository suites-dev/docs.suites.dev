---
title: "Secrets and Containers"
description: "Explain credential handling, container environment risks, and safe local/CI usage."
sidebar_position: 3
keywords: ["secrets", "containers", "ci security"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Secrets and Containers"
  secondary_keywords: ["secrets", "containers"]
  search_intent: "TODO"
  snippet_angle: "TODO"
---

## Abstract

Explain credential handling, container environment risks, and safe local/CI usage.

This page defines the risk boundary around secrets and containerized runs. The goal is to make it obvious what credentials are needed, where they live, and how containers affect isolation.

## Audience

These pages explain what Blackbox executes, reads, writes, and requires from the local or CI environment.

## Secrets

1. Use the narrowest credential scope that allows the test to run.
2. Prefer injected secrets over committed values.
3. Do not assume generated artifacts are secret-free.
4. Make the handling of tokens and credentials explicit in the docs.

## Containers

1. Containers should define the system boundary for the run.
2. The testbed should be clear about which containers are disposable and which are long-lived.
3. Volume mounts, ports, and network aliases should be documented where they matter for safety.
4. State whether the setup expects Docker, Docker Compose, or another topology.

## Content Outline

1. State what happens locally and in CI.
2. List data read and written.
3. Clarify secrets, credentials, network access, and telemetry.
4. Give safe operating defaults.

## Safe Operating Defaults

1. Rotate or scope credentials used in test environments.
2. Keep test containers separate from production secrets.
3. Avoid broad host mounts unless the test requires them.
4. Prefer disposable containers for reproducible runs.

## Evidence To Add

- Real commands, APIs, or artifacts from the Blackbox showcase system.
- Links to related concept, guide, reference, or troubleshooting pages.
- Clear limits and prerequisites where the page touches alpha behavior.
