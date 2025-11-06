---
sidebar_position: 6
title: Changelog
description: Release notes and version history for Suites
---

# Changelog

## v4.0.0-beta.0 (Current - Testing)

:::warning Beta Release
v4.0.0 is in beta for testing. Applies alpha infrastructure improvements **plus** collaborate/exclude API and fail-fast behavior. All functionality will be backported to v3.1.0 soon.
:::

**From Alpha:**
- Type augmentation fixes for modern TypeScript
- NodeNext compatibility
- Node 20, 22, 24 support
- InversifyJS v7 support
- Dual CJS/ESM builds

**New in Beta:**

**`.collaborate()` + `.exclude()` API**
Natural collaboration strategy for sociable tests. Enable collaboration, then exclude specific classes.

```typescript
TestBed.sociable(OrderService)
  .collaborate()
  .exclude([ComplexTaxEngine])  // Exclude from collaboration
  .compile();
```

**Why collaborate + exclude:**
- **Refactoring stable**: Adding dependencies doesn't break tests
- **Natural mental model**: Think collaboration, not avoidance
- **Future-proof**: New dependencies auto-collaborate
- **Clear intent**: "Exclude" is more intuitive than "boundaries"
- Tokens always auto-mocked (databases, HTTP)

**The refactoring stability advantage:**

When you add new dependencies to your production code (e.g., adding a `Logger` or `ValidationService`), tests using `.collaborate()` continue to work because new dependencies automatically join the collaboration. You only need to `.exclude()` specific expensive or external services.

This is more stable than "leaf-based" strategies where adding intermediate dependencies can break tests because the graph structure changed.

See [TestBed.sociable()](/docs/api-reference/testbed-sociable) for complete API details and [Sociable Tests Guide](/docs/guides/sociable) for examples.

**Fail-Fast Behavior**
Enabled by default. Throws `DependencyNotConfiguredError` on unconfigured dependencies. Prevents false positives.

**Migration helper:**
```typescript
.failFast({ enabled: false })  // Restore v3.x behavior (deprecated)
```

See [Fail-Fast Behavior](/docs/api-reference/fail-fast) for details and migration strategies.

### Installation

```bash
# Core package (beta)
npm install @suites/unit@beta

# DI adapters (alpha - no collaborate/exclude or fail-fast changes)
npm install @suites/di.nestjs@alpha
# or
npm install @suites/di.inversify@alpha

# Doubles adapters (beta)
npm install @suites/doubles.jest@beta
# or
npm install @suites/doubles.vitest@beta
# or
npm install @suites/doubles.sinon@beta
```

:::tip Why Different Versions?
`@suites/unit` and doubles adapters are on **beta** (collaborate/exclude + fail-fast features). DI adapters remain on **alpha** - they're installed separately and don't contain the new testing logic.
:::

**Breaking Changes:**
- Node 20+ required (was 16+)
- InversifyJS v7 required (was v6)
- Manual `global.d.ts` setup needed (postinstall scripts removed)

See [Installation Guide](/docs/get-started/installation) for setup instructions.

[Full Beta Release Notes →](https://github.com/suites-dev/suites/releases/tag/4.0.0-beta.0)

---

## Upcoming: v3.1.0

:::info Coming Soon
All v4.0.0 features will be backported to v3.1.0 with no breaking changes. This allows gradual adoption of new features.
:::

**What's coming:**
- `.collaborate()` + `.exclude()` API (opt-in)
- Fail-fast behavior (disabled by default, opt-in with <code>.failFast(\{ enabled: true \})</code>)
- Enhanced type safety
- Performance improvements

**Migration preparation:** v3.1.0 will have fail-fast **disabled by default** but available via <code>.failFast(\{ enabled: true \})</code>. This lets you test and prepare for v4.0.0 where it becomes the default.

**Timeline:** Testing in alpha, release soon.

---

## Current Stable: v3.0.x

The current production-ready version. Includes:
- TestBed.solitary() and TestBed.sociable()
- .expose() for sociable tests
- .mock().final() and .mock().impl()
- NestJS and InversifyJS support
- Jest, Vitest, and Sinon adapters

See [Migration Guide](/docs/migration-guides/from-automock) if upgrading from Automock.

---

## Complete Version History

For detailed release notes, breaking changes, and migration guides:

**[View All Releases on GitHub →](https://github.com/suites-dev/suites/releases)**

Includes:
- Detailed changelogs
- Breaking change guides
- Migration instructions
- Bug fixes and improvements