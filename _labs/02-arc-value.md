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
