---
title: "Analyze SQL Logs with Arc & AI"
slug: analyze-sql-logs
excerpt: "Continue from Azure Arc: stream SQL Server logs to Log Analytics with AMA + DCE + DCR, then ask questions in natural language using Azure AI Foundry + GPT-4o."
level_range: "L500"
duration_total: "~2 hours"
order: 9
icon: "fas fa-comments"
color: "#8B5CF6"
source_site: "https://ibranibeny.github.io/AnalyzeYourSQLLogwithArc"
source_repo: "https://github.com/ibranibeny/AnalyzeYourSQLLogwithArc"
---

# Analyze SQL Logs with Arc & AI — L500 Workshop

**A capstone that continues from the Azure Arc module.** Your SQL Server VM is already an
**Arc-enabled server**; now you'll centralise its logs into **Log Analytics** with the Azure
Monitor pipeline (**AMA + DCE + DCR**) and put an **AI layer** on top so engineers can ask
*"why did errors spike yesterday?"* in plain language — grounded in official Microsoft
documentation via the **Microsoft Learn MCP**, with **zero secrets** (managed identity everywhere).

![Onboarding a machine to Azure Arc](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/hybrid/arc-enabled-servers/media/arc-enabled-servers-onboarding.png)
*Prerequisite from the Azure Arc module: the SQL VM must already be an Arc-enabled server. Source: Microsoft Learn.*

## What you will learn

- **L500** — Deploy the full solution with one `deploy.sh`: Log Analytics, a **Data Collection
  Endpoint (DCE)** and **Data Collection Rule (DCR)**, Azure OpenAI **GPT-4o**, an **Azure AI
  Foundry** hub + project, and a **Streamlit** "Talk to your SQL logs" app.
- The **AMA + DCE + DCR** collection pipeline and how it works on **Arc-enabled servers**.
- **Azure AI Foundry** — projects, model connections, and how GPT-4o turns questions into KQL.
- **Managed identity + least-privilege RBAC** to eliminate secrets end-to-end.

## Prerequisites

- Completed the **Azure Arc** module (an **Arc-enabled** Windows + SQL Server).
- **Azure subscription** with rights to create resources, service principals, and **RBAC** role assignments.
- **Azure CLI 2.61+** with the **`ml`** extension, and **Azure OpenAI GPT-4o quota** (this workshop targets `southeastasia` + `eastus`).
