---
title: "Azure Resiliency & DR"
slug: azure-resiliency
excerpt: "Simulate disaster recovery and automatic multi-region failover with Azure Front Door, SQL Failover Groups, and hub-spoke networking."
level_range: "L200–L400"
duration_total: "~3 hours"
order: 3
icon: "fas fa-shield-alt"
color: "#107C10"
source_site: "https://ibranibeny.github.io/azure-resiliency-workshop/"
source_repo: "https://github.com/ibranibeny/azure-resiliency-workshop"
---

# Azure Resiliency & Disaster Recovery

**Simulate disaster recovery and automatic failover** between **Southeast Asia**
(primary / on-prem sim) and **Indonesia Central** (Azure cloud) using **Azure Front Door**,
**SQL Failover Groups**, and **hub-spoke** networking.

> **Goal:** When the frontend in Southeast Asia is stopped, Azure Front Door automatically
> switches traffic to Indonesia Central, with Azure SQL data synchronized via Failover
> Groups — **zero application code changes required**.

```mermaid
%% Colored per the mermaid-diagrams skill (classDef + subgraph style)
flowchart TB
    U[Users] --> AFD[Azure Front Door<br/>global load balancer]
    subgraph SEA["Southeast Asia · Primary"]
        FWS[Azure Firewall Basic] --> VMS[Frontend VM<br/>Node.js + Nginx + PM2]
        VMS --> PES[(Private Endpoint)]
        PES --> SQLS[(SQL Server SEA<br/>Primary R/W)]
    end
    subgraph IDC["Indonesia Central · Secondary"]
        FWI[Azure Firewall Basic] --> VMI[Frontend VM<br/>Node.js + Nginx + PM2]
        VMI --> PEI[(Private Endpoint)]
        PEI --> SQLI[(SQL Server IDC<br/>Secondary R/O)]
    end
    AFD -->|Priority 1| FWS
    AFD -->|Priority 2 · failover| FWI
    SQLS -->|Async geo-replication · RPO < 5s| SQLI

    classDef edge fill:#0078D4,stroke:#004578,color:#ffffff;
    classDef fw fill:#D83B01,stroke:#A32D01,color:#ffffff;
    classDef vm fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef sql fill:#CC2927,stroke:#8B1A19,color:#ffffff;
    class AFD,U edge
    class FWS,FWI fw
    class VMS,VMI vm
    class SQLS,SQLI,PES,PEI sql
    style SEA fill:#eaf7ea,stroke:#107C10,color:#0B5A0B
    style IDC fill:#eaf3fb,stroke:#0078D4,color:#003350
```

## Key components

| Component | Role |
|-----------|------|
| **Azure Front Door** | Global load balancing with health probes |
| **Azure Firewall (Basic)** | Centralized DNAT & traffic inspection |
| **Hub-Spoke VNets** | Network segmentation & security |
| **Private Endpoints** | Secure SQL access without public IPs |
| **SQL Failover Groups** | Automatic geo-replication & failover |
| **Node.js app** | Simple social-media CRUD demo |

## What you will learn

- **L200** — The resiliency architecture: hub-spoke, Front Door, and failover groups.
- **L300** — Deploy the full multi-region topology with the Azure CLI.
- **L300** — How SQL Failover Groups and Private Endpoints keep data available.
- **L400** — Run the live failover demo (stop primary → auto-failover → recover).

## Prerequisites

- **Azure CLI 2.60+**, Bash 4.0+, Git 2.30+, and an SSH key pair.
- An Azure subscription with capacity in **`southeastasia`** and **`indonesiacentral`**.
- The [azure-resiliency-workshop repo](https://github.com/ibranibeny/azure-resiliency-workshop).
