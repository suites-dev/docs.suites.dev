[Back to blog](https://buildwithfern.com/blog) [View as Markdown](https://buildwithfern.com/post/how-to-write-technical-documentation.md)

# How to write technical documentation: a complete guide (August 2026)

August 7, 2026·12 min read

[Educational](https://buildwithfern.com/post/tag/educational), [Docs](https://buildwithfern.com/post/tag/docs)

Technical documentation fails for a predictable reason: it is written once, by hand, against a system that keeps
changing. The page that explained authentication in March describes an endpoint that was renamed in May, and nobody
notices until a developer opens a support ticket. Writing quality matters, but it is not the constraint. The constraint
is whether the docs have a source of truth that updates without a human remembering to update it. This guide walks the
full process, from audience mapping through publishing, on one
principle: [every piece of documentation should be classified by whether it can be generated or must be written](https://buildwithfern.com/),
and the generated parts should never be maintained by hand.

**TLDR:**

- Technical documentation splits into four content types (tutorials, how-to guides, reference, explanation), and mixing
  them on one page is the most common structural mistake.
- Reference content should be generated from an API definition. Conceptual content should be written by a human.
  Treating both the same way is what produces drift.
- A technical documentation template enforces consistency far more reliably than a style guide nobody reads.
- Style, link, and spec checks belong in CI, where they block a pull request, not in a review checklist.
- Documentation now has two audiences: developers reading in a browser and AI agents parsing structured formats like
  `llms.txt` and Markdown endpoints.
- Fern generates API reference docs, multi-language code snippets, and AI-readable formats from a single API definition,
  so the generated half of the docs stays current without manual work.

## The four types of technical documentation

Most documentation problems are classification problems. A page that tries to teach, instruct, and specify at the same
time does all three badly. The [Diátaxis framework](https://diataxis.fr/) is the clearest articulation of this, and it
splits documentation into four types based on what the reader needs:

- **Tutorials** are lessons. The reader is learning, and the goal is a successful first experience, not comprehensive
  coverage. A tutorial has one path and no branches.
- **How-to guides** are recipes. The reader already knows the system and has a specific goal ("rotate an API key", "
  handle webhook retries"). They assume context that a tutorial cannot.
- **Reference** is specification. Endpoint paths, parameters, response schemas, error codes, configuration options. It
  is consulted, not read, and its only job is accuracy and completeness.
- **Explanation** is context. Why the system works this way, what tradeoffs were made, how the pieces relate. It is the
  type most often skipped and the type that reduces the most support load.

The practical value of this split is not tidiness. It tells you what can be automated. Reference is machine-derivable
from an API definition. The other three are not. Once a team internalizes that distinction, the maintenance question
answers itself: reference should never be hand-written, and tutorials should never be auto-generated.

## Step 1: Map the audience before writing a word

"Developers" is not an audience. A first-time evaluator deciding whether an API can do the job, an implementing engineer
wiring up a webhook handler, and a compliance reviewer confirming how data is encrypted all read the same docs site with
incompatible needs.

Write down the two or three concrete roles the documentation serves, then the single question each one arrives with.
Evaluators want to know whether a capability exists. Implementers want a working request in their language. Reviewers
want the security model stated plainly. If a page does not answer one of those questions, it belongs somewhere else or
nowhere.

This matters structurally, not just editorially. Documentation that serves multiple audiences from one source needs a
mechanism for filtering, whether that is audience tagging in the API definition, role-based access control on sections,
or simply separate top-level navigation. Building the filter later means restructuring content that has already
accumulated inbound links.

## Step 2: Pick the source of truth before picking the tool

The most consequential decision in a documentation project is where the truth lives. Three patterns are common:

| Pattern          | Source of truth                              | Drift risk                       | Best for                                   |
|------------------|----------------------------------------------|----------------------------------|--------------------------------------------|
| WYSIWYG platform | The platform's database                      | High for reference content       | Small surface areas, non-technical authors |
| Docs-as-code     | Markdown/MDX in Git                          | Medium, bounded by review        | Conceptual content, engineering-owned docs |
| Spec-driven      | API definition (OpenAPI, AsyncAPI, protobuf) | Low for anything derived from it | API reference, code samples, SDKs          |

Production documentation usually needs the last two together. Conceptual content lives in Markdown alongside the code,
reviewed through pull requests like any other change, which is the core
of [docs-as-code](https://buildwithfern.com/post/docs-as-code). Reference content is derived from
the [API definition](https://buildwithfern.com/learn/api-definitions/overview/what-is-an-api-definition) so it cannot
describe an endpoint that no longer exists.

The failure mode to avoid is a platform where reference content is typed into a web form. That content has no upstream,
so nothing can validate it, and it degrades quietly from the day it is published.

## Step 3: Build a technical documentation template

A template does what a style guide cannot: it makes the correct structure the path of least resistance. Every page type
gets a skeleton, and authors fill it in rather than deciding structure from scratch.

A workable how-to guide template looks like this:

```
---
title: <Verb-led task, e.g. "Verify webhook signatures">
description: <One sentence stating the outcome>
---

## Prerequisites
- Required credentials, permissions, or prior setup
- Minimum SDK or API version

## Steps
1. <Action> — with a runnable code sample
2. <Action> — with the expected output or response
3. <Action>

## Verify it worked
<The observable signal that confirms success>

## Troubleshooting
| Symptom | Likely cause | Fix |

## Related
- Links to the reference pages for every endpoint used above
```

Three details carry most of the value. Prerequisites stated up front prevent the reader from discovering a missing
permission at step six. A verification step is what separates following the instructions from confirming the result. And
a troubleshooting table captures the support questions this page will otherwise generate.

Reference pages need a template too, though it is usually enforced by the generator rather than the author: endpoint
summary, auth requirements, parameters with types and constraints, request example, response schema, and every
documented error code. Tutorials need a stated end state and an explicit scope boundary so they do not sprawl into
how-to guides.

Store the templates in the repository and reference them from a contributing guide. If the documentation platform
supports [reusable snippets](https://buildwithfern.com/learn/docs/writing-content/reusable-snippets), put shared
blocks (auth setup, installation, rate-limit notes) in one place so a change propagates everywhere instead of leaving
eleven copies to find.

## Step 4: Generate the reference, write the concepts

This is where the guide's thesis becomes operational. Reference documentation is a projection of the API contract. If it
is written by hand, it is a second copy of the contract that has to be kept in sync with the first, and that
synchronization is done by human memory under deadline pressure.

Generating reference from the specification removes the second copy. Parameter types, required fields, enum values,
error schemas, and code samples in every supported language all derive from the same definition that produces the server
contract and the client libraries. When an endpoint gains a field, the docs gain it in the same commit.

What generation cannot produce is judgment. An OpenAPI spec can say that `retry_policy` accepts an integer between 0 and
5. It cannot say that setting it above 3 will trip most gateway timeouts, or that idempotency keys are required if the
value is greater than 0. That belongs in hand-written explanation, and it is where documentation earns its keep.
The [API documentation best practices](https://buildwithfern.com/post/api-documentation-best-practices-guide) that
consistently correlate with fast integrations are almost all in this category: worked end-to-end examples, error
recovery guidance, and explicit statements of what the API will not do.

## Step 5: Write procedures a developer can finish in one sitting

Prose quality in technical documentation reduces to a short list of habits.

- **Lead with the task, not the tool.** "Verify webhook signatures" beats "About the signature verification module".
- **Use imperative mood in steps.** "Send a POST request to /v1/tokens" is unambiguous. "The token can be requested" is
  not.
- **Make every code sample runnable.** Placeholder-heavy snippets that fail on paste are worse than no snippet, because
  the reader spends time debugging the example instead of the integration.
- **State the response, not just the request.** A step is incomplete until the reader knows what success looks like.
- **Put constraints where they apply.** Rate limits belong on the endpoint that enforces them, not only on a page
  called "Rate limits".
- **Define a term once, then use it consistently.** Alternating between "workspace", "org", and "tenant" for the same
  object forces the reader to hold a mapping in their head.

Adopting an existing style guide (the [Google developer documentation style guide](https://developers.google.com/style)
or the Microsoft Writing Style Guide) is faster than writing one, and both are specific enough to be
machine-enforceable, which matters for the next step.

## Step 6: Enforce quality in CI, not in review

Documentation review that depends on a human noticing a broken link or an inconsistent term does not scale past a
handful of contributors. The checks that actually hold are the ones that fail a build.

Four gates cover most of it:

- **Prose linting.** [Vale](https://vale.sh/) checks Markdown and MDX against a style guide as a set of rules, including
  terminology bans, passive-voice limits, and heading capitalization. It runs as a GitHub Action that annotates pull
  requests inline, and Fern documents a `.vale.ini` setup that parses MDX as Markdown so the rules apply to
  component-heavy pages.
- **Spec linting.** [Spectral](https://stoplight.io/open-source/spectral) validates the OpenAPI document itself: missing
  descriptions, undocumented error responses, naming conventions, unused schemas. Because reference docs are generated
  from the spec, a spec lint is a documentation lint.
- **Breaking-change detection.** Diffing the current API definition against the last released version in CI catches a
  removed field before it reaches a published page and a shipped SDK.
- **Link and snippet checking.** Dead internal links and code samples that no longer compile are the two defects readers
  report most often, and both are trivially automatable.

Running these on every pull request converts documentation quality from a periodic cleanup project into a property of
the pipeline. The broader case for this is covered
in [documentation linting](https://buildwithfern.com/post/docs-linting-guide), and the structural side, how content is
organized so it stays findable as it grows,
in [information architecture for documentation](https://buildwithfern.com/post/information-architecture-best-practices-documentation).

## Step 7: Publish for developers and AI agents

Documentation now has a second reader that never asks a clarifying question. Coding assistants like Cursor, Claude Code,
and GitHub Copilot pull documentation into context and generate integration code from it. When they read an inaccurate
page, they emit code that fails in a way the developer attributes to the API, not to the docs.

Serving that audience is mostly a publishing concern rather than a writing one:

- **`llms.txt`** gives AI clients a token-efficient index of the documentation.
  Fern [generates and maintains it automatically](https://buildwithfern.com/learn/docs/ai-features/llms-txt).
- **Markdown endpoints.** Serving the raw Markdown of any page lets agents fetch clean content instead of scraping
  rendered HTML. On Fern sites, appending `.md` to a page URL returns its Markdown source, which pairs with `llms.txt`
  as an index rather than requiring a full-site concatenation.
- **An MCP server** exposes the documentation as a structured, queryable source for AI clients. Fern generates one from
  the documentation site and enforces the same authentication and role-based access control the site applies, so an
  agent only reaches content the authenticated user can see.
- **Machine-readable discovery.** Fern documentation sites expose a `/.well-known/api-catalog` endpoint conforming
  to [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.html), so crawlers and agents can enumerate available APIs
  without configuration.

Writing choices help here too, and they overlap with writing well for humans: descriptive headings, one concept per
section, explicit parameter descriptions, and complete error documentation. The specifics are covered
in [writing LLM-friendly documentation](https://buildwithfern.com/post/how-to-write-llm-friendly-documentation).

## Technical documentation examples worth studying

Reading good documentation is a faster way to calibrate than reading advice about documentation.

- **[Stripe](https://docs.stripe.com/)** is the reference standard for API docs: a two-pane layout pairing prose with
  runnable samples, language switching that persists across pages, and reference content generated from the spec.
- **[Twilio](https://www.twilio.com/docs)** handles a large multi-product surface without losing navigability, and its
  per-endpoint error tables are unusually complete.
- **[Kubernetes](https://kubernetes.io/docs/home/)** separates tutorials, tasks, concepts, and reference at the top
  level of navigation, which is the Diátaxis split applied at a very large content scale.
- **[Django](https://docs.djangoproject.com/)** demonstrates that explanation content ages well when tutorials and
  reference do not; its topic guides remain useful across major versions.
- **[Postman's API docs](https://learning.postman.com/docs/introduction/overview/)** show how to document a tool whose
  primary users are themselves building APIs, with heavy use of task-oriented how-to structure.

The common thread is not visual polish. It is that each one makes the content type of a page obvious within the first
two lines.

## How Fern fits into a technical documentation workflow

Fern takes an API definition (OpenAPI, AsyncAPI, OpenRPC, gRPC/protobuf, or Fern Definition) and generates the
interactive API reference, code snippets in every supported SDK language, and AI-readable formats including `llms.txt`
and a documentation MCP server. Conceptual pages stay as MDX in Git and go through pull-request review, with role-based
access control and `x-fern-audiences` filtering so one source can serve public, partner, and internal readers without
duplicated sites. For contributors who do not work in Git, the Fern Editor provides a WYSIWYG interface that still
commits through the same review workflow. The result is a clean split: the generated half of the docs cannot drift from
the API, and the written half gets the review attention it actually needs.

## Final thoughts on writing technical documentation

The question that determines whether documentation stays accurate is not how well it is written. It is whether each page
is classified correctly as generated or authored, and then handled accordingly. Reference derived from a specification
stays true by construction. Tutorials, guides, and explanation stay true through templates, CI checks, and review
discipline. Teams that blur the two end up hand-maintaining machine-derivable content and under-investing in the content
only a human can write.

[Book a demo](https://buildwithfern.com/book-demo) to see how Fern generates API reference documentation, SDK code
samples, and AI-readable formats from a single definition, so the reference half of your docs maintains itself.

## FAQ

### What should a technical documentation template include?

At minimum: a title stating the task or object, a one-sentence description of the outcome, prerequisites, numbered steps
with runnable code samples, a verification step confirming success, a troubleshooting table, and links to related
reference pages. Keep separate templates for tutorials, how-to guides, and reference so authors are not forced to adapt
one shape to three jobs. Store the templates in the documentation repository so they are versioned alongside the
content.

### What are the four types of technical documentation?

Tutorials (learning-oriented lessons), how-to guides (goal-oriented recipes), reference (information-oriented
specification), and explanation (understanding-oriented context). The distinction comes from the Diátaxis framework, and
its practical value is that reference is machine-generable from an API definition while the other three require a human
author. Separating them in navigation also helps readers land on the right page from search.

### How is technical documentation different from API documentation?

API documentation is a subset of technical documentation focused on the interface a program exposes: endpoints,
parameters, schemas, authentication, and error codes. Technical documentation covers a wider set of artifacts including
architecture overviews, runbooks, release notes, internal design docs, and end-user guides. The two share tooling and
process, but API reference is uniquely well suited to generation because a machine-readable contract already exists.

### What tools are used to write technical documentation?

Docs-as-code stacks typically combine Markdown or MDX in Git, a static or platform-based renderer, Vale for prose
linting, Spectral for OpenAPI linting, and a CI pipeline that runs all of it on pull requests. Diagramming usually
happens in Mermaid or a design tool, and screenshots are best avoided in favor of code samples that can be tested. For
API-heavy documentation, the generator matters more than the editor, because it determines whether reference content can
drift.

### How do you keep technical documentation from becoming outdated?

Generate everything that can be generated, and put automated checks on the rest. Reference content derived from the API
definition updates with the spec. For hand-written content, schedule review by ownership rather than by calendar: assign
each section an owner, trigger review when the related code changes, and use CI to catch broken links, style violations,
and spec
drift. [Ongoing documentation maintenance](https://buildwithfern.com/post/documentation-maintenance-best-practices) is a
process problem more than a writing problem.

August 7, 2026

DEV

TrailLineFern

Products

[DocsBeautiful, customizable documentation websites.](https://buildwithfern.com/docs) [SDKsClient libraries designed by language experts.](https://buildwithfern.com/sdks) [CLIInteract with your API from the terminal.](https://buildwithfern.com/cli)

Resources

[DocumentationLearn how to use Fern](https://buildwithfern.com/learn) [CareersWe're hiring](https://buildwithfern.com/careers) [Trust centerSOC 2 compliant and secure](https://buildwithfern.com/trust) [Get your Agent-readiness score](https://buildwithfern.com/agent-score)

[Customers](https://buildwithfern.com/customers) [Blog](https://buildwithfern.com/blog) [Pricing](https://buildwithfern.com/pricing)

[Start for free](https://dashboard.buildwithfern.com/sign-up?redirect_on_login=%2Fget-started&utm_source=fern-website&utm_content=nav-mobile-footer)