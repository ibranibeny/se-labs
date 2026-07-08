---
title: "Foundry: Bring Your Own Model"
slug: self-hosted-inference
excerpt: "Connect a self-hosted, OpenAI-compatible model endpoint to a Microsoft Foundry agent using Bring Your Own Model (BYOM)."
level_range: "L200–L400"
duration_total: "~50 min"
order: 3
icon: "fas fa-robot"
color: "#7B2FBF"
source_site: "https://ibranibeny.github.io/sglang-azure-workshop/"
source_repo: "https://github.com/ibranibeny/sglang-azure-workshop"
---

# Foundry: Bring Your Own Model (BYOM)

**Connect your own model endpoint to a Microsoft Foundry agent.**

Foundry Agent Service can talk to a model that lives behind **your own gateway** instead of
only the models in Foundry's catalog. Here we connect the self-hosted, OpenAI-compatible
**SGLang endpoint** (Qwen3.6-35B on an H100) to a Foundry agent — no model weights ever
leave your VM.

<div class="notice--info" markdown="1">
**Prerequisite:** deploy the endpoint first in the
[SGLang Endpoint on Azure H100]({{ '/modules/sglang-endpoint/' | relative_url }}) module.
</div>

![Foundry routes agent traffic through your gateway to the model behind it](https://ibranibeny.github.io/sglang-azure-workshop/images/foundry-byom-gateway.png)
*Foundry Agent Service sends agent requests to your gateway, which forwards them to the model hosted behind it. Source: sglang-azure-workshop.*

## What's running

| Item | Detail |
|------|--------|
| **Model** | `Qwen/Qwen3.6-35B-A3B-FP8` — 35B total, ~A3B active, FP8, context 262,144 |
| **GPU / VM** | Azure `Standard_NC40ads_H100_v5` — 1× NVIDIA H100 NVL, 94 GB, 40 vCPUs |
| **Serving** | SGLang on loopback `127.0.0.1:30000`, fronted by Caddy (HTTPS + API-key gateway) |
| **API surface** | OpenAI-compatible under `/v1` — chat completions, tool calling, SSE streaming |
| **Throughput** | ~313 tokens/s decode (measured on the VM) |

## What you will learn

- **L200** — What *Bring Your Own Model* means and when to self-host inference.
- **L400** — Connect the endpoint to a Microsoft Foundry agent (BYOM), field by field.

## Prerequisites

- An **Azure subscription** with **H100 GPU quota** (`Standard_NC40ads_H100_v5`).
- Access to **Microsoft Foundry** (ai.azure.com) with **Foundry User** role on a project
  and **Contributor** on the resource group.
- Azure CLI, a domain name for HTTPS, and the
  [sglang-azure-workshop deploy repo](https://github.com/ibranibeny/sglang-azure-workshop).
