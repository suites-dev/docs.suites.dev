---
title: "Environment Configuration"
description: "Load dotenv files, selected host variables, and explicit service values without exposing Blackbox's internal transport."
sidebar_position: 6
keywords: ["Blackbox environment", "dotenv", "environment passthrough"]
---

Configure application environment per service in `blackbox.config.ts`.

```ts
environment: {
  files: [".env", ".env.test"],
  passthrough: ["DATABASE_URL", "CI"],
  values: {
    NODE_ENV: "test",
    LOG_LEVEL: "warn",
  },
}
```

## Resolution Order

Blackbox applies environment sources in this order:

```text
dotenv files -> selected host variables -> explicit values
```

Later sources win. Files are resolved relative to the configured SUT working directory.

## Pass Through Only Intentional Variables

`passthrough` names individual host variables. Blackbox does not copy the entire parent environment into the SUT.

Use passthrough for secrets and CI-provided endpoints that should not appear in source control. Use `values` for deterministic test settings.

## Keep Blackbox Transport Internal

Blackbox supplies run, cell, service, capture, sidecar, and control values when it starts a managed service. Do not add internal `BLACKBOX_*` values to `.env` files or CI configuration.

The public interface is the typed configuration. Internal transport names can change without becoming project API.

## External Lifecycle

When `lifecycle.ownership` is `user`, attach the service’s language capture package using the launch integration for that language. Blackbox still owns attempt identity and evidence analysis; you own the application process and its environment.

## See Also

- [Run a Host Command](/docs/blackbox/guides/run-a-host-command)
- [Configuration](/docs/blackbox/reference/configuration)
