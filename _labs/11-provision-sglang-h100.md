---
title: "Provision SGLang on an H100"
module: sglang-endpoint
excerpt: "Stand up an Azure H100 VM and serve Qwen3.6-35B with SGLang — driven entirely by az vm run-command."
level: 300
duration: "35 min"
doc_type: "How-to"
persona: "AI engineer / cloud engineer"
learning_path: "SGLang Endpoint"
nav_order: 22
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 300 | AI / cloud engineer | 35 min | Deploy an Azure H100 VM and serve Qwen3.6-35B with SGLang, exposing an OpenAI-compatible `/v1` endpoint. |

## Why this matters

This is where the model comes online. You provision a single **H100** VM, launch **SGLang**
bound to loopback, and front it with an HTTPS gateway — all without SSH, using
`az vm run-command`.

## What you deploy

| Item | Detail |
|------|--------|
| **Resource group** | `sglang-rg` |
| **VM** | `sglang-h100` · `Standard_NC40ads_H100_v5` — 1× NVIDIA H100 NVL, 94 GB, 40 vCPUs |
| **OS** | Ubuntu 24.04 LTS + NVIDIA GPU driver extension, 512 GB OS disk |
| **Networking** | `sglang-vnet` / `sglang-subnet` / `sglang-nsg` (inbound 22, 80, 443) + `sglang-pip` |
| **Model** | any HuggingFace model — default `Qwen/Qwen3.6-35B-A3B-FP8` (`TP_SIZE=1`) |
| **Serving** | SGLang (`lmsysorg/sglang`) on `127.0.0.1:30000`, Caddy TLS on `:443` |
| **Endpoint** | `https://<TLS_DOMAIN>/v1` (region `indonesiacentral`) |

<div class="notice--info" markdown="1">
This lab uses the deploy scripts in the
[sglang-azure-workshop](https://github.com/ibranibeny/sglang-azure-workshop) repo. Clone it
first, then run the numbered scripts in order.
</div>

## Prerequisites

- **H100 quota** for `Standard_NC40ads_H100_v5` in `indonesiacentral` (40 vCPUs).
- **Azure CLI** authenticated (`az login`); WSL2/Ubuntu or Linux.
- A **domain name** (optional) for Let's Encrypt — leave `TLS_DOMAIN` empty for a
  self-signed cert / IP access.
- A **Hugging Face token** (`HF_TOKEN`) only if the model is gated.

## Configure (`deploy/config.sh`)

```bash
git clone https://github.com/ibranibeny/sglang-azure-workshop.git
cd sglang-azure-workshop
$EDITOR deploy/config.sh
```

Key variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `RESOURCE_GROUP` | `sglang-rg` | Resource group |
| `LOCATION` | `indonesiacentral` | Azure region |
| `VM_NAME` | `sglang-h100` | VM name |
| `VM_SIZE` | `Standard_NC40ads_H100_v5` | 1× H100 NVL (94 GB) |
| `VM_IMAGE` | `Canonical:ubuntu-24_04-lts:server:latest` | OS image |
| `MODEL_PATH` | `Qwen/Qwen3.6-35B-A3B-FP8` | Any HuggingFace model |
| `TP_SIZE` | `1` | Tensor-parallel GPUs |
| `SGLANG_PORT` | `30000` | Loopback SGLang port |
| `TLS_DOMAIN` | `openai.contoso.day` | Domain (empty = self-signed cert) |
| `HF_TOKEN` | *(empty)* | Required only for gated models |

For a gated model, export the token before deploying:

```bash
export HF_TOKEN=hf_xxxxxxxxxxxxxxxx
```

## Deploy

```bash
cd deploy
bash 00-genkey.sh      # generate the API key → .secrets/api_key
bash 01-deploy.sh      # create the H100 VM + NVIDIA driver
bash 03-open-nsg.sh    # open inbound 22 / 80 / 443
bash 05-run-sglang.sh  # launch SGLang + Caddy (downloads model, starts serving)
```

Optional helpers: `02-start-vm.sh` (ensure running), `04-check-nsg.sh` (verify rules),
`06-watchdog.sh` (auto-restart if a container stops), `99-destroy.sh` (tear everything down).

SGLang binds to `127.0.0.1:30000`; Caddy terminates TLS on `:443` (Let's Encrypt when
`TLS_DOMAIN` is set, otherwise a self-signed cert) and proxies `/v1` to SGLang.

## Verify

The `/health` endpoint needs no auth and is safe to probe:

```bash
curl -fsS https://<your-domain>/health
```

A successful response means the gateway is up and SGLang is loaded. (Chat calls under
`/v1` require the API key — you create that in the next lab.)

<div class="notice--success" markdown="1">
**Tip:** `nvidia-smi` on the VM should report ~95,830 MiB (≈ 94 GB) in use once the FP8
model is loaded.
</div>

## Clean up

When you're done with the whole module, tear everything down:

```bash
./99-destroy.sh        # delete the VM and associated resources
```

## Summary of learnings

- A single **H100** VM can serve Qwen3.6-35B with SGLang under `/v1`.
- The deploy is **SSH-free**, driven by `az vm run-command` and cloud-init.
- Caddy provides **HTTPS**; SGLang stays on **loopback**, never exposed directly.
