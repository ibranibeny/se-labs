---
name: onboard-asset
description: "Use when adding, onboarding, drafting, or re-tagging an asset in this Major Growth SE Asset Portal repo (a workshop, demo, reference architecture, or case study card in the catalog). Covers the Markdown + YAML frontmatter schema under src/content, the FY27 GTM taxonomy vocabulary (conversations, solution areas, asset types, levels), draft/external-link assets that point to content hosted elsewhere, optional step-by-step labs, and how to preview and build. Triggers: add asset, new asset, onboard asset, add a workshop, add a demo, add a card to the catalog, draft asset, external asset, tag an asset, re-tag, GTM mapping."
---

# Onboard a new asset

This repo is a Next.js (App Router) catalog of Major Growth SE assets, mapped to the
FY27 GTM framework. Each **asset** is a Markdown file with YAML frontmatter. Adding one
is just creating a file (plus optional step files) — the catalog updates automatically.

> **Two ways to onboard.** Maintainers add the Markdown file directly (this guide).
> Anyone else can use the in-app **Submit an asset** form at `/submit` — it validates the
> taxonomy and prepares a GitHub issue containing the proposed
> `src/content/modules/<slug>.md`. The submitter signs in to file the issue, and a
> maintainer implements an accepted request through the normal review workflow.

## Where content lives

```
src/content/modules/<slug>.md   # one file per asset (the catalog card)
src/content/labs/<slug>.md       # optional ordered steps for a hands-on asset
src/data/taxonomy.ts             # the GTM vocabulary (source of truth for valid ids)
src/generated/catalog-index.json # AUTO-GENERATED metadata — never hand-edit
```

Bundled templates you can copy from:
`.github/skills/onboard-asset/templates/asset.md`,
`templates/draft-asset.md`, and `templates/lab.md`.

## Steps

1. **Create the asset file** `src/content/modules/<slug>.md`. `<slug>` is kebab-case
   and MUST match the filename (e.g. `foundry-agent-service-portal`).
2. **Fill the frontmatter** (schema below). Pick taxonomy values from the valid lists.
3. **(Optional) Add labs** — one file per step in `src/content/labs/`, each with
   `module: <slug>` and an increasing `nav_order`.
4. **Preview**: `npm run dev` → http://localhost:3000 . The metadata index
   regenerates automatically (the `predev` hook). To regenerate without restarting,
   run `npm run build:index`.
5. **Verify** the card appears, its badges/filters are correct, and the detail page
   renders. Then `npm run build` before committing.

## Asset (module) frontmatter schema

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `title` | yes | string | Card + page heading. |
| `slug` | yes | string | Must equal the filename (kebab-case). |
| `excerpt` | yes | string | 1–2 sentence card summary. |
| `level_range` | rec. | string | e.g. `"L100–L400"`. Shown as a pill. |
| `duration_total` | rec. | string | e.g. `"~2 hours"`. |
| `order` | rec. | number | Sort order in the catalog (lower = first). |
| `color` | rec. | string | Hex, e.g. `"#0078D4"`. Card top accent. |
| `icon` | no | string | FontAwesome class (kept for schema; not rendered). |
| `conversations` | yes | list | GTM conversation ids (see below). |
| `solution_areas` | yes | list | `CAIP` \| `ABS` \| `Security`. |
| `asset_type` | yes | string | `Workshop` \| `Demo` \| `Reference Architecture` \| `Case Study`. |
| `products` | rec. | list | Free-form tech tags, e.g. `[AKS, KAITO, GPU]`. Power the Product filter. |
| `draft` | no | bool | `true` shows a **Draft** badge. |
| `external_url` | no | string | If set, the page shows an **Open the workshop ↗** CTA and the card footer reads **External ↗**. Use for link-out/draft assets with no in-repo labs. |
| `source_site` | no | string | Reference link shown at the bottom. |
| `source_repo` | no | string | Reference repo link. |

The body (after the frontmatter) is Markdown — GitHub-flavored, with ` ```mermaid `
diagrams and syntax-highlighted code supported.

## GTM taxonomy — valid values

Use these exact ids (defined in `src/data/taxonomy.ts`). Multiple are allowed.

**Conversations — Frontier tier**
- `ai-flow-human-ambition` — AI in the flow of human ambition
- `ubiquitous-innovation` — Ubiquitous Innovation (GitHub, Studio, Foundry)
- `amplify-intelligence` — Amplify your intelligence (Microsoft IQ)
- `trusted-secure-platform` — Establish a trusted and secure platform for AI

**Conversations — Core tier**
- `ai-ready-productivity` — AI-ready productivity & security for every employee
- `agentify-processes` — Agentify your business processes
- `modernize-confidence` — Modernize with confidence (Infra, Apps, Data)
- `unified-data-ai-estate` — Build a unified, governed data and AI estate

**Solution areas**: `CAIP` (Cloud & AI Platforms), `ABS` (AI Business Solutions), `Security`.

**Asset types**: `Workshop`, `Demo`, `Reference Architecture`, `Case Study`.

**Levels**: 100, 200, 300, 400, 500 (labs carry a numeric `level`; assets show a `level_range` string).

## Draft / external-link assets

For an asset whose real content lives elsewhere (another site, a repo, a deck), make a
**draft** that links out — no in-repo labs needed:

```yaml
draft: true
external_url: "https://example.com/the-workshop"
```

The card gets a Draft badge and an `External ↗` footer; the detail page shows a
prominent **Open the workshop ↗** button. Keep the body short: a scannable overview
plus the outbound link. See `templates/draft-asset.md`.

## Optional: step-by-step labs

If the asset is a hands-on path, add step files in `src/content/labs/`:

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Step title. |
| `module` | string | Parent asset `slug`. **Links the lab to the asset.** |
| `excerpt` | string | Short summary. |
| `level` | number | 100–500. Feeds the Level filter. |
| `duration` | string | e.g. `"20 min"`. |
| `doc_type` | string | `Concept` \| `Build lab` \| `How-to`. |
| `persona` | string | e.g. `"Cloud engineer / architect"`. |
| `learning_path` | string | Human-readable path name. |
| `nav_order` | number | Global ordering; increasing within the asset drives prev/next. |
| `featured` | bool | Optional. |
| `report_issue` | string | Optional issue URL. |

Labs inherit the asset's GTM taxonomy automatically — don't repeat it on labs.

## Checklist

- [ ] `slug` matches the filename.
- [ ] `conversations` / `solution_areas` / `asset_type` use valid ids from taxonomy.ts.
- [ ] `order` set (unique enough to place it where you want).
- [ ] Draft/external assets have `external_url`; content-in-repo assets have labs.
- [ ] `npm run build:index` shows the new count; `npm run dev` renders the card.
- [ ] `npm run typecheck` and `npm run build` pass before committing.

## Gotchas

- Never edit `src/generated/catalog-index.json` by hand — it is regenerated from
  frontmatter by `scripts/build-index.mjs`.
- Quote frontmatter strings that contain a colon (e.g. `title: "Foundry: BYOM"`).
- YAML lists can be flow style: `conversations: [ubiquitous-innovation, amplify-intelligence]`.
- To **re-tag** an existing asset, edit its frontmatter and re-run `npm run build:index`.
