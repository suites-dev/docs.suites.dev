---
sidebar_position: 2
title: Dependency Injection Adapters
---

# Dependency Injection Adapters

## Understanding Adapters 🧠

Suites' core strength lies in its consistent approach to automating mock object creation. However, the
diverse landscape of Dependency Injection frameworks, each with its unique characteristics, presents a challenge. To
address this, Suites introduces the concept of "Adapters."

Suites Adapters are specialized connectors designed for different DI frameworks. They ensure seamless
integration, optimal performance, and a unified testing experience across various environments. Whether it's the differences
in how dependencies are registered, the methods of resolution, or the specific annotations and decorators unique to a
framework, Suites Adapters handle these details for you.

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
            <td colspan="3" align="center">Coming Soon 🚀</td>
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

## How Adapters Work 💡

Suites adapters work by:

1. **Analyzing Metadata** - Reading the dependency metadata from your classes
2. **Creating Virtual Containers** - Building lightweight container representations
3. **Mapping Dependencies** - Connecting your code's dependencies to test doubles
4. **Providing Type Safety** - Ensuring type-safe access to mocked dependencies

This process is most effective when your application code adheres to [established principles for testable design](../design-for-testability/index.md), particularly around how dependencies are declared and injected.

This approach allows Suites to provide a consistent API regardless of which DI framework you're using, while still respecting the specific characteristics of each framework.

<div class="next-steps-section">

## Next Steps

- [**Identifiers & Injection Tokens**](/docs/developer-guide/adapters/identifiers) - Learn how to work with different types of dependency identifiers
- [**InversifyJS Guide**](/docs/developer-guide/adapters/inversifyjs) - Special considerations for InversifyJS
- [**Installation**](/docs/overview/installation/) - Set up Suites with your preferred DI framework and testing library

</div>
