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
  assert.deepStrictEqual(
    getModule(modules, 'explore-the-schema-optimize-in-ssms-using-github-copilot').levels,
    [300],
  );
  assert.deepStrictEqual(
    getModule(modules, 'content-understanding-build-a-document-app-that-can-explain-itself').levels,
    [400],
  );
  assert.deepStrictEqual(getModule(modules, 'foundry-agent-service-portal').levels, [100, 200, 300]);
});

test('build-index includes Fabric NL2GQL as an external L400 workshop', async () => {
  const modules = await buildIndexAndReadModules();
  const asset = getModule(modules, 'fabric-nl2gql');

  assert.equal(asset.title, 'Fabric NL2GQL');
  assert.equal(asset.assetType, 'Workshop');
  assert.equal(asset.draft, true);
  assert.equal(asset.externalUrl, 'https://ibranibeny.github.io/fabric-nl2gql-demo/');
  assert.equal(asset.sourceSite, asset.externalUrl);
  assert.equal(asset.sourceRepo, 'https://github.com/ibranibeny/fabric-nl2gql-demo');
  assert.deepStrictEqual(asset.levels, [400]);
  assert.deepStrictEqual(asset.solutionAreas, ['CAIP']);
  assert.deepStrictEqual(asset.conversations, ['unified-data-ai-estate', 'ubiquitous-innovation']);
  assert.ok(asset.products.includes('Microsoft Fabric'));
  assert.deepStrictEqual(asset.labSlugs, []);
});

test('build-index includes Understanding the Agent Harness as an external workshop', async () => {
  const modules = await buildIndexAndReadModules();
  const asset = getModule(modules, 'understanding-the-agent-harness');

  assert.equal(asset.title, 'Workshop: Understanding the Agent Harness');
  assert.equal(asset.assetType, 'Workshop');
  assert.equal(asset.externalUrl, 'https://ibranibeny.github.io/agent-harness-workshop/');
  assert.equal(asset.sourceSite, asset.externalUrl);
  assert.equal(asset.sourceRepo, 'https://github.com/ibranibeny/agent-harness-workshop');
  assert.equal(asset.durationTotal, '150 minutes + optional 60-minute L400 extension');
  assert.deepStrictEqual(asset.levels, [400]);
  assert.deepStrictEqual(asset.solutionAreas, ['CAIP']);
  assert.deepStrictEqual(asset.conversations, ['ubiquitous-innovation', 'trusted-secure-platform']);
  assert.ok(asset.products.includes('Microsoft Foundry'));
  assert.deepStrictEqual(asset.labSlugs, []);
});

test('build-index includes Fabric inbound and outbound private networking demo', async () => {
  const modules = await buildIndexAndReadModules();
  const asset = getModule(modules, 'fabric-inbound-outbound-private-networking');

  assert.equal(asset.title, 'Fabric inbound & outbound private networking');
  assert.equal(asset.assetType, 'Demo');
  assert.equal(asset.sourceSite, 'https://ibranibeny.github.io/workshops/fabric-private-networking-l400/');
  assert.equal(asset.durationTotal, '~4 hours');
  assert.deepStrictEqual(asset.levels, [400]);
  assert.deepStrictEqual(asset.solutionAreas, ['CAIP']);
  assert.deepStrictEqual(asset.conversations, [
    'ubiquitous-innovation',
    'amplify-intelligence',
    'modernize-confidence',
    'unified-data-ai-estate',
  ]);
  assert.deepStrictEqual(asset.products, ['Fabric', 'Private Endpoint', 'VM', 'SQL Server', 'Workspace']);
  assert.deepStrictEqual(asset.labSlugs, []);
});

test('build-index includes the Content Processing tower inspection demo', async () => {
  const modules = await buildIndexAndReadModules();
  const asset = getModule(modules, 'content-processing-tower-inspection');

  assert.equal(asset.title, 'Content Processing Gold Standard — Tower Inspection extension');
  assert.equal(asset.assetType, 'Demo');
  assert.equal(asset.order, 28);
  assert.equal(asset.durationTotal, '~2 hours');
  assert.deepStrictEqual(asset.levels, [300]);
  assert.deepStrictEqual(asset.solutionAreas, ['CAIP']);
  assert.deepStrictEqual(asset.conversations, ['amplify-intelligence', 'agentify-processes']);
  assert.deepStrictEqual(asset.products, [
    'Azure AI Content Understanding',
    'Azure AI Foundry',
    'GPT-5.1',
    'Azure Container Apps',
    'Azure Cosmos DB',
    'Azure Storage',
    'Azure Developer CLI',
  ]);
  assert.deepStrictEqual(asset.labSlugs, []);
});
