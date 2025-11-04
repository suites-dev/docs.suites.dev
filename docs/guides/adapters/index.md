---
sidebar_position: 7
title: DI Adapters
description: Framework adapters for NestJS and InversifyJS
---

# Adapters

## What Are Adapters?

Suites works with different DI frameworks through adapters. Each adapter handles framework-specific metadata, injection patterns, and decorators.

<div class="in-this-section">

### What You'll Find in This Section

- **Adapters Overview** - Learn how Suites bridges different DI frameworks
- **Identifiers & Injection Tokens** - Understand how to work with various dependency identifiers
- **Framework-Specific Guides** - Detailed information for each supported DI framework

</div>

## Supported DI Frameworks

Suites currently supports the following Dependency Injection frameworks:

<table>
    <thead>
        <tr>
            <th>DI Framework Adapter</th>
            <th>Jest (<code>@suites/doubles.jest</code>)</th>
            <th>Sinon (<code>@suites/doubles.sinon</code>)</th>
            <th>Vitest (<code>@suites/doubles.vitest</code>)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>NestJS (<code>@suites/di.nestjs</code>)</strong></td>
            <td>✅</td>
            <td>✅</td>
            <td>✅</td>
        </tr>
        <tr>
            <td><strong>InversifyJS (<code>@suites/di.inversify</code>)</strong></td>
            <td>✅</td>
            <td>✅</td>
            <td>✅</td>
        </tr>
        <tr>
            <td><strong>TSyringe (<code>@suites/di.tsyringe</code>)</strong></td>
            <td colspan="3" align="center">Coming Soon </td>
        </tr>
        <tr>
            <td><strong>Ts.ED (<code>@suites/di.tsed</code>)</strong></td>
            <td align="center" colspan="3">Contributions Welcome 🙏</td>
        </tr>
        <tr>
            <td><strong>TypeDI (<code>@suites/di.typedi</code>)</strong></td>
            <td align="center" colspan="3">Contributions Welcome 🙏</td>
        </tr>
    </tbody>
</table>

## How Adapters Work

Adapters read DI metadata from your classes and create lightweight virtual containers. This provides a consistent API across frameworks while respecting framework-specific features.

<div class="next-steps-section">

## Next Steps

- [**Identifiers & Injection Tokens**](/docs/guides/adapters/identifiers) - Learn how to work with different types of dependency identifiers
- [**InversifyJS Guide**](/docs/guides/adapters/inversifyjs) - Special considerations for InversifyJS
- [**Installation**](/docs/get-started/installation/) - Set up Suites with your preferred DI framework and testing library

</div>
