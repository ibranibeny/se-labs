---
title: "The Value of Azure Arc"
module: azure-arc
excerpt: "Explore the governance, security, and management value of Azure Arc."
level: 200
duration: "25 min"
doc_type: "Concept"
persona: "IT pro / architect / decision maker"
learning_path: "Azure Arc Fundamentals"
nav_order: 2
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 200 | IT pro / architect / decision maker | 25 min | After this lab you can articulate the concrete business and technical value of Azure Arc and map capabilities to real scenarios. |

## Why this matters

Understanding *what* Azure Arc is (Lab 01) is not enough to justify adopting it. Leaders
and engineers need to connect Arc to **outcomes**: lower operational cost, stronger
security posture, consistent compliance, and a faster path to cloud practices — without
migrating everything first.

## Introduction

When you connect a server with the Connected Machine agent, it gets a unique Azure
Resource ID and appears in your subscription **alongside native Azure resources**. This
lets you replace disparate on-prem tooling (Group Policy, SCCM/MECM, WSUS, PowerShell
remoting) with **one unified Azure platform**.

> The journey isn't just about moving VMs to Azure; it's about shifting the entire
> management experience — inventory, configuration, governance, scripting, patching,
> identity — into Azure's unified platform. — *Microsoft Learn, [Cloud-native server management](https://learn.microsoft.com/azure/azure-arc/servers/cloud-native/overview)*

![Azure Arc-enabled servers onboarding and automation](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/hybrid/arc-enabled-servers/media/arc-enabled-servers-onboarding.png)
*Once onboarded, Arc-enabled servers can be targeted by Azure automation, policy, and security services. Source: Microsoft Learn (Cloud Adoption Framework).*

## The Azure Arc management experiences

Once your resources are projected into Azure, the portal gives you a **sequence of
purpose-built dashboards**. There's a central Arc view first, and then **Windows and SQL
each have their own dashboard**, followed by assessment, backup, and monitoring.

```mermaid
%% Colored per the mermaid-diagrams skill
flowchart LR
    D[1 - Arc dashboard] --> W[2 - Windows] --> S[3 - SQL] --> B[4 - Best Practices] --> K[5 - Backup] --> M[6 - Monitoring]
    classDef a fill:#0078D4,stroke:#004578,color:#ffffff;
    classDef b fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef c fill:#CC2927,stroke:#8B1A19,color:#ffffff;
    classDef d fill:#8661C5,stroke:#4B1C77,color:#ffffff;
    classDef e fill:#D83B01,stroke:#A32D01,color:#ffffff;
    classDef f fill:#B4009E,stroke:#7a0069,color:#ffffff;
    class D a
    class W b
    class S c
    class B d
    class K e
    class M f
```

### 1 · Azure Arc dashboard — all resources

A single pane of glass listing every Arc-enabled resource across clouds, with status, tags,
and drill-down — exactly like a native Azure VM.

