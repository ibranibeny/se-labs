---
title: "Network Security (Defense-in-Depth)"
slug: network-security
excerpt: "Build a layered defense-in-depth network — WAF, Azure Firewall Premium + IDPS, segmentation, forced tunneling, and Bastion-only access — then attack it and read the evidence."
level_range: "L100–L400"
duration_total: "~half a day"
order: 6
icon: "fas fa-shield-halved"
color: "#B4009E"
external_url: "https://ibranibeny.github.io/network-security-workshop/"
source_site: "https://ibranibeny.github.io/network-security-workshop/"
source_repo: "https://github.com/ibranibeny/network-security-workshop"
conversations: [trusted-secure-platform]
solution_areas: [Security]
asset_type: "Workshop"
products: [Azure Firewall, WAF, Front Door, Application Gateway, Bastion, Container Instances, Log Analytics]
---

# Azure Network Security — Defense-in-Depth

Build a small but realistic **defense-in-depth** network in Azure: a **hub-spoke** topology
with **two WAF layers** (Front Door + Application Gateway), **Azure Firewall Premium + IDPS**,
**default-deny** segmentation, **forced tunneling**, **Bastion-only** VM access, and
**centralized telemetry** — then run attack scenarios and prove each control fired.

The full participant workshop — agenda, prerequisites, the six build modules, the nine
validation scenarios, the instructor guide, and the mandatory teardown — is published at
[ibranibeny.github.io/network-security-workshop](https://ibranibeny.github.io/network-security-workshop/).
It is derived from the Microsoft **Azure Network Security PoC** and the **NetSec Demo Lab**
template, deployed to **West US** with idempotent Azure PowerShell.

## The five security ideas it proves

| Idea | Plain language |
|------|----------------|
| **Web Application Firewall (WAF)** | A bouncer that blocks web attacks (SQLi/XSS) before they reach the app |
| **Network segmentation** | Split the network into rooms so a problem can't spread |
| **Default-deny** | Block everything unless explicitly allowed |
| **Forced tunneling** | Send all outbound traffic through one inspected exit (the firewall) |
| **IDPS** | A camera on the firewall that recognizes attack patterns and alerts |

## How traffic flows

```mermaid
%% Colored per the mermaid-diagrams skill (classDef + subgraph style)
flowchart TB
    NET[Internet user] --> FD[Front Door Premium<br/>global WAF · DRS 2.1]
    FD --> AG[App Gateway WAFv2<br/>regional WAF · OWASP 3.2]
    AG -->|public FQDN · HTTP 3000| APP[OWASP Juice Shop<br/>on ACI]
    ACR[Container Registry<br/>juice-shop:latest] -.image import.-> APP
    subgraph Spokes["Spoke VMs (no public IP)"]
        W11[Win11 VM · 10.0.27.4]
        KALI[Kali VM]
        WS[Win Server 2022 VM]
    end
    B[Azure Bastion] -.RDP/SSH.-> Spokes
    Spokes -->|all egress · UDR| FW[Azure Firewall Premium<br/>10.0.25.4 + IDPS]
    FW --> NET
    FW -.-> LAW[Log Analytics]
    FD -.-> LAW
    AG -.-> LAW

    classDef net fill:#E6B400,stroke:#8a6d00,color:#3a2f00;
    classDef waf fill:#0078D4,stroke:#004578,color:#ffffff;
    classDef app fill:#D83B01,stroke:#A32D01,color:#ffffff;
    classDef fw fill:#CC2927,stroke:#8B1A19,color:#ffffff;
    classDef access fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef vm fill:#8661C5,stroke:#4B1C77,color:#ffffff;
    classDef obs fill:#005A9E,stroke:#003966,color:#ffffff;
    class NET net
    class FD,AG waf
    class APP,ACR app
    class FW fw
    class B access
    class W11,KALI,WS vm
    class LAW obs
```

- **Inbound** (a user visiting the app): Front Door → App Gateway → Juice Shop — two WAF layers inspect it.
- **Outbound** (a VM browsing the internet): forced through the firewall by a UDR — firewall rules + IDPS inspect it.
- **Evidence**: Front Door, App Gateway, and the firewall all stream diagnostics into one Log Analytics workspace.

> Juice Shop runs on **Azure Container Instances** (not App Service — sponsored subscriptions cap
> App Service VM quota at 0). The image is imported server-side into a private **Azure Container
> Registry** first, avoiding Docker Hub rate limits. ACI and ACR are public PaaS endpoints outside
> the VNets; App Gateway reaches the container over its public FQDN on port `3000`.

## Build modules

| Module | What it creates |
|--------|-----------------|
| `00-preflight` | Subscription pick/confirm, region/SKU/quota gate, resource group |
| `01-networking` | 3 peered VNets, subnets, public IPs |
| `02-security-core` | Firewall Premium + IDPS policy, default-deny NSGs, UDR, optional DDoS |
| `03-compute` | Win11 + Kali + Win Server 2022 VMs, Azure Bastion |
| `create-aci` | ACR image import + Juice Shop container backend |
| `04-app-delivery` | App Gateway WAFv2 + Front Door Premium |
| `05-monitoring` | Log Analytics + diagnostic settings |

## Validation scenarios (S1–S9)

| # | Scenario | Proves |
|---|----------|--------|
| S1 | WAF attack blocking | Layered L7 protection, Prevention mode |
| S2 | Firewall FQDN filtering | Outbound allow-listing via application rules |
| S3 | Default-deny segmentation | NSG deny-by-default + east-west control |
| S4 | Forced-tunnel egress | `0.0.0.0/0` UDR to the firewall |
| S5 | Outbound IDPS alert | Premium IDPS detection in `AZFWIdpsSignature` |
| S6 | Inbound IDPS via DNAT | Bidirectional inspection *(optional)* |
| S7 | Custom WAF rule | Custom rules complement managed OWASP sets *(optional)* |
| S8 | WAF geo-filtering | Geo-based access control *(optional)* |
| S9 | Telemetry evidence | Correlating allow/deny/block/IDPS events with KQL |

## What you will learn

- **L100** — Defense-in-depth concepts and every service in plain language.
- **L300** — Build the whole lab, stage by stage, with idempotent PowerShell scripts.
- **L400** — Run 9 attack/defense scenarios (WAF blocks, FQDN filtering, IDPS, geo-block…).
- **L300** — Read the evidence in Log Analytics with KQL.

## Prerequisites

- **PowerShell 7+**, the **Az** module, and **Azure CLI**.
- An Azure subscription (VMs use **Bastion**; the app runs on **ACI**).
- Quota for **≥ 6 vCPUs** of `Standard_D2s_v3` in `westus`.
- The [network-security-workshop repo](https://github.com/ibranibeny/network-security-workshop).

<div class="notice--warning" markdown="1">
**Cost:** Firewall Premium ≈ **$1.75/hr**, plus Front Door Premium and App Gateway WAFv2.
Everything lives in one resource group (`rg-netsec-demo`) — **tear it down when done**.
DDoS Protection is intentionally **off** (~$2,944/month).
</div>

## Run the workshop

👉 **[Open the Azure Network Security Workshop ↗](https://ibranibeny.github.io/network-security-workshop/)**
— the published site carries the full agenda, per-module build guides, the S1–S9 validation
labs, the instructor guide, troubleshooting, and the mandatory teardown. The labs below are
the condensed, self-paced path through the same material.
