---
title: "Cover Behavior Before a Refactor"
description: "Review one consequential flow before changing internals, then compare deterministic runtime behavior after the refactor."
sidebar_position: 1
keywords:
  ["characterization testing", "refactor safety", "cover before refactor"]
---

A refactor can preserve response assertions while changing database, HTTP, queue, or cache behavior. Blackbox makes selected boundary behavior part of the review.

## Start With One Flow

Choose a behavior whose silent drift would matter, such as payment, authorization, persistence, publication, retry, or compensation.

Before changing implementation:

1. Recover and review the executable flow.
2. Record the flow in an isolated capture cell.
3. Review observed effects instead of approving the recording wholesale.
4. Accept the effects that define correct behavior.

The observed run is characterization evidence. The reviewed effect contract is the behavior the refactor must preserve.

## Compare After the Change

Record the same flow after the refactor and analyze its sealed bundle against the unchanged contract.

| Result                     | Action                                               |
| -------------------------- | ---------------------------------------------------- |
| Required effects remain    | Continue review                                      |
| Required effect disappears | Repair or approve an intentional contract change     |
| Forbidden effect appears   | Reject the regression                                |
| New effect is unknown      | Investigate before accepting the result              |
| ODC exposes masking        | Review whether the decision still reaches a boundary |

## Keep the Claim Bounded

Blackbox does not prove the whole refactor safe. It proves selected behavior for the flows and boundaries the capture implementation observed.

Unit tests still diagnose local logic. The Blackbox result adds system-level evidence to the code diff and native test result.

## Next Steps

- [Runtime Evidence](/docs/blackbox/concepts/runtime-evidence)
- [Effects and Contracts](/docs/blackbox/concepts/effects-and-catalogs)
- [Add Verification Gates to CI](/docs/blackbox/guides/reports-and-ci-gates)
