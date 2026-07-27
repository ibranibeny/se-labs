# Major Growth SE — Asset Portal

A single access point to **Major Growth Solution Engineering** assets — demos,
hands-on workshops, and reference architectures — presented as a **filterable
catalog** mapped to the **FY27 GTM framework**. Built so that AEs and DES can
quickly discover which SE assets exist to accelerate a deal.

🔗 **Live site:** https://ibranibeny.github.io/se-labs/

## Stack

- **React 19 + TypeScript + Vite** (single-page app, hash routing)
- **Tailwind CSS v4** for styling
- **react-markdown + Mermaid + highlight.js** to render lab content
- Published to **GitHub Pages** via GitHub Actions

## How it works

Assets and their step-by-step labs are plain Markdown files with YAML frontmatter:

```
src/content/modules/   # catalog assets (a workshop, demo, etc.)
src/content/labs/      # ordered steps within a workshop asset
src/data/taxonomy.ts   # the GTM vocabulary the catalog filters against
src/generated/         # catalog-index.json (metadata, auto-generated)
```

A build step (`scripts/build-index.mjs`, run automatically before `dev`/`build`)
parses the frontmatter into a lightweight metadata index. The catalog landing
loads only that index; Markdown bodies load lazily per page, so the landing stays
fast as the catalog grows.

### Filter facets (GTM taxonomy)

- **Conversation** — the 8 FY27 conversations, grouped **Frontier** / **Core**
- **Solution Area** — Cloud & AI Platforms (CAIP), AI Business Solutions (ABS), Security
- **Asset Type** — Workshop, Demo, Reference Architecture, Case Study
- **Technical Level** — L100–L500
- **Product / Technology** — e.g. Azure Arc, AKS, Foundry

Filters combine as AND across facets / OR within a facet, and are stored in the
URL query string so any filtered view is shareable and deep-linkable.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173/se-labs/
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Adding a new asset

1. Create `src/content/modules/<slug>.md` with frontmatter. Alongside the existing
   fields (`title`, `slug`, `excerpt`, `level_range`, `order`, `icon`, `color`), set
   the GTM taxonomy:
   ```yaml
   conversations: [ubiquitous-innovation]      # ids from src/data/taxonomy.ts
   solution_areas: [CAIP]                       # CAIP | ABS | Security
   asset_type: "Demo"                           # Workshop | Demo | Reference Architecture | Case Study
   products: [Azure AI Foundry, GitHub Copilot]
   ```
2. (Optional) Add step files to `src/content/labs/` with `module: <slug>` in their
   frontmatter to build a hands-on path.
3. Run `npm run dev` — the metadata index regenerates and the asset appears in the
   catalog automatically.

To re-tag an existing asset, edit its `conversations` / `solution_areas` /
`asset_type` / `products` frontmatter in `src/content/modules/<slug>.md`.

> **Maintainers:** for a guided walkthrough — full frontmatter schema, the GTM
> taxonomy vocabulary, the draft/external-link pattern, and copy-paste templates —
> use the **onboard-asset** skill in [`.github/skills/onboard-asset/`](.github/skills/onboard-asset/SKILL.md).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and
publishes `dist/` to GitHub Pages. In the repository **Settings → Pages**, set the
source to **GitHub Actions**.

The Vite `base` is `/se-labs/` (see `vite.config.ts`); update it if the repository
is renamed.

## Attribution

Technical content grounded in [Microsoft Learn](https://learn.microsoft.com/).
Diagrams © Microsoft, linked from Microsoft Learn.
