---
title: "Onboard Windows Server & SQL Server"
module: azure-arc
excerpt: "Connect a machine and its SQL Server instance to Azure Arc."
level: 300
duration: "40 min"
doc_type: "How-to"
persona: "IT pro / cloud engineer"
learning_path: "Azure Arc Hands-on"
nav_order: 3
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 300 | IT pro / cloud engineer | 40 min | Connect an existing Windows Server to Azure Arc, then project its SQL Server instance as an Arc-enabled SQL Server resource. |

## Why this matters

This is the practical core of Azure Arc: taking a real Windows machine running SQL
Server and making it a managed Azure resource. The same two-step pattern —
**(1) connect the machine, (2) enable SQL** — scales from one server to thousands.

## Introduction

You'll complete two use cases:

- **Use case 1** — Install the **Azure Connected Machine agent** and connect the Windows
  Server to Azure Arc.
- **Use case 2** — Add the **Azure extension for SQL Server** so the SQL instance is
  projected into Azure as an *Arc-enabled SQL Server* resource.

<div class="notice--info" markdown="1">
**Azure Arc automatically installs** the Azure extension for SQL Server when a
connected machine has SQL Server installed — so in many cases Use Case 2 happens for
you. This lab shows the **explicit** path so you understand each step and can control
the **license type**.
</div>

---

## Two ways to do this lab

