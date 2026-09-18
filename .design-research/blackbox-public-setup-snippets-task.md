# Blackbox Public Setup Snippets Follow-up

Status: blocked on certified public interfaces and package-boundary support.

Replace the conceptual pseudocode in the four application-setup guides only after the corresponding public interface is certified and documented.

- [ ] Replace the Compose execution placeholder with the published invocation.
- [ ] Replace the Testcontainers pseudocode with the certified integration API.
- [ ] Replace the Dockerfile pseudocode when Dockerfile input becomes supported.
- [ ] Replace the distribution-artifact pseudocode when artifact input becomes supported.
- [ ] Verify every snippet in a packed external consumer.
- [ ] Update Alpha Support Status without implying support for adjacent configurations.

Affected pages:

- `src/content/docs/blackbox/guides/set-up-the-testbed.mdx`
- `src/content/docs/blackbox/guides/use-existing-compose.mdx`
- `src/content/docs/blackbox/guides/use-custom-provisioner.mdx`
- `src/content/docs/blackbox/guides/build-from-dockerfile.mdx`
- `src/content/docs/blackbox/guides/run-compiled-artifacts.mdx`
