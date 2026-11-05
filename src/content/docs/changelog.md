---
sidebar_position: 6
title: Suites Unit Changelog
description: Version history and release notes for Suites Unit
---

All notable changes to Suites Unit are documented here. For the complete version history, visit our [GitHub Releases](https://github.com/suites-dev/unit/releases).

---

## November 5, 2026

### Suites Unit v4.1.2

Suites Unit 4.1.2 fixes TypeScript errors when abstract classes are used as dependency tokens. You can pass an abstract class directly to `.mock()` and `unitRef.get()` without a constructor cast, with inferred Jest or Vitest mock types.

- Accepts abstract dependency tokens in mock lookups, `.impl()` mock configuration, and `.final()` supplied values across NestJS, Inversify, and InjectionJS.
- Preserves Inversify named and tagged metadata when configuring or retrieving an abstract-token dependency.
- Adds `AbstractType<T>` to `@suites/types.common` for abstract or concrete class tokens. `Type<T>` continues to represent concrete constructors.
- Keeps `TestBed.solitary()`, `TestBed.sociable()`, and `.expose()` restricted to concrete classes because Suites Unit instantiates them.
- Adds abstract-token E2E coverage across all ten adapter/runner fixtures on Node.js 22, 24, and 26, including the CommonJS and ESM configurations.
- Updates the NestJS and Inversify adapters to `4.0.3`, InjectionJS to `4.1.2`, and `@suites/types.doubles` to `4.0.2` for shared type dependencies. Supported framework and Node.js versions are unchanged.

Update `@suites/unit`, your DI adapter, and your doubles adapter together.

[Full v4.1.2 release notes →](https://github.com/suites-dev/unit/releases/tag/v4.1.2) · [Mock configuration →](/docs/api-reference/mock-configuration/) · [Dependency lookups →](/docs/api-reference/unit-reference/)

---

## November 5, 2026

### Suites Unit v4.1.0

Suites Unit 4.1 adds `@suites/di.injectionjs` for testing InjectionJS services with Jest or Vitest, in CommonJS and ESM.

- Supports constructor injection with class, string, symbol, and `InjectionToken` identifiers, plus `forwardRef()` and static constructor metadata.
- Preserves token identity in mock overrides and lookups: two tokens with the same description remain distinct.
- Adds `InjectableIdentifierRegistry<T>` so DI adapters can register dependency token types.
- Adds InjectionJS compatibility tests across Node.js 22, 24, and 26.
- Updates the NestJS and Inversify adapters to 4.0.1 for shared DI type dependencies; their supported framework versions are unchanged.

InjectionJS requires `injection-js` `^2.6.1`. Contextual `inject()` calls and production provider/container configuration are not supported. Vitest projects must externalize `injection-js` as described in the guide.

[InjectionJS guide →](/docs/guides/injectionjs/) · [Full v4.1.0 release notes →](https://github.com/suites-dev/unit/releases/tag/v4.1.0)

---

## November 4, 2026

### Suites Unit v4.0.0

Suites Unit 4 supports Node.js 22, 24, and 26, adds NestJS 12 and Inversify 8 support, and retains NestJS 10/11 and Inversify 7 compatibility. CommonJS and ESM remain supported.

**Breaking changes:**

- Requires Node.js `^22.22.2 || ^24.15.0 || ^26.0.0`.
- Removes postinstall declaration patching. Include one doubles `/unit` reference and one DI `/metadata` reference in your test TypeScript project.
- Requires matching Jest and `@jest/globals` versions in `^30.5.2`.
- Drops NestJS 8/9, Inversify 6, and the unmaintained Sinon adapter.
- Makes NestJS metadata arguments invalid when the NestJS metadata augmentation is loaded.

**Other changes:**

- Inversify supports symbol properties and combined named/tagged metadata.
- All nine active Unit packages were released at `4.0.0`.
- The repository uses Node 26, pnpm 12, and TypeScript 6. Consumer projects can keep their package manager.
- Release E2E tests cover 96 compatibility combinations across Node 22/24/26 and supported NestJS/Inversify majors.

[Upgrade from Suites Unit 3 →](/docs/migration-guides/from-v3/) · [Full v4.0.0 release notes →](https://github.com/suites-dev/unit/releases/tag/v4.0.0)

---

## May 8, 2026

### Suites Unit v3.1.1

This hotfix resolves `TS2300: Duplicate identifier` errors for `Mocked` and `Stub` when `skipLibCheck` is `false`. It removes duplicate direct exports from `@suites/unit`, leaving the adapters' module augmentations as the source of these types. You can still import both types from `@suites/unit`.

Only `@suites/unit` was updated to `3.1.1`; the other packages remained at `3.1.0`.

[View full release notes →](https://github.com/suites-dev/unit/releases/tag/v3.1.1)

---

## May 5, 2026

### Suites Unit v3.1.0

This release fixes ESM output by adding missing `.js` extensions, restores Vitest 4 compatibility, and corrects `Mocked<T>` resolution with `moduleResolution: NodeNext`. It also fixes missing internal dependencies, removes the Inversify adapter's lodash dependency, and adds package READMEs and public API documentation.

If using this release with `skipLibCheck: false`, update `@suites/unit` to `3.1.1` for the duplicate-type fix described above.

[View full release notes →](https://github.com/suites-dev/unit/releases/tag/v3.1.0)

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

[View full release notes →](https://github.com/suites-dev/unit/releases/tag/v3.0.1)

---

## July 13, 2024

### 🎉 Suites Unit v3.0.0

We're incredibly excited to announce **Suites Unit v3.0.0**, marking the official evolution from Automock to Suites Unit. This
major release represents a significant milestone in the project's journey.

#### 📜 From Automock to Suites Unit

Suites Unit was previously known as **Automock** through version `2.x`. Starting with version `3.0.0`, the project has been
rebranded to Suites Unit while maintaining the same powerful foundations and principles. Automock continued to receive critical fixes during the transition. Its maintenance ended on June 30, 2026; new development continues in Suites Unit.

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
- [Migration from Automock →](/docs/migration-guides/from-automock/)
- [Automock codemod](https://github.com/suites-dev/codemod) (now available)

[View full release notes →](https://github.com/suites-dev/unit/releases/tag/v3.0.0)

---

## Earlier History: Automock (2022-2023)

Before becoming Suites Unit at `v3.0.0`, the project was developed as **Automock** from `v1.0.0` through `v2.x`. During this period, the foundational architecture was established:

- **`v2.1.0`** (Dec 2023): InversifyJS adapter support
- **`v2.0.0`** (Nov 2022): Native mocking implementation, Node.js v16+ requirement
- **`v1.x series`** (2022): Property injection support, enhanced dependency resolution

The transition to Suites Unit represented a rebranding and modernization while preserving the core testing philosophy and architectural foundations built during the Automock era.

[View complete Automock release history →](https://github.com/suites-dev/unit/releases?q=v2&expanded=true)

---

## Version Support

These docs describe Suites Unit 4. Earlier Suites Unit releases remain available in [GitHub Releases](https://github.com/suites-dev/unit/releases). Automock 2.x is no longer maintained.

See [Installation](/docs/get-started/installation/#prerequisites) for supported runtime and framework versions, and [Migration Guides](/docs/migration-guides/) to upgrade.

## Get Involved

We're grateful to our growing community of contributors and users. Your feedback shapes the development of Suites Unit.

- 🐛 [Report issues](https://github.com/suites-dev/unit/issues)
- 💡 [Request features](https://github.com/suites-dev/unit/discussions)
- 📖 [Improve documentation](https://github.com/suites-dev/docs.suites.dev)
- ⭐ [Star us on GitHub](https://github.com/suites-dev/unit)
