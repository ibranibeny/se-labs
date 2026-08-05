# Major Growth SE — Asset Portal

A single access point to **Major Growth Solution Engineering** assets — demos,
hands-on workshops, and reference architectures — presented as a **filterable
catalog** mapped to the **FY27 GTM framework**. Built so that AEs and DES can
quickly discover which SE assets exist to accelerate a deal.

🔗 **Live site:** deployed on **Azure Static Web Apps** (hybrid Next.js)

## Stack

- **Next.js (App Router) + React 19 + TypeScript** (SSR/SSG, real path routing)
- **Tailwind CSS v4** for styling
- **react-markdown + Mermaid + highlight.js** to render lab content
- A client-side **Submit an asset** flow prepares GitHub issues without app secrets
- Deployed to **Azure Static Web Apps** via GitHub Actions (per-PR preview environments)

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
loads only that index; Markdown bodies are read on the server per page (SSG), so
the landing stays fast as the catalog grows and detail pages stay crawlable.

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
npm run dev        # http://localhost:3000
npm run build      # production build (.next/)
npm start          # run the production server
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

## Deployment — Azure Static Web Apps

The app is a **hybrid Next.js** site (static catalog + server-rendered detail pages)
deployed to **Azure Static Web Apps**.

- `.github/workflows/azure-static-web-apps.yml` builds and deploys on push to `main`
  and creates a **preview environment for every pull request** — the reviewer sees the
  new asset card live before approving.
- Create the SWA resource and connect this repo; Azure provisions the
  `AZURE_STATIC_WEB_APPS_API_TOKEN` secret. Build settings: `app_location: "/"`,
  `output_location: ""` (Oryx detects Next.js).
- `next.config.mjs` sets `output: 'standalone'` to stay under the SWA 250 MB hybrid limit.

## Submit an asset via GitHub issue

`/submit` is a guided form (taxonomy-driven pickers, a live **card** preview, and a
Write/Preview **Markdown** preview). It validates the form in the browser and builds a
prefilled GitHub issue containing the proposed `src/content/modules/<slug>.md` file.

- Small submissions open directly on GitHub with the complete issue prefilled.
- Large submissions can exceed GitHub's URL limit. The portal first writes the complete
  issue body to the clipboard and waits for the browser to confirm success. Only then
  does it show **Continue to GitHub**, where the submitter pastes the body and files the
  issue under their GitHub account. If clipboard access is denied, GitHub is not opened.

A maintainer reviews the issue and implements an accepted request through the normal
repository pull-request workflow. The SWA preview is available before that PR is merged;
the merge redeploys the site and publishes the card.

**Configure** (copy `.env.example`; set these as GitHub *Variables* for the build):

| Setting | Purpose |
|---|---|
| `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO` | Public repo coordinates for the prefilled issue link (defaults `ibranibeny`/`se-labs`). |

**Human gate — protect `main`:** require a pull request, at least one approving review
(wire up `CODEOWNERS`), and passing checks before merge. An issue alone never changes
the catalog; a maintainer must merge the resulting implementation PR.

## Attribution

Technical content grounded in [Microsoft Learn](https://learn.microsoft.com/).
Diagrams © Microsoft, linked from Microsoft Learn.
