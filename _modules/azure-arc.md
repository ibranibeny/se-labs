---
title: "Azure Arc"
slug: azure-arc
excerpt: "Extend Azure management, governance, and security to servers and SQL Server running anywhere."
level_range: "L100–L500"
duration_total: "~4 hours"
order: 1
icon: "fas fa-cloud"
color: "#0078D4"
source_site: "https://ibranibeny.github.io/azure-arc-workshop/"
source_repo: "https://github.com/ibranibeny/azure-arc-workshop"
---

# Azure Arc

**Extend Azure management, governance, and security to servers and SQL Server
running anywhere** — on-premises, at the edge, or in other clouds.

This module takes you from zero knowledge to a fully scripted hands-on lab, in six
progressive levels (L100 → L500). Beginners can start at L100; experienced
practitioners can jump straight to the L400/L500 build labs.

![Azure Arc management control plane](https://learn.microsoft.com/azure/azure-arc/media/overview/azure-arc-control-plane.png)
*The Azure Arc control plane projects resources hosted outside Azure into Azure Resource Manager. Source: Microsoft Learn.*

## What you will learn

- **L100** — What Azure Arc is and the control-plane model (plus its cost structure).
- **L200** — The governance, security, and management value of Azure Arc.
- **L300** — Onboard a Windows Server and its SQL Server instance to Azure Arc.
- **L400** — Simulate a Windows + SQL Server VM and project it into Arc with the `az` CLI.
- **L500** — Stream SQL/Windows logs to Log Analytics with a DCE + DCR, then **talk to your SQL logs** using Azure AI Foundry + GPT-4o.

## Prerequisites

- An **Azure subscription** with permission to create resource groups and resources.
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) 2.53+ (or [Azure Cloud Shell](https://shell.azure.com)).
- Basic familiarity with the Azure portal and a terminal.
