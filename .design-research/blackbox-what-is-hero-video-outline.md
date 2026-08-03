# Blackbox "What Is" Hero Video Outline

Target page: `/docs/blackbox/overview/what-is-blackbox`

Purpose: make the first viewport immediately concrete. A developer should understand within seconds that Blackbox is not a replacement for Playwright. It is the evidence layer added to a Playwright system test through matchers, runtime effects, a reviewed catalog, and an effect coverage result.

## Verdict

The current page explains the input/output gap, but the first visual still needs the developer moment:

> I have a Playwright system test. I can assert effects inline with `toObserveEffects()` while shaping the scenario, then use `toMatchCatalog()` as the reviewed catalog gate. I run the test. Blackbox captures effects, matches them against intent, and reports effect coverage.

This should be shown as an active, lightweight IDE plus CLI clip, not a marketing animation and not a topology diagram.

## Core Message

One sentence for the clip:

> Keep the Playwright test you trust; add Blackbox matchers to prove the runtime effects behind the response.

Supporting proof chain:

1. Playwright drives the system.
2. The response assertion still passes.
3. `toObserveEffects()` can check required and forbidden effects inline while the scenario is still being shaped.
4. `toMatchCatalog()` checks the captured run against the reviewed catalog.
5. Blackbox observes boundary effects from the test run.
6. A reviewed catalog declares required and forbidden behavior.
7. Effect coverage says whether the behavior was satisfied.

## Placement On The Page

Place the clip near the top of `What is Blackbox?`, before or immediately after the opening two paragraphs.

Preferred first-screen order:

1. One short definition paragraph.
2. The video/interactive clip.
3. The input/output gap diagram.
4. Reality vs intent.

Reason: the clip gives the reader a familiar artifact before the page introduces the conceptual gap.

## Production Format

- Style: light IDE, practical developer workspace.
- Length: 55-75 seconds for the full clip.
- Hero cut: 18-25 seconds using scenes 1-6 only.
- Aspect: 16:9 primary, with mobile crop that keeps the code line and terminal visible.
- Motion: cursor typing, terminal output, side panels filling in, highlights connecting matching rows.
- Tone: quiet, utilitarian, no product-tour chrome, no hero gradient, no mascot, no generic nodes.

## UI Layout

Desktop layout:

- Left 60-65%: light IDE editor.
- Bottom-left or bottom-right: terminal running Playwright.
- Right rail: three compact stacked panels:
  - Runtime effects.
  - Effect catalog.
  - Coverage result.

Keep the workspace dense but readable. The viewer should feel like they are watching a developer working, not watching a product explainer.

Use the same scenario name everywhere: `subscribe-flow`.

Use concrete artifact names:

- `subscribe.spec.ts`
- `subscribe-flow.system.effects.yaml`
- `.blackbox-coverage/coverage.json`

## Full Storyboard

| Time | Scene | Visual Action | On-Screen Caption | Purpose |
| --- | --- | --- | --- | --- |
| 0-4s | Familiar test | Light IDE opens `subscribe.spec.ts`. Cursor sits under `expect(response.status()).toBe(201);`. | `Start with a Playwright system test.` | Start from what the reader already knows. |
| 4-8s | Add matcher | Developer types `await expect(capture).toMatchCatalog();`. The new line gets a soft highlight. | `Add one matcher to check effects.` | Make the Blackbox integration concrete. |
| 8-13s | Run test | Terminal runs `pnpm test:system`. Playwright starts the `subscribe-flow` test. | `Run the system test normally.` | Show Blackbox rides with the existing runner. |
| 13-22s | Response passes | Terminal shows `✓ response 201 Created`. A small badge appears over the response assertion: `response passed`. | `The response passed.` | Preserve the value of normal E2E/system assertions. |
| 22-31s | Inline effect assertion | A small split view shows an alternate line: `await expect(capture).toObserveEffects({ requires, forbids });`. It appears as a temporary "while shaping" note, not the main path. | `Shape effects inline while developing.` | Introduce the forgotten matcher without derailing the hero. |
| 31-42s | Effects appear | Right rail panel fills with runtime rows: `http POST /v1/payment_intents`, `postgres INSERT subscriptions`, `redis SET user:alice:tier`, `sqs SendMessage subscription.created`. | `Blackbox observes runtime boundary effects.` | Show the missing middle between input and output. |
| 42-54s | Catalog match | Catalog panel opens. Required rows check off. Forbidden rows show `absent`: `http POST /v1/refunds`, `postgres DELETE subscriptions`. Matching lines briefly connect effects to catalog rows. | `Promote stable intent to the catalog.` | Explain inline-to-catalog lifecycle without abstract language. |
| 54-64s | Matcher result | Terminal prints: `toMatchCatalog ✓ required observed ✓ forbidden absent`. | `Required observed. Forbidden absent.` | Make the catalog matcher's job clear. |
| 64-72s | Coverage result | Coverage panel shows `catalog entries 1`, `satisfied 1 (100%)`, `failed 0`, `uncovered 0`, plus `written: .blackbox-coverage/coverage.json`. | `Effect coverage: satisfied.` | End on success criteria and artifact. |
| 72-75s | Stable end frame | Workspace holds: code, terminal, effects, catalog, coverage result all visible. | `A passing response becomes reviewable behavioral proof.` | Leave the full mental model on screen. |

