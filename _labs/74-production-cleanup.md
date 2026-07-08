---
title: "Production Hardening & Cleanup"
module: analyze-sql-logs
excerpt: "Harden the solution for production (private networking, scaling, HA) or tear it all down."
level: 500
duration: "20 min"
doc_type: "How-to"
persona: "Cloud engineer / architect"
learning_path: "Analyze SQL Logs with Arc & AI"
nav_order: 34
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 500 | Cloud engineer / architect | 20 min | Decide what to **harden for production** and how to **clean up** to stop charges. |

## What the deployment already does right

| Control | How |
|---------|-----|
| **No secrets** | Managed identity replaces API keys for Azure OpenAI **and** Log Analytics. |
| **Least-privilege RBAC** | *Cognitive Services OpenAI User* + *Log Analytics Reader* (not Contributor). |
| **System-assigned identity** | Lifecycle tied to the App Service — auto-cleaned on deletion. |
| **HTTPS by default** | App Service enforces TLS. |

## What to harden for production

| Area | Risk | Hardening |
|------|------|-----------|
| VM public IP / RDP | Internet-exposed | Remove public IP; use **Azure Bastion** or Just-In-Time access. |
| App Service endpoint | Public | Add IP restrictions or **Front Door + WAF**; use **VNet integration**. |
| Azure OpenAI | Public endpoint | Enable **Private Link** for the Cognitive Services account. |
| Log Analytics | Standard ingestion | Configure **AMPLS** (Azure Monitor Private Link Scope). |
| SQL SA / VM admin password | In env / CLI | Move to **Azure Key Vault**; rotate regularly. |

Example — lock down the VM and add private access:

```bash
# Remove the VM public IP and deploy Bastion for secure access
az network nic ip-config update -g "$RESOURCE_GROUP" --nic-name "${VM_NAME}VMNic" \
  --name ipconfig1 --remove publicIpAddress
az network bastion create -g "$RESOURCE_GROUP" -n "bastion-contoso" \
  --vnet-name "${VM_NAME}VNET" -l "$LOCATION_SEA"

# Private endpoint for Azure OpenAI
az network private-endpoint create -g "$RESOURCE_GROUP" -n "pe-aoai" \
  --vnet-name "${VM_NAME}VNET" --subnet "private-endpoints" \
  --private-connection-resource-id "$AOAI_RESOURCE_ID" --group-id account \
  --connection-name "aoai-pe"
```

## Scaling & HA (optional)

| Component | Dev | Production |
|-----------|-----|-----------|
| VM size | D2s_v3 | D4s_v3+ for real SQL workloads |
| SQL | Express (10 GB) | Standard/Enterprise |
| App Service | B1 | S1 / P1v3 with autoscale + deployment slots |
| Azure OpenAI TPM | 30K | 100K+ |
| LAW retention | 30 days | 90+ days (archive to Storage) |

## Day-2: extend data collection

Add more log sources by updating the DCR, then tell the app about new columns:

```bash
az monitor data-collection rule show -g "$RESOURCE_GROUP" -n "dcr-sql-windows-logs" -o json > dcr.json
# edit dcr.json to add XPath queries / perf counters, then:
az monitor data-collection rule update -g "$RESOURCE_GROUP" -n "dcr-sql-windows-logs" --rule-file dcr.json
# update TABLE_SCHEMAS in the app's kql_prompt.py so GPT-4o knows the new columns
```

## Clean up

```bash
source .env
bash scripts/cleanup.sh      # deletes the whole resource group (prompts to confirm)
```

Selective cleanup:

```bash
az webapp delete -g "$RESOURCE_GROUP" -n "$WEBAPP_NAME"                      # web app only
az cognitiveservices account delete -g "$RESOURCE_GROUP" -n "$AOAI_NAME"      # OpenAI only
az ml workspace delete -g "$RESOURCE_GROUP" -n "$AI_PROJECT_NAME" --yes       # Foundry project
az ml workspace delete -g "$RESOURCE_GROUP" -n "$AI_HUB_NAME" --yes           # Foundry hub
az vm deallocate -g "$RESOURCE_GROUP" -n "$VM_NAME"                           # stop VM (keep disk)
```

<div class="notice--warning" markdown="1">
**Warning:** `cleanup.sh` runs `az group delete` and permanently removes the VM, disks, network,
Log Analytics, OpenAI, Foundry, and the app. Make sure you're targeting the workshop resource group.
</div>

## Summary of learnings

- The workshop is **secure-by-default** (MI + least-privilege RBAC) but **public** — production needs **Private Link / Bastion / WAF**.
- **Extend the DCR** to collect more sources; keep the app's schema in sync.
- **`cleanup.sh`** removes everything to stop charges.

You've completed the **Analyze SQL Logs with Arc & AI** L500 workshop. 🎉
