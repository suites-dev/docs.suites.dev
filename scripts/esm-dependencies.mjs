import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

// Resolve from each package's own dependency graph, including pnpm links.
// CommonJS packages stay external so Astro's module runner can load them.
export function esmDependencies(name, from) {
  const bundled = new Set();
  const visited = new Set();
  const pending = [{ name, from }];
  while (pending.length) {
    const dependency = pending.pop();
    let entry;
    try { entry = createRequire(dependency.from).resolve(dependency.name); }
    catch { continue; } // Type-only packages have no executable entry point.
    let directory = dirname(entry);
    while (directory !== dirname(directory)) {
      const manifest = join(directory, 'package.json');
      if (existsSync(manifest)) {
        const data = JSON.parse(readFileSync(manifest, 'utf8'));
        if (data.name) {
          if (!visited.has(manifest)) {
            visited.add(manifest);
            if (data.type === 'module') bundled.add(data.name);
            for (const child of Object.keys(data.dependencies ?? {})) pending.push({ name: child, from: manifest });
          }
          break;
        }
      }
      directory = dirname(directory);
    }
  }
  return [...bundled];
}