## Hero Cut

Use this compressed sequence if the first viewport needs a short loop:

1. `0-3s`: Code editor shows `expect(response.status()).toBe(201);`.
2. `3-5s`: Add `await expect(capture).toMatchCatalog();`.
3. `5-8s`: Terminal runs `pnpm test:system`.
4. `8-13s`: Runtime effects fill the side panel.
5. `13-18s`: Catalog rows check off required and forbidden behavior.
6. `18-22s`: Coverage result turns green: `satisfied 1 (100%)`.

Caption sequence:

1. `Start with a Playwright system test.`
2. `Add Blackbox's matcher.`
3. `Observe runtime effects.`
4. `Match a reviewed catalog.`
5. `Read effect coverage.`

Do not include `toObserveEffects()` in the short hero cut unless the clip has room for a two-step matcher story. The short cut should stay focused on the reviewed catalog loop.

## Code Shown In The IDE

Use a narrow snippet. Do not show full setup.

```ts
import { expect, test } from './testbed.js';

test.system('subscribe-flow', 'alice subscribes', () => {
  test('returns 201 and proves effects', async ({ capture, request, system }) => {
    const response = await request.post(`${system.bff.hostBaseUrl}/subscriptions`, {
      data: { userId: 'alice', paymentMethodId: 'pm_card_visa' },
    });

    expect(response.status()).toBe(201);

    await expect(capture).toMatchCatalog();
  });
});
```

Typing focus:

```ts
await expect(capture).toMatchCatalog();
```

This line must be visually unmistakable.

## Optional Inline Matcher Scene

Use `toObserveEffects()` in the longer clip or an interactive walkthrough when the story needs to show how a developer discovers and shapes the contract before promoting it to the catalog.

```ts
await expect(capture).toObserveEffects({
  requires: [
    effect.postgres('INSERT', { table: 'subscriptions' }),
    effect.redis('SET', { key: 'user:alice:tier' }),
    effect.sqs('SendMessage', { queue: 'subscription-orders' }),
  ],
  forbids: [
    effect.http('POST', { path: '/v1/refunds' }),
    effect.postgres('DELETE', { table: 'subscriptions' }),
  ],
});
```

Micro-sequence:

1. Developer adds inline `toObserveEffects()`.
2. Effects panel confirms required effects and forbidden absences.
3. Caption: `Inline assertions help shape the contract.`
4. Catalog file appears.
5. Caption changes: `Stable intent moves to the catalog.`
6. Code returns to `toMatchCatalog()` for the durable gate.

Do not show `toObserveEffects()` and `toMatchCatalog()` as competing APIs. Show them as two points in the lifecycle:

- `toObserveEffects()` for inline shaping and local assertions.
- `toMatchCatalog()` for the reviewed, reusable behavior contract.

## CLI Output

Use short, designed output. Avoid Docker startup noise.

```text
$ pnpm test:system

✓ subscribe-flow › alice subscribes
✓ response 201 Created

blackbox: captured 4 effects
  http       POST /v1/payment_intents
  postgres  INSERT subscriptions
  redis     SET user:alice:tier
  sqs       SendMessage subscription.created

blackbox: matching subscribe-flow against catalog
requires: 4/4 observed
forbids:  2/2 absent
effect coverage: satisfied

written: .blackbox-coverage/coverage.json
```

