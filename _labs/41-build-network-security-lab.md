---
title: "Build the Defense-in-Depth Lab"
module: network-security
excerpt: "Deploy the hub-spoke network, firewall, VMs, WAF layers, and monitoring — stage by stage."
level: 300
duration: "50 min"
doc_type: "Build lab"
persona: "Cloud / security engineer"
learning_path: "Network Security"
nav_order: 18
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 300 | Cloud / security engineer | 50 min | Build the full defense-in-depth lab with idempotent PowerShell scripts and validate each checkpoint. |

## Why this matters

You'll stand up the entire layered network — networking, firewall, VMs, the app behind two
WAFs, and monitoring — in six ordered stages. Each script is **idempotent** (safe to re-run).

## Tools you need

| Tool | Check |
|------|-------|
| PowerShell 7+ (`pwsh`) | `pwsh --version` |
| Az PowerShell module | `Get-Module Az.Accounts -ListAvailable` |
| Azure CLI (`az`) | `az version` |
| An Azure subscription | `az account show` |

<div class="notice--info" markdown="1">
**No Docker Hub account required.** Anonymous Docker Hub pulls are rate-limited, so the lab
**imports the Juice Shop image once into a private Azure Container Registry** and runs it on
ACI — no local Docker, no Docker Hub login. `deploy/create-aci.ps1` automates it.
</div>

## Sign in

```powershell
Connect-AzAccount -UseDeviceAuthentication   # device-code login
az login                                      # also sign in the CLI (its token auto-refreshes)
```

<div class="notice--warning" markdown="1">
**Tip learned live:** the Az PowerShell token expires after ~1 hour and doesn't auto-refresh.
If a `New-Az…` command suddenly returns a vague **401 Unauthorized**, re-run `Connect-AzAccount`
or use the `az` CLI (its token refreshes and often reveals the real error, e.g. a quota limit).
</div>

## Build, stage by stage

Run from the `deploy/` folder. Each script only creates what's missing.

```powershell
cd deploy
./00-preflight.ps1      # sign-in + region/SKU/quota gate + resource group
./01-networking.ps1     # hub + 2 spokes, peering, public IPs
./02-security-core.ps1  # Firewall Premium + IDPS, NSGs (deny-by-default), UDR
./03-compute.ps1        # 3 VMs (prompts for a VM password) + Bastion — no public IPs
./create-aci.ps1        # Juice Shop backend on ACI via ACR (no Docker Hub login)
./04-app-delivery.ps1   # App Gateway WAFv2 + Front Door Premium WAF
./05-monitoring.ps1     # Log Analytics workspace + diagnostic settings
```

Or run them all with narration pauses:

```powershell
./Deploy-All.ps1        # stops at each checkpoint so you can explain what just happened
```

### What the Juice Shop step runs (names from `config.ps1`)

```powershell
az acr create -g rg-netsec-demo -n nsdemoacrbibrani --sku Basic --admin-enabled true
az acr import -n nsdemoacrbibrani --source docker.io/bkimminich/juice-shop:latest --image juice-shop:latest
$u = az acr credential show -n nsdemoacrbibrani --query username -o tsv
$p = az acr credential show -n nsdemoacrbibrani --query passwords[0].value -o tsv
az container create -g rg-netsec-demo -n ns-juice-aci `
  --image nsdemoacrbibrani.azurecr.io/juice-shop:latest `
  --os-type Linux --cpu 1 --memory 1.5 --ports 3000 --ip-address Public `
  --dns-name-label ns-juice-demo-bibrani `
  --registry-login-server nsdemoacrbibrani.azurecr.io --registry-username $u --registry-password $p
```

## Validate each checkpoint

```powershell
Get-AzResourceGroup -Name rg-netsec-demo                    # after 00
Get-AzVirtualNetwork -ResourceGroupName rg-netsec-demo      # after 01 → 3 VNets
Get-AzFirewall -ResourceGroupName rg-netsec-demo            # after 02 → Premium + private IP 10.0.25.4
Get-AzVM -ResourceGroupName rg-netsec-demo                  # after 03 → 3 VMs, no public IPs
# after 04 → curl the Front Door endpoint URL the script prints (expect HTTP 200)
Get-AzOperationalInsightsWorkspace -ResourceGroupName rg-netsec-demo   # after 05
```

## Key resources & names

| Resource | Name | Detail |
|----------|------|--------|
| Resource group | `rg-netsec-demo` | Everything lives here |
| Hub / spokes | 10.0.25.0/24 · 10.0.27.0/24 · 10.0.28.0/24 | Hub + 2 spokes |
| Firewall | `NS-FW-demo` | Premium + IDPS (Alert), `10.0.25.4` |
| Firewall policy | `NS-FWPolicy-demo` | Group `LabRuleCollectionGroup` |
| Route table | `NS-RT-demo` | `0.0.0.0/0` → `10.0.25.4` |
| App | `ns-juice-aci` | OWASP Juice Shop, port 3000 |
| App Gateway WAF | `NS-AG-WAFv2-demo` / policy `NS-AGPolicy-demo` | OWASP 3.2 |
| Front Door | `NS-FD-demo` | DRS 2.1 |
| Bastion | `NS-BASTION-demo` | Standard SKU |
| VMs | `NS-W11-demo` (10.0.27.4), Win Server 2022, Kali | admin `azureadmin` |
| Log Analytics | `NS-LA-demo` | KQL telemetry |

## Teardown (mandatory)

```powershell
cd deploy
./99-teardown.ps1                 # type the RG name to confirm; deletes everything
az group exists -n rg-netsec-demo # should print: false
```

## Summary of learnings

- Six **idempotent** stages build networking → firewall → VMs → app+WAF → monitoring.
- VMs have **no public IP** — access is **Bastion-only**.
- Always **tear down** — Firewall Premium alone is ~$1.75/hr.
