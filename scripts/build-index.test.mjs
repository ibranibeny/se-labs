import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BUILD_INDEX = path.join(ROOT, 'scripts', 'build-index.mjs');
const CATALOG_INDEX = path.join(ROOT, 'src', 'generated', 'catalog-index.json');

async function buildIndexAndReadModules() {
  execFileSync(process.execPath, [BUILD_INDEX], {
    cwd: ROOT,
    stdio: 'pipe',
  });

  const catalog = JSON.parse(await readFile(CATALOG_INDEX, 'utf8'));
  return catalog.modules;
}

function getModule(modules, slug) {
  const moduleEntry = modules.find((item) => item.slug === slug);
  assert.ok(moduleEntry, `Expected module ${slug} to exist in catalog-index.json`);
  return moduleEntry;
}

test('build-index derives levels for external assets from level_range', async () => {
  const modules = await buildIndexAndReadModules();

  assert.deepStrictEqual(getModule(modules, 'azure-localbox-deployment-guide').levels, [300, 400]);
  assert.deepStrictEqual(getModule(modules, 'apim-aca-openai-workshop').levels, [400]);
  assert.deepStrictEqual(getModule(modules, 'foundry-agent-service-portal').levels, [100, 200, 300]);
});