## Catalog Panel

Show a reviewed catalog, not first-run baseline generation. First-run baseline is a quickstart topic and can confuse the overview video.

```yaml
specVersion: "0.1"

subscribe-flow:
  requires:
    - { boundary: http, op: POST, key: /v1/payment_intents }
    - { boundary: postgres, op: INSERT, key: subscriptions }
    - { boundary: redis, op: SET, key: "user:alice:tier" }
    - { boundary: sqs, op: SendMessage }
  forbids:
    - { boundary: http, op: POST, key: /v1/refunds }
    - { boundary: postgres, op: DELETE, key: subscriptions }
```

Visual behavior:

- Required rows get green checkmarks.
- Forbidden rows get muted `absent` badges.
- A thin line connects observed effects to required catalog rows.
- Forbidden rows should not connect to runtime effects, because absence is the point.

## Coverage Panel

```text
effect coverage

metric           value
catalog entries  1
satisfied        1 (100%)
failed           0
uncovered        0
```

Use green only for the final satisfied state. Avoid a giant success animation.

## Microcopy

Use short captions. The caption should explain the scene, not add a second argument.

Recommended:

- `Start with a Playwright system test.`
- `The response passes. Effects are still unchecked.`
- `Add Blackbox's matcher.`
- `Shape effects inline when the contract is still forming.`
- `Blackbox observes runtime boundary effects.`
- `The catalog defines required and forbidden behavior.`
- `Stable intent moves to the catalog.`
- `Required observed. Forbidden absent.`
- `Effect coverage: satisfied.`

Avoid:

- `Intent Oracle`
- `AI-powered proof`
- `Magic verification`
- `Full-stack observability`
- `Replace your E2E tests`
- `OpenTelemetry bootstrap`

## What To Cut From This Video

Do not show these in the overview clip:

- OpenTelemetry internals.
- `node-wrap`.
- Bootstrap image injection.
- Docker Compose startup logs.
- Testbed architecture.
- Generated feature files.
- BDD/Gherkin flow.
- OMC/DC report.
- CI gate setup.
- Testing pyramid.
- Five-service topology diagram.
- Agentic workflow.

Those belong deeper in the docs. This clip has one job: make the matcher and proof loop obvious.

## Accuracy Notes

- Show Blackbox as an addition to Playwright, not a replacement.
- Show `toMatchCatalog()` as the main matcher.
- Name `toObserveEffects()` as the inline effect assertion matcher when showing the development/shaping step.
- Show a reviewed catalog path in the overview clip.
- Do not mix baseline generation with enforcement in this clip.
- Do not make `toObserveEffects()` look like "emit effects"; Blackbox observes/captures effects from the run, and the matcher asserts expected shapes.
- Keep `subscribe-flow` consistent across test, catalog, effects, and report.
- Show system-test evidence, not unit-test code coverage.

## Review From Two Codex Agents

Two read-only Codex agents reviewed the direction.

Agent 1, docs psychology review:

- The first five seconds should show the Playwright assertion and the new matcher line.
- The causal chain must stay literal: test -> effects -> catalog match -> coverage proof.
- Cut instrumentation, BDD, OMC/DC, CI, and topology details.
- Avoid showing baseline creation in the overview because it creates first-run/enforcement confusion.
- If `toObserveEffects()` appears, frame it as an inline authoring step before the catalog gate.

Agent 2, product UX/storyboard review:

- Use a light IDE as the dominant surface.
- Keep the right rail compact: Effects, Catalog, Report.
- End on a stable developer workspace, not a slogan card.
- Use terse captions and real artifact names.
- Avoid marketing animation language, abstract oracle visuals, and anything that makes Blackbox look like a Playwright replacement.

## Final Recommendation

Build the first version as a short, loopable 20-25 second hero clip using the `toMatchCatalog()` path. Keep the 55-75 second storyboard as the longer reference for a docs demo or interactive walkthrough that can include `toObserveEffects()`.

The first viewport should answer one question:

> What do I add to my test, and what proof appears when I run it?