![Azure Arc inventory dashboard](https://learn.microsoft.com/en-us/sql/sql-server/azure-arc/media/migration-assessment/dashboard-inventory.png)
*Central Azure Arc inventory of all projected resources. Source: Microsoft Learn.*

### 2 · Windows dashboard — Windows Admin Center in Azure Arc

Windows machines get their **own** management view: RDP, Hyper-V, Event Viewer, and more
from the portal — no VPN or public IP.

![Windows Admin Center in Azure Arc](https://learn.microsoft.com/en-us/windows-server/manage/media/manage-vm/windows-admin-center-in-azure-arc-overview.png)
*The Windows dashboard — Windows Admin Center in Azure Arc. Source: Microsoft Learn.*

### 3 · SQL dashboard — SQL Server enabled by Azure Arc

SQL Server instances have their **own** dashboard for inventory, configuration, and use
rights.

![Azure Arc SQL Server dashboard](https://learn.microsoft.com/en-us/sql/sql-server/azure-arc/media/overview/arc-sql-server-dashboard.png)
*The SQL dashboard — SQL Server enabled by Azure Arc. Source: Microsoft Learn.*

### 4 · Best Practices Assessment (BPA)

Scan SQL configuration against Microsoft best practices and get prioritized remediation
guidance *(requires Software Assurance / PAYG)*.

![SQL best practices assessment](https://learn.microsoft.com/en-us/sql/sql-server/azure-arc/media/assess/run-assessment.png)
*Best Practices Assessment for Arc-enabled SQL. Source: Microsoft Learn.*

### 5 · Backup & point-in-time restore

Automated backups let you restore to a point in time, managed from Azure *(requires
Software Assurance / PAYG)*.

![Point-in-time restore](https://learn.microsoft.com/en-us/azure/azure-arc/data/media/point-in-time-restore/point-in-time-restore.png)
*Point-in-time restore for Azure Arc data. Source: Microsoft Learn.*

### 6 · Monitoring & performance

Built-in performance dashboards surface throughput, waits, and health for your Arc-enabled
SQL *(requires Software Assurance / PAYG)*.

![SQL performance dashboard](https://learn.microsoft.com/en-us/sql/sql-server/azure-arc/media/overview/performance-dashboard.png)
*Performance/monitoring dashboard for Arc-enabled SQL. Source: Microsoft Learn.*

## The five pillars of value

### 1. Unified inventory and organization
Every Arc-enabled machine becomes an ARM resource — searchable with **Azure Resource
Graph**, organized in **resource groups**, and labeled with **tags**. One query returns
every server across every cloud and datacenter.

### 2. Consistent governance with Azure Policy
Apply the **same policies** to on-prem, AWS, GCP, and Azure machines. Audit or enforce
OS baselines, required extensions, and configuration — replacing per-environment Group
Policy and scripts. Compliance is evaluated centrally and continuously.

### 3. Security everywhere
- **Microsoft Defender for Cloud** protects Arc-enabled servers and SQL with vulnerability
  assessment, threat detection, and secure-score recommendations.
- **Microsoft Sentinel** ingests signals for SIEM/SOAR across hybrid estate.
- **Microsoft Entra**-based access with **Azure RBAC** and **managed identity** for the machine.

### 4. Unified operations and monitoring
- **Azure Monitor** collects metrics and logs from hybrid machines.
- **Azure Update Manager** schedules and reports OS patching (replacing WSUS/SCCM plans).
- **Change Tracking & Inventory**, **Run Command**, and **Machine Configuration** bring
  at-scale automation without RDP/SSH into each box.

### 5. Extend Azure data & app services
Run **SQL Server enabled by Azure Arc** for centralized inventory, best-practice
assessment, Microsoft Entra authentication, Defender for SQL, and **Extended Security
Updates (ESU)** delivered through Azure — even for older SQL/Windows versions.

## Capability matrix

The same core management capabilities apply across the Arc "machines" services:

| Capability | Arc-enabled servers | VMware vSphere | SCVMM | Azure Local |
|------------|:---:|:---:|:---:|:---:|
| Microsoft Defender for Cloud | ✓ | ✓ | ✓ | ✓ |
| Microsoft Sentinel | ✓ | ✓ | ✓ | ✓ |
| Azure Update Manager | ✓ | ✓ | ✓ | ✓ |
| Change Tracking & Inventory | ✓ | ✓ | ✓ | ✓ |
| Azure Monitor | ✓ | ✓ | ✓ | ✓ |
| VM extensions | ✓ | ✓ | ✓ | ✓ |
| Extended Security Updates (WS/SQL 2012) | ✓ | ✓ | ✓ | ✓ |

*Source: Microsoft Learn, [Choosing the right Azure Arc service for machines](https://learn.microsoft.com/azure/azure-arc/choose-service).*

## Business scenarios

| Scenario | How Azure Arc helps |
|----------|---------------------|
| **Regulated industry, data must stay on-prem** | Keep workloads local; still apply Azure Policy, Defender, and audit centrally. |
| **Multicloud sprawl (AWS + GCP + on-prem)** | Single inventory, single policy engine, single security dashboard. |
| **End-of-support Windows/SQL** | Purchase **Extended Security Updates** through Azure Arc, billed via subscription. |
| **Standardize patching** | Replace WSUS/SCCM with Azure Update Manager across all machines. |
| **Zero-trust identity** | Give each server a **managed identity** and use RBAC instead of shared local accounts. |

## Cost & licensing perspective

- The **Azure Arc control plane for servers is free** for core capabilities such as
  inventory, tagging, resource organization, and **Machine Configuration** (guest policy).
- **Value-add services** you attach (Defender for Cloud, Monitor/Log ingestion, Update
  Manager for non-Azure machines, ESU) are billed per their own meters.
- **SQL Server enabled by Azure Arc**: connecting is free; advanced features and billing
  depend on the **license type** you declare (`LicenseOnly`, `Paid`/Software Assurance, or
  `PAYG`). You'll set this in Labs 03 and 04.

<div class="notice--success" markdown="1">
**Tip:** Start free — onboard machines, build your inventory, and apply baseline policy at no
control-plane cost. Turn on paid services deliberately, where they deliver value.
</div>

## Hands-on (optional): Evaluate Azure Arc on an Azure VM

You can *see* this value on a real machine by evaluating Azure Arc on an **Azure VM** made
to look like an on-premises server — running **Windows + SQL Server Enterprise (Evaluation)**
in **Indonesia Central** (`indonesiacentral`).

<div class="notice--warning" markdown="1">
**Evaluation only.** Installing Azure Arc-enabled servers on an Azure VM is supported **for
testing only** — it's not for production (Azure VMs already have native Azure capabilities).
Follow the official procedure: [Evaluate Azure Arc-enabled servers on an Azure virtual machine](https://learn.microsoft.com/azure/azure-arc/servers/plan-evaluate-on-azure-virtual-machine).
</div>

After onboarding you'll see **two** resources for the same VM: the Azure VM
(`Microsoft.Compute/virtualMachines` — the virtual hardware / power state) and the Arc
resource (`Microsoft.HybridCompute/machines` — the guest OS managed by Arc).

### Prerequisites

- **Virtual Machine Contributor** on the VM, plus **Azure Connected Machine Resource
  Administrator** (or **Contributor**) on the resource group.
- Azure CLI signed in (`az login`) and a subscription with capacity in `indonesiacentral`.

### Step 1 · Create *or* check the VM (with availability + power-state check)

This `az` CLI block checks whether the VM already exists and whether it's **running or shut
down** — starting it if needed, or creating it if it doesn't exist.

```bash
#!/usr/bin/env bash
set -euo pipefail

export LOCATION="indonesiacentral"
export RG="rg-arc-eval"
export VM_NAME="arc-eval-sql"
export VM_SIZE="Standard_D4s_v5"
export ADMIN_USER="azureuser"
read -rsp "Enter a strong VM admin password: " ADMIN_PASSWORD; echo

az group create --name "$RG" --location "$LOCATION" -o none

# --- Check VM availability & power state ---
check_vm() {
  if az vm show -g "$RG" -n "$VM_NAME" &>/dev/null; then
    local power
    power=$(az vm show -d -g "$RG" -n "$VM_NAME" --query powerState -o tsv)
    echo "VM '$VM_NAME' exists — power state: ${power:-unknown}"
    if [ "$power" != "VM running" ]; then
      echo "VM is not running — starting it..."
      az vm start -g "$RG" -n "$VM_NAME"
    fi
    return 0
  fi
  echo "VM '$VM_NAME' not found."
  return 1
}

# Create the VM only if the check reports it is missing
if ! check_vm; then
  echo "Creating Windows Server 2022 VM in $LOCATION..."
  az vm create \
    --resource-group "$RG" --name "$VM_NAME" \
    --image "MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition:latest" \
    --size "$VM_SIZE" --admin-username "$ADMIN_USER" --admin-password "$ADMIN_PASSWORD" \
    --public-ip-sku Standard --nsg-rule NONE
fi
```

**PowerShell option** — the same availability + power-state check, to run in `pwsh` /
Windows PowerShell. A **complete ready-to-run script** is also available:
[`scripts/evaluate-arc-on-azure-vm.ps1`](https://github.com/ibranibeny/azure-arc-workshop/blob/main/scripts/evaluate-arc-on-azure-vm.ps1).

Download it by cloning the repo, then run from the `scripts` folder:

```powershell
# Clone the workshop repo and move into the scripts folder
git clone https://github.com/ibranibeny/azure-arc-workshop.git
cd azure-arc-workshop/scripts

# Deploy the eval VM + SQL + Arc onboarding (auto-generates a random admin password)
./evaluate-arc-on-azure-vm.ps1 -ResourceGroup rg-arc-eval

# Tear everything down when finished
./evaluate-arc-on-azure-vm.ps1 -ResourceGroup rg-arc-eval -Cleanup
```

```powershell
$LOCATION   = "indonesiacentral"
$RG         = "rg-arc-eval"
$VM_NAME    = "arc-eval-sql"
$VM_SIZE    = "Standard_D4s_v5"
$ADMIN_USER = "azureuser"
$sec = Read-Host "Enter a strong VM admin password" -AsSecureString
$ADMIN_PASSWORD = [System.Net.NetworkCredential]::new("", $sec).Password

az group create --name $RG --location $LOCATION -o none

function Test-Vm {
    az vm show -g $RG -n $VM_NAME 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $power = az vm show -d -g $RG -n $VM_NAME --query powerState -o tsv
        Write-Host "VM '$VM_NAME' exists - power state: $power"
        if ($power -ne "VM running") {
            Write-Host "VM is not running - starting it..."
            az vm start -g $RG -n $VM_NAME
        }
        return $true
    }
    Write-Host "VM '$VM_NAME' not found."
    return $false
}

if (-not (Test-Vm)) {
    Write-Host "Creating Windows Server 2022 VM in $LOCATION..."
    az vm create `
        --resource-group $RG --name $VM_NAME `
        --image "MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition:latest" `
        --size $VM_SIZE --admin-username $ADMIN_USER --admin-password $ADMIN_PASSWORD `
        --public-ip-sku Standard --nsg-rule NONE
}
```

<div class="notice--info" markdown="1">
Steps 2, 3, and 5 are the **same `az vm run-command` / `az` commands** — they run
identically in PowerShell. For Step 4, parse the service principal in PowerShell like this:

```powershell
$SUB    = az account show --query id -o tsv
$TENANT = az account show --query tenantId -o tsv
$sp = az ad sp create-for-rbac --name "sp-arc-eval" --role "Azure Connected Machine Onboarding" `
        --scopes "/subscriptions/$SUB/resourceGroups/$RG" -o json | ConvertFrom-Json
$APPID = $sp.appId; $SECRET = $sp.password
```
</div>

### Step 2 · Prepare the VM to look like on-premises (Microsoft Learn procedure)

Run in-guest (no RDP needed) to set the evaluation override, disable the Azure Guest Agent,
and block **both** IMDS endpoints — exactly as the docs require:

```bash
az vm run-command invoke -g "$RG" -n "$VM_NAME" --command-id RunPowerShellScript --scripts '
[System.Environment]::SetEnvironmentVariable("MSFT_ARC_TEST","true",[System.EnvironmentVariableTarget]::Machine)
Set-Service WindowsAzureGuestAgent -StartupType Disabled -Verbose
Stop-Service WindowsAzureGuestAgent -Force -Verbose
New-NetFirewallRule -Name BlockAzureIMDS -DisplayName "Block access to Azure IMDS" -Enabled True -Profile Any -Direction Outbound -Action Block -RemoteAddress 169.254.169.254
New-NetFirewallRule -Name BlockAzureLocalIMDS -DisplayName "Block access to Azure Local IMDS" -Enabled True -Profile Any -Direction Outbound -Action Block -RemoteAddress 169.254.169.253
'
```

<div class="notice--info" markdown="1">
Also **remove any VM extensions** first (e.g., Azure Monitor Agent). A fresh VM created in
Step 1 has none. Blocking `169.254.169.254` (Azure) and `169.254.169.253` (Azure Local)
makes the Arc IMDS the only one available.
</div>

### Step 3 · Install SQL Server 2022 Enterprise (Evaluation)

```bash
az vm run-command invoke -g "$RG" -n "$VM_NAME" --command-id RunPowerShellScript --scripts '
$w="C:\ArcLab"; New-Item -ItemType Directory -Force -Path $w | Out-Null
Invoke-WebRequest -Uri "https://go.microsoft.com/fwlink/p/?linkid=2215158" -OutFile "$w\SQL2022-SSEI-Eval.exe"
& "$w\SQL2022-SSEI-Eval.exe" /ACTION=Download /MEDIATYPE=CAB /MEDIAPATH=$w /QUIET | Out-Null
$box=Get-ChildItem $w -Filter "SQLServer2022-*.exe" | Select-Object -First 1
& $box.FullName /X:"$w\media" /Q | Out-Null
& "$w\media\setup.exe" /Q /ACTION=Install /FEATURES=SQLENGINE /INSTANCENAME=MSSQLSERVER /SQLSYSADMINACCOUNTS="BUILTIN\Administrators" /TCPENABLED=1 /IACCEPTSQLSERVERLICENSETERMS /UPDATEENABLED=0
'
```

No product key = **Evaluation (Enterprise features, 180-day trial)**.

### Step 4 · Onboard the VM to Azure Arc

Create an onboarding service principal, then connect the agent (the `MSFT_ARC_TEST` override
from Step 2 lets the agent onboard an Azure VM for evaluation):

```bash
SUB=$(az account show --query id -o tsv); TENANT=$(az account show --query tenantId -o tsv)
SP=$(az ad sp create-for-rbac --name "sp-arc-eval" --role "Azure Connected Machine Onboarding" \
     --scopes "/subscriptions/$SUB/resourceGroups/$RG" -o json)
APPID=$(echo "$SP" | python3 -c "import sys,json;print(json.load(sys.stdin)['"'"'appId'"'"'])")
SECRET=$(echo "$SP" | python3 -c "import sys,json;print(json.load(sys.stdin)['"'"'password'"'"'])")

az vm run-command invoke -g "$RG" -n "$VM_NAME" --command-id RunPowerShellScript --scripts "
Invoke-WebRequest -Uri https://aka.ms/AzureConnectedMachineAgent -OutFile C:\ArcLab\azcm.msi
Start-Process msiexec.exe -ArgumentList '/i C:\ArcLab\azcm.msi /qn' -Wait
& \"\$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe\" connect ``
  --service-principal-id $APPID --service-principal-secret $SECRET ``
  --tenant-id $TENANT --subscription-id $SUB --resource-group $RG --location $LOCATION
"
```

### Step 5 · Enable SQL Server on the Arc machine

```bash
az connectedmachine extension create \
  --machine-name "$VM_NAME" --name "WindowsAgent.SqlServer" \
  --resource-group "$RG" --location "$LOCATION" \
  --type "WindowsAgent.SqlServer" --publisher "Microsoft.AzureData" \
  --settings '{"SqlManagement":{"IsEnabled":true},"LicenseType":"LicenseOnly","ExcludedSqlInstances":[]}'
```

(Evaluation edition has no Software Assurance → license type **`LicenseOnly`**.)

### Verify & re-check power state

```bash
# Arc resource is Connected
az connectedmachine show -g "$RG" -n "$VM_NAME" --query "{name:name,status:status}" -o table
# VM hardware power state (running / deallocated)
az vm show -d -g "$RG" -n "$VM_NAME" --query powerState -o tsv
```

### Clean up

```bash
az group delete --name "$RG" --yes --no-wait
az ad sp delete --id "$APPID"
```

*Procedure and firewall rules per [Microsoft Learn — Evaluate Azure Arc-enabled servers on an Azure virtual machine](https://learn.microsoft.com/azure/azure-arc/servers/plan-evaluate-on-azure-virtual-machine).*

## Test your understanding

1. Which Azure service gives you a **single query** across all hybrid machines?
2. Name the Azure service that replaces **WSUS/SCCM patching** for Arc machines.
3. What Arc benefit helps you stay secure on **end-of-support** Windows/SQL?
4. Is the Azure Arc **control plane for servers** free or paid for core inventory/policy?

<details markdown="block">
  <summary>Answers</summary>

1. **Azure Resource Graph** (querying resources projected by Arc).
2. **Azure Update Manager.**
3. **Extended Security Updates (ESU)** delivered through Azure Arc.
4. **Free** for core inventory, tagging, and Machine Configuration; attached value-add services are billed separately.

</details>

## Summary of learnings

- Azure Arc's value = **unified inventory + governance + security + operations + data services**.
- It lets you adopt **cloud management practices without migrating workloads first**.
- Core server control-plane capabilities are **free**; you opt into paid services deliberately.
