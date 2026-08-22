# Azure LocalBox Deployment Guide Asset Design

## Goal

Add the published Azure LocalBox Deployment Guide to the SE Labs catalog as an
external workshop. The catalog entry should help solution engineers discover the
guide without duplicating its maintained content.

## Catalog entry

- File: `src/content/modules/azure-localbox-deployment-guide.md`
- Title: `Azure LocalBox Deployment Guide`
- Slug: `azure-localbox-deployment-guide`
- Asset type: `Workshop`
- Publication state: published, not draft
- External URL: `https://ibranibeny.github.io/azure-localbox-deployment-guide/`
- Source site: `https://ibranibeny.github.io/azure-localbox-deployment-guide/`
- Source repository:
  `https://github.com/ibranibeny/azure-localbox-deployment-guide`
- GTM conversation: `modernize-confidence`
- Solution area: `CAIP`
- Level range: `L300–L400`
- Duration: `~4–6 hours`
- Order: `22`, after the current catalog entries
- Icon: `fas fa-server`
- Color: Azure blue (`#0078D4`)
- Products: Azure Local, Azure Arc, AKS Arc, Hyper-V, PowerShell

The excerpt will describe the guide as a practical path from a deployed Azure Local
instance to managed VMs and AKS Arc, including control-plane verification,
networking, image management, troubleshooting, and automation.

## Detail-page content

The Markdown body will remain concise because the canonical content lives on the
external site. It will include:

1. A short overview of the deployment and operations runbook.
2. A scannable list covering architecture, prerequisites, deployment monitoring,
   logical networking, Windows and Linux images, VM creation, AKS Arc, recovery,
   and the idempotent PowerShell automation.
3. Prerequisites for an existing Azure Local deployment, Azure CLI, PowerShell 7,
   and appropriate Azure permissions.
4. A prominent link to open the complete guide.

No lab files will be added under `src/content/labs`, and the external guide will
remain the source of truth.

## Validation

Run the existing repository commands:

1. `npm run build:index` and confirm the module count increases by one.
2. `npm run typecheck`.
3. `npm run build`.

The generated catalog index may change through the repository script; it will not
be edited manually.
