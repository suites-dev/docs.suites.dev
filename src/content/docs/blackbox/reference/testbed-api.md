---
title: "Testbed API"
description: "Reference for createBlackboxTestbed sources, services, reset groups, worker identity, coverage output, and lifecycle."
sidebar_position: 3
keywords:
  [
    "createBlackboxTestbed",
    "Blackbox testbed API",
    "Compose system test",
    "Testcontainers Playwright",
  ]
---

`createBlackboxTestbed(input)` creates the global lifecycle and worker-stack plan used by Playwright system tests.

## Input

```ts
const testbed = createBlackboxTestbed({
  source,
  services: undefined,
  grouping: undefined,
  reset: undefined,
  coverageDir: undefined,
  projectNames: undefined,
  ambient: null,
});
```

The current alpha type requires every key, while omitted settings are represented by `undefined` and the default ambient policy by `null`.

| Field          | Required | Default                   | Meaning                                                      |
| -------------- | -------- | ------------------------- | ------------------------------------------------------------ |
| `source`       | Yes      | none                      | Compose or custom Testcontainers topology                    |
| `services`     | No       | introspected SUT services | Per-SUT source and wait overrides; pass `undefined` for none |
| `grouping`     | No       | `{ kind: 'auto' }`        | How reset boundaries are derived                             |
| `reset`        | No       | none                      | Reset managed state when the group key changes               |
| `coverageDir`  | No       | `.blackbox-coverage`      | Artifact root, cleared during global setup                   |
| `projectNames` | No       | kit defaults              | Compose project base names                                   |
| `ambient`      | No       | default classification    | Health/readiness/background span policy                      |

## Sources

### Compose

```ts
source: {
  compose: './e2e/compose.yml',
  profiles: ['system-test'],
}
```

`compose` accepts one path or an ordered array of Compose files. Blackbox introspects builds, images, healthchecks, ports, and source directories, then starts one project per Playwright worker.

### Testcontainers

```ts
source: {
  testcontainers: async (identity) => ({
    connect,
    infra,
    stop: async () => stopContainers(identity),
  }),
}
```

The callback runs in the worker process. Return SUT endpoints in `connect`, managed infrastructure hosts in `infra`, and an optional worker teardown.

### Dockerfile

The type surface includes `{ dockerfile, context, ports }` for forward compatibility. The current resolver rejects this source because bring-up is not implemented.

## Service Overrides

```ts
services: {
  api: {
    srcDir: './services/api/src',
    wait: { log: /listening on/ },
  },
}
```

`srcDir` defaults to `<build-context>/src`. `wait` accepts `healthcheck`, `ports`, `{ log: RegExp }`, or a Testcontainers `WaitStrategy`.

## Reset Context

```ts
reset: async ({ connect, infra, groupKey, identity }) => {
  await resetDatabase(infra.postgres);
  await resetCache(infra.redis);
  await purgeQueues(infra.localstack);
};
```

`identity` includes Playwright worker indices. `groupKey` is auto-derived from BDD isolation tags or the Playwright file and title path unless a manual grouping policy overrides it.

## Lifecycle

| Phase            | Work                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| Global setup     | Resolve config, prepare coverage directory, validate/build SUT images and payload |
| Worker bootstrap | Start one topology for the worker and expose connect/infra maps                   |
| Group transition | Call the configured reset function                                                |
| Test capture     | Reset observation buffers, execute, drain effects and coverage                    |
| Worker teardown  | Stop the worker topology unless `BLACKBOX_KEEP_STACK=1`                           |
| Global teardown  | Merge partials, finalize feature output, run reporters and sinks                  |

Use [Testbed and Instrumentation](/docs/blackbox/guides/set-up-the-testbed) for the complete setup workflow.
