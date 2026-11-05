import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { esmDependencies } from '../scripts/esm-dependencies.mjs';

test('uses renderer dependencies despite a legacy host copy and preserves CommonJS loading', t => {
  const root = mkdtempSync(join(tmpdir(), 'suites-renderer-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  function pkg(relative, name, type, dependencies = {}) {
    const directory = join(root, 'node_modules', relative);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, 'package.json'), JSON.stringify({ name, type, main: 'index.js', dependencies }));
    writeFileSync(join(directory, 'index.js'), type === 'module' ? 'export default {};' : 'module.exports = {};');
  }
  pkg('renderer', 'renderer', 'module', { helper: '*', common: '*' });
  pkg('helper', 'helper', 'commonjs');
  pkg('renderer/node_modules/helper', 'helper', 'module');
  pkg('renderer/node_modules/common', 'common', 'commonjs', { leaf: '*' });
  pkg('renderer/node_modules/leaf', 'leaf', 'module');
  const actual = esmDependencies('renderer', pathToFileURL(join(root, 'config.mjs')));
  assert.deepEqual(new Set(actual), new Set(['renderer', 'helper', 'leaf']));
  assert.ok(!actual.includes('common'));
});
