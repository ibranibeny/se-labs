---
title: "SGLang Endpoint on Azure H100"
slug: sglang-endpoint
excerpt: "Deploy an OpenAI-compatible LLM endpoint on a single Azure H100 with SGLang behind a Caddy HTTPS + API-key gateway."
level_range: "L200–L300"
duration_total: "~1.5 hours"
order: 2
icon: "fas fa-server"
color: "#3B82F6"
source_site: "https://ibranibeny.github.io/sglang-azure-workshop/"
source_repo: "https://github.com/ibranibeny/sglang-azure-workshop"
---

# SGLang Endpoint on Azure H100

Deploy **Qwen3.6-35B-A3B-FP8** (or **any HuggingFace model**) on a single Azure **H100**
GPU, served via **SGLang** behind a **Caddy** HTTPS reverse-proxy with API-key
authentication — an **OpenAI-compatible** endpoint you fully own.

```text
https://<your-domain>/v1/chat/completions
```

## What's running

| Item | Detail |
|------|--------|
| **VM** | `sglang-h100` · `Standard_NC40ads_H100_v5` — 1× NVIDIA H100 NVL, 94 GB, 40 vCPUs |
| **OS** | Ubuntu 24.04 LTS + NVIDIA GPU driver extension |
| **Serving** | SGLang (`lmsysorg/sglang`) on `127.0.0.1:30000` |
| **Gateway** | Caddy v2 — HTTPS `:443` (Let's Encrypt or self-signed) + API-key auth |
| **Model** | any HuggingFace model — default `Qwen/Qwen3.6-35B-A3B-FP8` |
| **Region** | `indonesiacentral` (resource group `sglang-rg`) |

## What you will learn

- **L200** — The architecture and request flow of a self-hosted OpenAI-compatible endpoint.
- **L300** — Provision the H100 VM and launch SGLang + Caddy with the repo scripts.
- **L300** — Secure the endpoint with an API key and test it with OpenAI-style calls.

<div class="notice--info" markdown="1">
Want to use this endpoint from a **Microsoft Foundry** agent? See the separate
[Foundry: Bring Your Own Model]({{ '/modules/self-hosted-inference/' | relative_url }}) module.
</div>

## Prerequisites

- An Azure subscription with **H100 quota** in `indonesiacentral`.
- **Azure CLI** authenticated (`az login`); WSL2/Ubuntu or Linux.
- A domain (optional, for Let's Encrypt) and a Hugging Face token (only for gated models).
- The [sglang-azure-workshop repo](https://github.com/ibranibeny/sglang-azure-workshop).
