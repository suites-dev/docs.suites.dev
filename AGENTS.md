# Instructions for `docs`

## Writing Style

### Voice and Tone

- Use **direct, active voice**
- Use **second person** ("you") for instructions
- Use **third person** for descriptions and explanations
- Be **confident but not condescending**
- Be **technical but accessible** to developers new to the concepts
- Be **concise** — avoid unnecessary words

**Good:**

```markdown
Suites automatically creates mocks for all dependencies.
```

**Avoid:**

```markdown
What Suites will do is it will automatically go ahead and create mocks for all of the dependencies that exist.
```

### Paragraph Structure

- Keep paragraphs short: **1-3 sentences**
- Use **bold text** for emphasis and key terms
- Use **lists** for multiple items (avoid inline lists in prose)
- Break up wall of text with subheadings

### Terminology (Use Consistently)

| Term                | Definition                                                    |
| ------------------- | ------------------------------------------------------------- |
| **Solitary test**   | A unit test where all dependencies are mocked                 |
| **Sociable test**   | A unit test where selected dependencies are real              |
| **Mock**            | A fake replacement of an entire class (all methods are stubs) |
| **Stub**            | A single method that returns predefined values                |
| **Test double**     | General term for mocks, stubs, spies, fakes                   |
| **Unit**            | The class under test                                          |
| **Dependency**      | A collaborator object that a component needs                  |
| **Token injection** | Dependencies injected using `@Inject('TOKEN')`                |

**First usage:** Bold the term and provide a brief definition.

## Callouts (Admonitions)

Use sparingly and appropriately:

```markdown
:::tip Framework Flexibility
Brief helpful suggestion or best practice.
:::

:::info Why This Matters
Supplementary background information.
:::

:::note Common Pitfall
Important clarification or warning.
:::
```

**Guidelines:**

- Don't overuse — maximum 2-3 per page
- Keep content brief (1-3 sentences)
- Use descriptive titles when helpful
- `:::tip` — Best practices, suggestions
- `:::info` — Background context, "why" explanations
- `:::note` — Important clarifications, caveats

## Tables

Use tables for:

- Parameter documentation
- Feature comparisons
- Quick references
- Terminology definitions

```markdown
| Parameter     | Type      | Description                   |
| ------------- | --------- | ----------------------------- |
| `targetClass` | `Type<T>` | The class constructor to test |
```

## Links and Navigation

### Internal Links

Use absolute paths from docs root:

```markdown
[Solitary Guide](/docs/guides/solitary)
[Installation](/docs/get-started/installation)
```

### External Links

Use descriptive link text:

```markdown
[Suites Examples Repository](https://github.com/suites-dev/examples)
[Martin Fowler's article on test doubles](https://martinfowler.com/bliki/TestDouble.html)
```

### Navigation Sections

**"In This Section" (for index pages):**

```markdown
<div class="in-this-section">

### In This Section

- [**Topic One**](/path) - Brief description
- [**Topic Two**](/path) - Brief description

</div>
```

**"Next Steps" or "What's Next?" (at page end):**

```markdown
## Next Steps

- **[Solitary Unit Tests](/docs/guides/solitary)**: Test components in complete isolation
- **[Sociable Unit Tests](/docs/guides/sociable)**: Test with real dependencies
```

**"Additional Resources" (external links):**

```markdown
## Additional Resources

- **[Suites Examples Repository](https://github.com/suites-dev/examples)**: Working code examples
- **[GitHub Discussions](https://github.com/suites-dev/suites/discussions)**: Community support
```

**"See Also" (for API reference):**

```markdown
## See Also

- [TestBed.sociable()](/docs/api-reference/testbed-sociable) - Test with real dependencies
- [UnitReference](/docs/api-reference/unit-reference) - Accessing mocked dependencies
```

## Summary Sections

End guides with a summary:

```markdown
## Summary

- **Solitary tests** evaluate a single unit in complete isolation
- **Automatic mocking** with `TestBed.solitary()` eliminates manual setup
- **Type safety** with `Mocked<T>` ensures proper typing
```

Or use "Takeaways":

```markdown
### Takeaways

- Point one about what the reader learned
- Point two with actionable insight
- Point three summarizing key concept
```

## Formatting Conventions

### Inline Code

Use backticks for:

- Method names: `TestBed.solitary()`
- Class names: `UserService`
- Package names: `@suites/unit`
- File names: `user.service.ts`
- Tokens: `'DATABASE'`

### Bold Text

Use for:

- Key terms on first introduction
- Emphasis in explanations
- Labels in lists (e.g., "**Good:**", "**Avoid:**")

### Lists

- Use **bullet points** for unordered items
- Use **numbered lists** for sequential steps or ordered items
- Keep list items parallel in structure

## Content Principles

### Be Practical

- Lead with working code examples
- Show real-world use cases
- Avoid abstract explanations without concrete examples

### Be Scannable

- Use clear headings that describe content
- Break up long sections
- Put key information at the start of paragraphs

### Be Complete

- Include all necessary imports in code examples
- Show expected output when relevant
- Link to prerequisites and related content

### Be Consistent

- Use the same terminology throughout
- Follow the same patterns across similar documents
- Match the structure of existing documentation