| Path | When to use | What runs |
|------|-------------|-----------|
| **A · Automated (workshop)** | You want a working Arc + SQL-Arc environment in minutes to explore the portal. | [`evaluate-arc-on-azure-vm.ps1`](https://github.com/ibranibeny/azure-arc-workshop/blob/main/scripts/evaluate-arc-on-azure-vm.ps1) does **both** use cases end-to-end. |
| **B · Manual (real-world)** | You're onboarding an actual on-prem / other-cloud server. | You run the portal wizard or `azcmagent` yourself (Use case 1 & 2 below). |

### Path A — what the workshop script automates

The script performs, in order, exactly the same two use cases you'll do by hand below —
plus the extra prep needed to *simulate* an on-premises server on an Azure VM (evaluation
only, per [Microsoft Learn](https://learn.microsoft.com/azure/azure-arc/servers/plan-evaluate-on-azure-virtual-machine)):

```mermaid
flowchart LR
    A["1 Create Windows VM<br/>indonesiacentral"] --> B["2 Prepare<br/>MSFT_ARC_TEST + block IMDS"]
    B --> C["3 Install SQL 2022 Eval"]
    C --> D["4 azcmagent connect<br/>&rarr; vm-arc @ southeastasia"]
    D --> E["5 SQL extension<br/>&rarr; sql-arc @ southeastasia"]
    E --> F["6 Reboot<br/>Guest Agent off"]
    classDef vm fill:#e3f2fd,stroke:#1565c0,color:#0d47a1;
    classDef arc fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    classDef sql fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    class A,B,C,F vm; class D arc; class E sql;
```

Mapping to this lab's use cases:

| Script step | Use case | Key command inside the script |
|-------------|----------|-------------------------------|
| Step 4 — onboard | **Use case 1** (create **vm-arc**) | `azcmagent connect ... --location $ArcLocation` |
| Step 5 — SQL extension | **Use case 2** (create **sql-arc**) | `az connectedmachine extension create ... WindowsAgent.SqlServer` |

Two details worth calling out in the code:

- **`-ArcLocation` is separate from `-Location`.** The physical VM stays in
  `indonesiacentral`, but the **Arc server resource and the SQL-Arc extension are created
  in `southeastasia`** — because *SQL Server enabled by Azure Arc* isn't offered in
  Indonesia Central. The Arc resource region is metadata and [may differ from the machine's
  physical location](https://learn.microsoft.com/azure/azure-arc/servers/onboard-service-principal#install-the-agent-and-connect-to-azure).
- **The Guest Agent is only set to `Disabled`, not stopped, until the final reboot** —
  because `az vm run-command` relies on the running Guest Agent to report back, and
  `MSFT_ARC_TEST=true` already lets the Arc agent onboard while it's still running.

Run it (auto-generates a random admin password and prints it at the end):

```powershell
git clone https://github.com/ibranibeny/azure-arc-workshop.git
cd azure-arc-workshop/scripts
./evaluate-arc-on-azure-vm.ps1 -ResourceGroup rg-arc-eval -OpenAllInboundPorts
# tear everything down when finished
./evaluate-arc-on-azure-vm.ps1 -ResourceGroup rg-arc-eval -Cleanup
```

The rest of this lab is **Path B** — the manual, real-world procedure.

---

## Prerequisites

- A **Windows Server 2016+** machine (physical, on-prem VM, or another cloud) that is
  **not** already an Azure VM, with SQL Server installed.
- **Local Administrator** on the machine.
- **Outbound HTTPS (443)** to Azure Arc endpoints (direct or via proxy).
- Azure permissions to register providers and create resources in the target subscription.
- Register the required resource providers (run once per subscription):

```azurecli
az account set --subscription "<your-subscription-id>"

az provider register --namespace Microsoft.HybridCompute --wait
az provider register --namespace Microsoft.GuestConfiguration --wait
az provider register --namespace Microsoft.HybridConnectivity --wait
az provider register --namespace Microsoft.AzureArcData --wait
```

---

## Use case 1 · Connect the Windows Server to Azure Arc

### Objective
Install the Connected Machine agent and register the server as an Arc-enabled server.

### Option A — Portal-generated script (recommended for first time)

1. In the [Azure portal](https://portal.azure.com), search for **Servers - Azure Arc** and select it.
2. Select **Add** → on the **Add a single server** tile, select **Generate script**.
3. Review **Prerequisites**, then **Next**.
4. On **Resource details**, choose the **subscription**, **resource group**, **region**
   (`Indonesia Central`), **operating system** = *Windows*, and **connectivity method**.
5. Add **tags** if desired, then continue.
6. Select **Register** to register resource providers (if prompted), then **Download**
   the generated script.
7. On the Windows Server, open an **elevated 64-bit PowerShell** prompt, change to the
   download folder, and run:

   ```powershell
   ./OnboardingScript.ps1
   ```

   The script downloads the agent from the Microsoft Download Center, installs it,
   creates the Arc-enabled server resource, and connects it. A browser device-login
   prompt completes authentication.

### Option B — Manual install + `azcmagent connect`

1. Download and install the agent silently:

   ```powershell
   # Download the latest Windows agent
   Invoke-WebRequest -Uri "https://aka.ms/AzureConnectedMachineAgent" -OutFile "AzureConnectedMachineAgent.msi"

   # Silent install with a setup log
   msiexec.exe /i AzureConnectedMachineAgent.msi /qn /l*v "C:\Support\Logs\azcmagentsetup.log"
   ```

2. (Optional) Run pre-connection network checks:

   ```powershell
   & "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" check --location "indonesiacentral"
   ```

3. Connect the server to Azure Arc (interactive login):

   ```powershell
   & "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" connect `
     --subscription-id "<your-subscription-id>" `
     --resource-group "rg-arc-workshop" `
     --location "indonesiacentral" `
     --tenant-id "<your-tenant-id>" `
     --tags "Project=ArcWorkshop,Environment=Lab"
   ```

### Verify

Check the agent status locally and confirm in Azure:

```powershell
& "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" show
```

```azurecli
az connectedmachine list --resource-group "rg-arc-workshop" -o table
```

In the portal, open **Azure Arc → Servers** and confirm the machine shows **Connected**.

![Machine connected in the Azure portal (Machines - Azure Arc)](https://learn.microsoft.com/azure/azure-arc/servers/media/quick-enable-hybrid-vm/enabled-machine.png)

<div class="notice--success" markdown="1">
**Tip:** `azcmagent show` reports `Agent Status: Connected` and the assigned Azure Resource ID
when everything is healthy.
</div>

---

## Use case 2 · Enable the SQL Server instance

### Objective
Project the SQL Server instance into Azure as an Arc-enabled SQL Server resource by
installing the **Azure extension for SQL Server**.

### Choose a license type

The license type is **required** when you install the extension. Pick the one that
matches your agreement:

| Value | Use when |
|-------|----------|
| `Paid` | You have **Software Assurance** or a SQL Server subscription. Unlocks the full feature set. |
| `PAYG` | You want **pay-as-you-go** billing through Azure. |
| `LicenseOnly` | Evaluation/trial, dev/test, or licenses **without** Software Assurance. |

### Install the extension with Azure CLI

Run from your workstation (the machine is already Arc-connected):

```azurecli
az connectedmachine extension create \
  --machine-name "<your-machine-name>" \
  --name "WindowsAgent.SqlServer" \
  --resource-group "rg-arc-workshop" \
  --location "indonesiacentral" \
  --type "WindowsAgent.SqlServer" \
  --publisher "Microsoft.AzureData" \
  --settings '{"SqlManagement":{"IsEnabled":true},"LicenseType":"LicenseOnly","ExcludedSqlInstances":[]}'
```

- `SqlManagement.IsEnabled = true` turns on management for the instance.
- `LicenseType` — set to your chosen value above.
- `ExcludedSqlInstances` — list any instance names to skip (space/array separated).

Once installed, the extension **discovers all SQL Server instances** on the machine,
registers them with Azure Arc, and **runs continuously** to detect new instances or
configuration changes automatically.

### Verify the Arc-enabled SQL Server

```azurecli
# List Arc-enabled SQL Server instances in the resource group
az resource list \
  --resource-group "rg-arc-workshop" \
  --resource-type "Microsoft.AzureArcData/sqlServerInstances" \
  -o table
```

In the portal, go to **Azure Arc → SQL Server instances** and confirm your instance
appears with the expected **edition** and **license type**.

![Arc-enabled SQL Server dashboard in the Azure portal](https://learn.microsoft.com/en-us/sql/sql-server/azure-arc/media/overview/arc-sql-server-dashboard.png)

<div class="notice--warning" markdown="1">
**Warning:** If the license type shows **"Configuration needed"**, the onboarding didn't have
enough information to set it automatically. Re-run the extension with an explicit
`LicenseType`, or set the `ArcSQLServerExtensionDeployment` tag on the machine/resource
group/subscription (`Paid`, `PAYG`, `PAYG-Recurring`, or `LicenseOnly`).
</div>

---

## Test your understanding

1. What are the **two steps** to make a SQL Server instance an Arc-enabled resource?
2. Which agent must be installed and connected **before** enabling SQL?
3. Which license type would you choose for an **evaluation/trial** SQL Server?
4. What does the Azure extension for SQL Server do **after** it's installed?

<details markdown="block">
  <summary>Answers</summary>

1. (1) Connect the machine with the Connected Machine agent; (2) install the **Azure extension for SQL Server**.
2. The **Azure Connected Machine agent** (`azcmagent`).
3. **`LicenseOnly`.**
4. It **discovers all SQL instances**, registers them with Azure Arc, and **continuously** detects new instances/config changes.

</details>

## Summary of learnings

- Onboarding is a **two-step** pattern: connect the machine, then enable SQL.
- The **Connected Machine agent** projects the server; the **SQL Server extension** projects the database engine.
- **License type is mandatory** and drives feature availability and billing.
- Azure Arc can **auto-install** the SQL extension, but explicit control is useful for labs and license accuracy.
