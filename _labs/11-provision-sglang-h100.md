---
title: "Provision SGLang on an H100"
module: self-hosted-inference
excerpt: "Stand up an Azure H100 VM and serve Qwen3.6-35B with SGLang — driven entirely by az vm run-command."
level: 300
duration: "35 min"
doc_type: "How-to"
persona: "AI engineer / cloud engineer"
learning_path: "Self-Hosted Inference"
nav_order: 6
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
| **VM** | `Standard_NC40ads_H100_v5` — 1× NVIDIA H100 NVL, 94 GB, 40 vCPUs |
| **Model** | `Qwen/Qwen3.6-35B-A3B-FP8` (context 262,144) |
| **Server** | SGLang on `127.0.0.1:30000` |
| **Endpoint** | `https://<your-domain>/v1` (region `indonesiacentral`) |

<div class="notice--info" markdown="1">
This lab uses the deploy scripts in the
[sglang-azure-workshop](https://github.com/ibranibeny/sglang-azure-workshop) repo. Clone it
first, then run the numbered scripts in order.
</div>

## Prerequisites

- **H100 quota** for `Standard_NC40ads_H100_v5` in your target region.
- Azure CLI logged in (`az login`) with rights to create VMs and NSG rules.
- A **DNS name** you control, pointed at the VM's public IP (for HTTPS).

## Steps

### 1 · Configure

Clone the repo and edit `deploy/config.sh` with your subscription, resource group,
region, VM name, and domain:

```bash
git clone https://github.com/ibranibeny/sglang-azure-workshop.git
cd sglang-azure-workshop/deploy
$EDITOR config.sh      # set SUBSCRIPTION, RG, LOCATION, VM_NAME, DOMAIN, ...
```

### 2 · Deploy the VM

```bash
./01-deploy.sh         # create the H100 VM (cloud-init installs drivers + SGLang)
./02-start-vm.sh       # ensure the VM is running
```

### 3 · Open the gateway ports

```bash
./03-open-nsg.sh       # allow inbound 80/443 for the Caddy HTTPS gateway
./03b-open-nsg-ports.sh
./04-check-nsg.sh      # verify the NSG rules
```

### 4 · Launch SGLang + gateway

```bash
./05-run-sglang.sh     # start SGLang (loopback) + Caddy (HTTPS + API-key gateway)
```

This binds SGLang to `127.0.0.1:30000` and starts Caddy, which terminates TLS with a
Let's Encrypt certificate and proxies `/v1` to SGLang. Everything runs via
`az vm run-command` — **no SSH required**.

### 5 · (Optional) Keep it healthy

```bash
./06-watchdog.sh       # restart SGLang/Caddy automatically if they stop
```

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
