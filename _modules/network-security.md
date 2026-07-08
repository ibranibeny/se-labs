---
title: "Network Security (Defense-in-Depth)"
slug: network-security
excerpt: "Build a layered defense-in-depth network — WAF, Azure Firewall Premium + IDPS, segmentation, forced tunneling, and Bastion-only access — then attack it and read the evidence."
level_range: "L100–L400"
duration_total: "~3.5 hours"
order: 5
icon: "fas fa-shield-halved"
color: "#B4009E"
---

# Azure Network Security — Defense-in-Depth

Build a small but realistic **defense-in-depth** network in Azure: a **hub-spoke** topology
with **two WAF layers** (Front Door + Application Gateway), **Azure Firewall Premium + IDPS**,
**default-deny** segmentation, **forced tunneling**, **Bastion-only** VM access, and
**centralized telemetry** — then run attack scenarios and prove each control fired.

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
    AG --> APP[OWASP Juice Shop<br/>on ACI]
    subgraph Spokes["Spoke VMs (no public IP)"]
        W11[Win11 VM · 10.0.27.4]
        KALI[Kali VM]
        WS[Win Server 2022 VM]
    end
    B[Azure Bastion] -.RDP/SSH.-> Spokes
    Spokes -->|all egress · UDR| FW[Azure Firewall Premium<br/>10.0.25.4 + IDPS]
    FW --> NET

    classDef net fill:#E6B400,stroke:#8a6d00,color:#3a2f00;
    classDef waf fill:#0078D4,stroke:#004578,color:#ffffff;
    classDef app fill:#D83B01,stroke:#A32D01,color:#ffffff;
    classDef fw fill:#CC2927,stroke:#8B1A19,color:#ffffff;
    classDef access fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef vm fill:#8661C5,stroke:#4B1C77,color:#ffffff;
    class NET net
    class FD,AG waf
    class APP app
    class FW fw
    class B access
    class W11,KALI,WS vm
```

- **Inbound** (a user visiting the app): Front Door → App Gateway → Juice Shop — two WAF layers inspect it.
- **Outbound** (a VM browsing the internet): forced through the firewall by a UDR — firewall rules + IDPS inspect it.

## What you will learn

- **L100** — Defense-in-depth concepts and every service in plain language.
- **L300** — Build the whole lab, stage by stage, with idempotent PowerShell scripts.
- **L400** — Run 8 attack/defense scenarios (WAF blocks, FQDN filtering, IDPS, geo-block…).
- **L300** — Read the evidence in Log Analytics with KQL.

## Prerequisites

- **PowerShell 7+**, the **Az** module, and **Azure CLI**.
- An Azure subscription (VMs use **Bastion**; the app runs on **ACI**).
- The [network-security-workshop repo](https://github.com/ibranibeny/network-security-workshop).

<div class="notice--warning" markdown="1">
**Cost:** Firewall Premium ≈ **$1.75/hr**, plus Front Door Premium and App Gateway WAFv2.
Everything lives in one resource group (`rg-netsec-demo`) — **tear it down when done**.
DDoS Protection is intentionally **off** (~$2,944/month).
</div>
