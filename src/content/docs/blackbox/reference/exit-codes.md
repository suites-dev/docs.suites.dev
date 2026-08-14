---
title: "Exit Codes"
description: "Interpret Blackbox clean, findings, review-boundary, and engine-failure outcomes consistently in local automation and CI."
sidebar_position: 2
---

Blackbox uses three process exit codes across the public command facade.

| Code | Meaning                                                                                         |
| ---- | ----------------------------------------------------------------------------------------------- |
| `0`  | The command completed. This includes a successful source write that now requires review.        |
| `1`  | The command completed with behavioral or validation findings.                                   |
| `2`  | Invalid input, stale state, missing infrastructure, or engine failure blocked a trusted result. |

## Read Status Separately From Exit Code

A source-changing command can exit `0` with:

```json
{
  "status": "awaiting-review",
  "data": {
    "review": { "required": true }
  }
}
```

That result means the requested deterministic transformation succeeded. The workflow must pause for external human review.

## CI Policy

- Treat exit `1` as an actionable gate finding.
- Treat exit `2` as an untrustworthy run, not a behavioral failure.
- Never infer human approval from exit `0`.
- Preserve JSON findings and run artifacts when a runtime job fails.
- Use command-specific verdicts rather than collapsing all layer results into one Boolean.

## Compatibility Alias

Some alpha builds may expose `features emit` as an alias for `features extract`. New automation should use `features extract`; both follow the same exit-code contract while the alias remains available.
