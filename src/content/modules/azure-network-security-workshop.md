---
title: "Azure Network Security Workshop"
slug: azure-network-security-workshop
excerpt: "The facilitated, full-day delivery of the Azure network security demo lab — agenda, guided build modules, validation labs, instructor material, and a mandatory teardown."
level_range: "L100–L400"
duration_total: "~1 day"
order: 18
icon: "fas fa-network-wired"
color: "#B4009E"
draft: true
external_url: "https://ibranibeny.github.io/network-security-workshop/"
source_site: "https://ibranibeny.github.io/network-security-workshop/"
source_repo: "https://github.com/ibranibeny/network-security-workshop"
conversations: [trusted-secure-platform]
solution_areas: [Security]
asset_type: "Workshop"
products: [Azure Firewall, WAF, Front Door, Application Gateway, Bastion, Log Analytics]
---

# Azure Network Security Workshop

> **Draft asset.** This is a preview entry — the full facilitator and participant
> content lives on its own site. Use the **Open the workshop** button to go there.

The delivery-ready, full-day version of the Azure network security demo lab. It builds a
modernized **hub-and-spoke** environment — Azure Firewall Premium with IDPS, default-deny
NSGs, forced tunneling, Bastion-only VM access, OWASP Juice Shop behind Application
Gateway WAFv2 and Front Door Premium, and centralized Log Analytics — then proves each
control with attack/defense scenarios.

It is derived from the Microsoft **Azure Network Security PoC** and the **NetSec Demo Lab**
template, and re-validated against current Microsoft Learn guidance.

## What it covers

- **Agenda & facilitation** — a timed running order for a guided session, with talking points per build stage.
- **Guided build** — idempotent Azure PowerShell modules (`00-preflight` → `05-monitoring`) with a checkpoint after each stage.
- **Validation labs** — nine attack/defense scenarios: WAF blocks, firewall FQDN filtering, default-deny segmentation, forced-tunnel egress, IDPS alerts, DNAT, custom and geo-blocking WAF rules, and reading the evidence with KQL.
- **Mandatory teardown** — a single resource group and a scripted teardown, because the premium SKUs are expensive.

## Prerequisites

- **PowerShell 7+**, the **Az** module, and **Azure CLI**.
- An Azure subscription with quota for **≥ 6 vCPUs** of `Standard_D2s_v3` in `westus`.

<div class="notice--warning" markdown="1">
**Cost:** Firewall Premium ≈ **$1.75/hr**, plus Front Door Premium and Application Gateway
WAFv2. DDoS Network Protection is intentionally **off** (~$2,944/month). **Tear the lab
down when the session ends.**
</div>

> Looking for the self-paced, step-by-step path instead? See the in-portal
> **Network Security (Defense-in-Depth)** asset.

## Open the workshop

👉 **[Run the Azure Network Security Workshop](https://ibranibeny.github.io/network-security-workshop/)**
