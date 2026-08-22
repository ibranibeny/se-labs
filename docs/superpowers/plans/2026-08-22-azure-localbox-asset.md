# Azure LocalBox Deployment Guide Asset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the published Azure LocalBox Deployment Guide to the SE Labs catalog as an external workshop with valid FY27 GTM metadata and source links.

**Architecture:** Create one Markdown module containing the catalog metadata and a concise overview, while keeping the external guide as the source of truth. Regenerate the existing metadata index with the repository script; do not create local lab files or hand-edit generated JSON.

**Tech Stack:** Markdown, YAML frontmatter, Node.js index generator, Next.js 15, TypeScript

---

## File structure

- Create `src\content\modules\azure-localbox-deployment-guide.md`: owns the catalog card metadata and concise detail-page copy.
- Modify `src\generated\catalog-index.json`: generated metadata output from `npm run build:index`; never edit manually.

### Task 1: Add the external workshop asset

**Files:**
- Create: `src\content\modules\azure-localbox-deployment-guide.md`
- Modify: `src\generated\catalog-index.json` through `npm run build:index`

- [ ] **Step 1: Run the metadata assertion before creating the asset**

Run:

```powershell
node -e "const i=require('./src/generated/catalog-index.json'); const m=i.modules.find(x=>x.slug==='azure-localbox-deployment-guide'); if(!m) throw new Error('Azure LocalBox asset is missing');"
```

Expected: FAIL with `Error: Azure LocalBox asset is missing`.

- [ ] **Step 2: Create the module with the approved metadata and copy**

Create `src\content\modules\azure-localbox-deployment-guide.md` with:

```markdown
---
title: "Azure LocalBox Deployment Guide"
slug: azure-localbox-deployment-guide
excerpt: "Deploy and operate Azure Local VM management and AKS Arc with a practical runbook covering control-plane health, networking, image creation, troubleshooting, and PowerShell automation."
level_range: "L300–L400"
duration_total: "~4–6 hours"
order: 22
icon: "fas fa-server"
color: "#0078D4"
external_url: "https://ibranibeny.github.io/azure-localbox-deployment-guide/"
source_site: "https://ibranibeny.github.io/azure-localbox-deployment-guide/"
source_repo: "https://github.com/ibranibeny/azure-localbox-deployment-guide"
conversations: [modernize-confidence]
solution_areas: [CAIP]
asset_type: "Workshop"
products: [Azure Local, Azure Arc, AKS Arc, Hyper-V, PowerShell]
---

# Azure LocalBox Deployment Guide

Take an existing Azure Local deployment from control-plane verification through
managed virtual machines and AKS Arc. This field-focused runbook explains how the
Arc resource bridge, custom locations, logical networks, storage paths, and images
work together, then maps common failures to the layer that owns them.

## What you will do

- Verify Azure prerequisites, role assignments, deployment stages, and Arc
  infrastructure health.
- Build workload logical networks and static IP pools for Azure Local VMs and AKS
  Arc.
- Create and troubleshoot Windows and Linux VM images.
- Provision managed VMs and an AKS Arc cluster.
- Diagnose empty VM blades, image download failures, cross-VLAN connectivity, and
  stopped nested hosts.
- Automate the end-to-end setup with an idempotent PowerShell script.

## Prerequisites

- An existing Azure Local deployment with its nodes registered in Azure.
- Azure CLI and PowerShell 7.
- Azure permissions for provider registration, role assignments, and Azure Local
  resource management.
- Network and DNS details for the management and workload VLANs.

## Open the workshop

👉 **[Open the Azure LocalBox Deployment Guide ↗](https://ibranibeny.github.io/azure-localbox-deployment-guide/)**
```

- [ ] **Step 3: Regenerate the catalog metadata**

Run:

```powershell
npm run build:index
```

Expected:

```text
Wrote 22 modules + 32 labs to catalog-index.json
```

- [ ] **Step 4: Verify the generated catalog entry**

Run:

```powershell
node -e "const i=require('./src/generated/catalog-index.json'); const m=i.modules.find(x=>x.slug==='azure-localbox-deployment-guide'); if(!m) throw new Error('asset missing'); if(m.title!=='Azure LocalBox Deployment Guide') throw new Error('wrong title'); if(m.externalUrl!=='https://ibranibeny.github.io/azure-localbox-deployment-guide/') throw new Error('wrong external URL'); if(m.sourceSite!==m.externalUrl) throw new Error('wrong source site'); if(m.sourceRepo!=='https://github.com/ibranibeny/azure-localbox-deployment-guide') throw new Error('wrong source repo'); if(m.assetType!=='Workshop') throw new Error('wrong asset type'); if(m.draft) throw new Error('asset must be published'); if(m.order!==22) throw new Error('wrong order'); if(m.labSlugs.length!==0) throw new Error('external asset must not have local labs'); console.log('Azure LocalBox catalog entry verified');"
```

Expected:

```text
Azure LocalBox catalog entry verified
```

- [ ] **Step 5: Run the repository validation**

Run:

```powershell
npm run typecheck && npm run build
```

Expected: TypeScript exits with code 0, and Next.js reports a successful production build.

- [ ] **Step 6: Commit the asset and generated index**

Run:

```powershell
git add -- src\content\modules\azure-localbox-deployment-guide.md src\generated\catalog-index.json
git commit -m "Add Azure LocalBox deployment guide asset" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>" -m "Copilot-Session: 337d1abe-47d9-4b1f-9cc6-5580aa60c6fd"
```

Expected: one commit containing the new module and regenerated catalog index.
