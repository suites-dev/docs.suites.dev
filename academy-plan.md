# Suites Academy Content Enhancement Plan

This document outlines the plan for reviewing, enhancing, and expanding the Suites Academy materials to provide deep, valuable content for developers, focusing on the "why and when" of testable design principles and expert strategies, drawing inspiration from `cursor_rules_for_unit_testing.md`.

## I. Revised Core Tenets for the Academy

The Academy will be structured around the following six core tenets. Each tenet card on the main Academy page (`suites.dev/src/pages/academy/index.js`) will link to a dedicated Markdown file in the `suites.dev/academy/` directory.

1.  **Unit Clarity & Responsibility**
    *   **File:** `unit-clarity-responsibility.md`
    *   **Focus:** SRP, encapsulation, API design, refactoring to avoid private method testing.
2.  **Dependencies & Side Effects**
    *   **File:** `dependencies-side-effects.md`
    *   **Focus:** "Inject Everything" mantra, DI, managing side effects, minimal constructor work, learning from the "geo-location/impossible branch" example.
3.  **Code Structure & Simplicity**
    *   **File:** `code-structure-simplicity.md`
    *   **Focus:** Simplifying complex logic, taming messy branching, composition, pure functions, strategies for reducing cyclomatic complexity.
4.  **Boundaries & Interactions**
    *   **File:** `boundaries-interactions.md`
    *   **Focus:** Isolating I/O and external calls (including logical ones) using Adapters/Gateways, Dependency Inversion Principle.
5.  **Defensive Coding & Test Maintenance**
    *   **File:** `defensive-coding-maintenance.md`
    *   **Focus:** Robust inputs, error handling (including specific error types), test organization, avoiding pitfalls like test-only conditionals or exposing internals.
6.  **Refactoring for Testability**
    *   **File:** `refactoring-for-testability.md` (NEW FILE TO BE CREATED)
    *   **Focus:** Recognizing code smells impacting testability, common refactoring patterns for improvement, and how Suites benefits from well-refactored code. Case studies like the "Impossible Branch" will be central here.

## II. Review and Enhancement Plan for Existing Academy Materials

General approach for each existing `.md` file:
*   Ensure strong alignment with its revised core tenet.
*   Deepen content by integrating relevant principles, examples, and "expert strategies" from `cursor_rules_for_unit_testing.md`.
*   Emphasize the "why and when" beyond just the "what and how."
*   Strengthen interlinks between Academy articles for a cohesive learning path.
*   Ensure a consistent, authoritative tone suitable for an expert academy.

### A. `unit-clarity-responsibility.md` Enhancements:
*   Expand SRP and Limit Dependencies examples to show more "before/after" code and the resulting simplification in Suites test setup.
*   Add a dedicated subsection: "The Private Method Pitfall: Why SRP is the Answer," explaining how decomposition resolves the desire to test private methods.

### B. `dependencies-side-effects.md` Enhancements:
*   Add a subsection: "The 'Inject Everything' Imperative: Learning from the 'Impossible Branch'" using a condensed version of the geo-location example from `cursor_rules.md` to illustrate the criticality of injecting all logical dependencies.
*   Briefly mention the "Limit Constructor Dependencies" heuristic (e.g., >5 is a smell) and its relation to SRP.

### C. `code-structure-simplicity.md` Enhancements:
*   In "Limit Cyclomatic Complexity," add a subsection on "Strategies for Reducing Complexity," briefly mentioning guard clauses and the Strategy pattern (from `cursor_rules.md`).
*   In "Beware Branching with Private Methods," reinforce that extracting complex private logic into new, testable collaborators is key.

### D. `boundaries-interactions.md` Enhancements:
*   Slightly elaborate on the Dependency Inversion Principle's role.
*   Consider adding a brief example/note about abstracting external *logical* dependencies (e.g., a third-party calculation library, referencing the geo-location idea) to show the broader applicability of the Adapter/Gateway pattern.

### E. `defensive-coding-maintenance.md` Enhancements:
*   In "Don't Expose Internals," add a sentence suggesting that wanting to test private details often signals a need for further decomposition.
*   In "Fail Fast," add a note encouraging the use of specific, custom error types for more precise error handling and testing.

## III. Creation of New Academy Material: `refactoring-for-testability.md`

This new module is crucial and will be a cornerstone of the Academy's advanced content.

*   **File:** `suites.dev/academy/refactoring-for-testability.md`
*   **Proposed Structure & Content (drawing heavily from `cursor_rules.for_unit_testing.md` Sections IV & VII, and other heuristic-violation examples):
    1.  **Introduction:** The importance of continuous refactoring for maintaining testability as codebases evolve. Link to how Suites thrives on well-designed code.
    2.  **Identifying Code Smells That Hinder Testability:**
        *   **The "Impossible Branch" Case Study:** (Detailed example from `cursor_rules.md`)
        *   Difficulty in Mocking Dependencies.
        *   Overly Complex Test Setup.
        *   The Urge to Test Private Methods.
        *   High Cyclomatic Complexity.
        *   Excessive Number of Dependencies.
        *   Test-Only Conditionals in Production Code.
    3.  **Key Refactoring Patterns for Testability:**
        *   **Extract Collaborator / Decompose Unit:** (For SRP, simplifying methods, making private logic public in a new unit). Provide examples.
        *   **Introduce Abstraction for External Dependencies (Adapter/Gateway):** (For I/O, external services, or complex external logic like `geo-tz`). Link to `boundaries-interactions.md`.
        *   **Replace Conditional Logic with Polymorphism (e.g., Strategy Pattern):** (To manage complex branching).
        *   **Lift State Up / Parameterize Behavior:** (To make functions purer or units more stateless).
    4.  **Refactoring Tests Alongside Code:** Best practices for updating Suites tests during refactoring (e.g., adapting mock setups, changing assertions).
    5.  **Conclusion:** Reinforce that refactoring for testability is an investment in code quality and developer productivity.

## IV. General Content Review Principles (from Web Search)

Across all Academy materials, adhere to best practices:
*   **Accuracy & Relevance:** Ensure all information is up-to-date, factually correct, and directly relevant to developers using Suites.
*   **Clarity & Readability:** Write in clear, concise language. Use examples effectively.
*   **Consistency:** Maintain a consistent tone, style, and terminology across all Academy pages.
*   **Audience Alignment:** Target developers looking for expert-level guidance on testable design with Suites.
*   **Actionability:** Provide clear takeaways and actionable advice.

This plan provides a roadmap for significantly enhancing the Suites Academy content, making it a go-to resource for mastering advanced testability concepts. 