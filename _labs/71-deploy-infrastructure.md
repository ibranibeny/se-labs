---
title: "Deploy the Infrastructure"
module: analyze-sql-logs
excerpt: "Provision Log Analytics, DCE + DCR, Azure OpenAI GPT-4o, AI Foundry, and the web app with one script."
level: 500
duration: "30 min"
doc_type: "How-to"
persona: "Cloud engineer"
learning_path: "Analyze SQL Logs with Arc & AI"
nav_order: 31
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 500 | Cloud engineer | 30 min | Deploy all 10 resources with `deploy.sh`, then understand the **DCE + DCR** and **AI Foundry** steps in detail. |

## Prerequisites

```bash
az login
az extension add --name ml --upgrade --yes         # required for AI Foundry Hub/Project
for ns in Microsoft.Compute Microsoft.OperationalInsights Microsoft.Insights \
          Microsoft.CognitiveServices Microsoft.MachineLearningServices Microsoft.Web; do
  az provider register --namespace "$ns" --wait
done
```

Verify **GPT-4o quota** in `eastus` and **Standard_D2s_v3** vCPU quota in `southeastasia`.

## Step 1 — Environment variables

```bash
git clone https://github.com/ibranibeny/AnalyzeYourSQLLogwithArc.git
cd AnalyzeYourSQLLogwithArc

cat > .env << 'EOF'
export SUBSCRIPTION_ID="$(az account show --query id -o tsv)"
export RESOURCE_GROUP="rg-contoso-sqlobs"
export LOCATION_SEA="southeastasia"        # logs region
export LOCATION_US="eastus"                # Azure OpenAI region
export VM_NAME="vm-sql-sea-01"
export VM_SIZE="Standard_D2s_v3"
export LAW_NAME="law-contoso-sqlobs"
export AOAI_NAME="aoai-contoso-sqllogs"    # globally unique
export AOAI_DEPLOYMENT="gpt-4o"
export AOAI_MODEL_VERSION="2024-08-06"
export AI_HUB_NAME="ai-hub-contoso"
export AI_PROJECT_NAME="ai-proj-sqllogs"
export APP_PLAN_NAME="asp-contoso-streamlit"
export WEBAPP_NAME="app-contoso-sqllogs"   # globally unique
EOF
source .env
```

<div class="notice--info" markdown="1">
**Continuing from Azure Arc?** If you already have the **Arc-enabled** SQL VM from the Azure Arc
module, point `RESOURCE_GROUP`/`VM_NAME`/`LAW_NAME` at it and **skip Steps 2–4** of `deploy.sh`
(RG, LAW, VM, DCR) — run only the AI + app steps. The AI Foundry project name is yours to choose.
</div>

## Step 2 — Run the deployment

```bash
source .env
bash scripts/deploy.sh
```

A successful run ends with a summary listing the RG, VM, workspace, Azure OpenAI endpoint, AI
Hub/Project, and the Web App URL — plus **Authentication: Managed Identity (no API keys)**.

---

## What `deploy.sh` does (per block)

### DCE + DCR (log collection)

```bash
# Data Collection Endpoint — regional ingestion endpoint (same region as the workspace)
az monitor data-collection endpoint create -g "$RESOURCE_GROUP" -n "dce-sql" \
  -l "$LOCATION_SEA" --public-network-access Enabled

# Azure Monitor Agent on the VM (Arc uses: az connectedmachine extension create)
az vm extension set -g "$RESOURCE_GROUP" --vm-name "$VM_NAME" \
  --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --enable-auto-upgrade true

# Data Collection Rule — Windows Application/System events (Warning/Error/Critical) -> Event table
#   ...created from a JSON rule-file referencing the DCE + workspace, then associated to the VM
az monitor data-collection rule create -g "$RESOURCE_GROUP" -n "dcr-sql-windows-logs" \
  -l "$LOCATION_SEA" --rule-file dcr.json
az monitor data-collection rule association create --name "assoc-sql" \
  --rule-id "$DCR_ID" --resource "$VM_ID"
```

XPath severity levels: `1`=Critical, `2`=Error, `3`=Warning. SQL Server errors go to the
**Application** log → the **`Event`** table.

### Azure OpenAI + GPT-4o (eastus)

```bash
az cognitiveservices account create -n "$AOAI_NAME" -g "$RESOURCE_GROUP" \
  -l "$LOCATION_US" --kind OpenAI --sku S0 --custom-domain "$AOAI_NAME" --yes
az cognitiveservices account deployment create -n "$AOAI_NAME" -g "$RESOURCE_GROUP" \
  --deployment-name "$AOAI_DEPLOYMENT" --model-name gpt-4o \
  --model-version "$AOAI_MODEL_VERSION" --model-format OpenAI --sku-name Standard --sku-capacity 30
```

### Azure AI Foundry hub + project

```bash
az ml workspace create --kind hub    -n "$AI_HUB_NAME"     -g "$RESOURCE_GROUP" -l "$LOCATION_US"
az ml workspace create --kind project -n "$AI_PROJECT_NAME" -g "$RESOURCE_GROUP" -l "$LOCATION_US" \
  --hub-id "$(az ml workspace show -n "$AI_HUB_NAME" -g "$RESOURCE_GROUP" --query id -o tsv)"
# + a credential-less (Entra ID) connection from the project to the Azure OpenAI account
```

### App Service + managed identity + RBAC

```bash
az appservice plan create -g "$RESOURCE_GROUP" -n "$APP_PLAN_NAME" -l "$LOCATION_SEA" --sku B1 --is-linux
az webapp create -g "$RESOURCE_GROUP" -p "$APP_PLAN_NAME" -n "$WEBAPP_NAME" --runtime "PYTHON:3.11"
az webapp identity assign -g "$RESOURCE_GROUP" -n "$WEBAPP_NAME"
# RBAC (least privilege, no secrets):
#   Cognitive Services OpenAI User -> Azure OpenAI account
#   Log Analytics Reader           -> workspace
```

---

## Verify

```bash
LAW_ID="$(az monitor log-analytics workspace show -g "$RESOURCE_GROUP" -n "$LAW_NAME" --query customerId -o tsv)"
az monitor log-analytics query --workspace "$LAW_ID" \
  --analytics-query "Event | summarize count() by EventLevelName" --timespan PT1H -o table
```

<div class="notice--info" markdown="1">
Allow **10–15 minutes** after AMA + DCR deploy for the first events to land in the `Event` table.
</div>

## Summary of learnings

- One `deploy.sh` provisions **logs + AI + app** across two regions.
- The **DCE/DCR** pair is the collection pipeline; the **Foundry project** holds the model connection.
- **Managed identity + RBAC** means **no secrets** anywhere.

Next: **[Configure SQL & simulate errors](../72-configure-sql-simulate/)**.
