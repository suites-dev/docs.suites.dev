---
sidebar_position: 6
title: Changelog
description: Version history and release notes for Suites
---

# Changelog

All notable changes to Suites are documented here. For the complete version history, visit our [GitHub Releases](https://github.com/suites-dev/suites/releases).

---

## January 2, 2025

### 🐛 Bug Fixes in v3.0.1

We've released a patch update addressing several dependency and type resolution issues reported by the community.

**What's Fixed:**
- ✅ Resolved `reflect-metadata` peer dependency conflicts affecting InversifyJS and NestJS adapters
- ✅ Fixed missing return statement when instantiating exposed classes
- ✅ Corrected InversifyJS interface imports to properly use type imports
- ✅ Cleaned up redundant imports across Jest, Vitest, and Sinon packages

This release ensures smoother integration with popular DI frameworks and reduces TypeScript configuration friction.

[View full release notes →](https://github.com/suites-dev/suites/releases/tag/v3.0.1)

---

## July 13, 2024

### 🎉 Suites v3.0.0

We're incredibly excited to announce **Suites v3.0.0**, marking the official evolution from Automock to Suites. This
major release represents a significant milestone in the project's journey.

#### 📜 From Automock to Suites

Suites was previously known as **Automock** through version `2.x`. Starting with version `3.0.0`, the project has been
rebranded to Suites while maintaining the same powerful foundations and principles. Automock will continue to receive
critical bug fixes, but all new features and development efforts are now focused on Suites.

#### ⚡ What's New

**Sociable Testing Support**
```typescript
// New .sociable() method for flexible unit testing
const { unit } = await TestBed.solitary(UserService).compile();
const { unit } = await TestBed.sociable(UserService).compile();
```

**Modern Framework Support**
- 🧪 Official Vitest adapter for Vue and React ecosystems
- 📦 Full ES Module (ESM) support
- 🔄 Unified imports through `@suites/unit` regardless of test framework

**Enhanced Type Safety**
```typescript
// New Mocked type with deep property mocking
const mockRepo: Mocked<UserRepository> = unitRef.get(UserRepository);
```

#### 💥 Breaking Changes

This is a major version with important API changes:

**Async Compilation Required**
```typescript
// ❌ Old (v2.x)
const { unit } = TestBed.create(UserService).compile();

// ✅ New (v3.x)
const { unit } = await TestBed.solitary(UserService).compile();
```

**Method Renaming**
- `TestBed.create()` → `TestBed.solitary()`
- `.mock.using()` → `.mock.impl()`

**Migration Support**

We've prepared comprehensive migration guides to help you upgrade smoothly:
- [Migration from Automock →](/docs/migration-guides/from-automock)
- Migration tool development in progress

[View full release notes →](https://github.com/suites-dev/suites/releases/tag/v3.0.0)

---

## Earlier History: Automock (2022-2023)

Before becoming Suites at `v3.0.0`, the project was developed as **Automock** from `v1.0.0` through `v2.x`. During this period, the foundational architecture was established:

- **`v2.1.0`** (Dec 2023) — InversifyJS adapter support
- **`v2.0.0`** (Nov 2022) — Native mocking implementation, Node.js v16+ requirement
- **`v1.x series`** (2022) — Property injection support, enhanced dependency resolution

The transition to Suites represented a rebranding and modernization while preserving the core testing philosophy and architectural foundations built during the Automock era.

[View complete Automock release history →](https://github.com/suites-dev/suites/releases?q=v2&expanded=true)

---

## Version Support

| Version           | Status                 | Released  | Support Until |
|-------------------|------------------------|-----------|---------------|
| `v3.0.x`          | 🟢 Stable              | July 2024 | June 2026     |
| `v2.x` (Automock) | ⚠️ Critical fixes only | Nov 2022  | June 2025     |

**Support Policy:**
- Stable versions receive security patches and critical bug fixes
- Migration guides provided for all major version upgrades
- Community support available through [GitHub Discussions](https://github.com/suites-dev/suites/discussions)

## Get Involved

We're grateful to our growing community of contributors and users. Your feedback shapes Suites' development.

- 🐛 [Report issues](https://github.com/suites-dev/suites/issues)
- 💡 [Request features](https://github.com/suites-dev/suites/discussions)
- 📖 [Improve documentation](https://github.com/suites-dev/suites.dev)
- ⭐ [Star us on GitHub](https://github.com/suites-dev/suites)
