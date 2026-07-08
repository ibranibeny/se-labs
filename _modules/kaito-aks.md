---
title: "KAITO on AKS"
slug: kaito-aks
excerpt: "Deploy AI models on Azure Kubernetes Service with one YAML manifest — KAITO automates GPU provisioning, model download, and inference serving."
level_range: "L100–L300"
duration_total: "~1.5 hours"
order: 8
icon: "fas fa-cubes"
color: "#0EA5E9"
source_site: "https://ibranibeny.github.io/Kaito-Deployment/"
source_repo: "https://github.com/ibranibeny/Kaito-Deployment"
---

# KAITO on AKS — AI Model Deployment

Deploy AI models on **Azure Kubernetes Service** with **one YAML manifest**. The
**Kubernetes AI Toolchain Operator (KAITO)** automates GPU provisioning, model
downloading, and inference-server setup — turning ~300 lines of YAML into ~15.

![Select a model with the AI toolchain operator (KAITO)](https://learn.microsoft.com/en-us/azure/aks/media/aks-extension/kaito/kaito-select-model.png)
*The AI toolchain operator (KAITO) provisions the GPU node pool and serves the selected model. Source: Microsoft Learn.*

## Architecture at a glance

| Component | Detail |
|-----------|--------|
| **KAITO** | AI Toolchain Operator — automates model deployment & GPU provisioning |
| **AKS** | Managed Kubernetes cluster |
| **GPU** | `Standard_NV36ads_A10_v5` — NVIDIA A10 (24 GB VRAM) |
| **vLLM** | High-performance inference with continuous batching |
| **Headlamp** | Kubernetes GUI with the KAITO plugin |
| **Monitoring** | Prometheus + Grafana (vLLM metrics & GPU utilization) |

## KAITO vs traditional deployment

| Task | Traditional | With KAITO |
|------|-------------|-----------|
| GPU node pool | Manual creation | ✅ Auto-provisioned |
| NVIDIA drivers | Manual install | ✅ Pre-configured |
| Model download | Init containers + PVC | ✅ Automatic |
| Inference server | Deploy vLLM manually | ✅ Optimized preset |
| Service / networking | Manual Service + Ingress | ✅ Auto-created |
| Health checks | Configure probes | ✅ Built-in |
| Total YAML | ~300–500 lines | **~15 lines** |

## What you will learn

- **L100** — What KAITO is, its architecture, and why it beats manual vLLM deployment.
- **L300** — Create an AKS cluster with KAITO and deploy a model with a workspace manifest.
- **L300** — Operate with Headlamp, test inference, and monitor with Prometheus + Grafana.

## Prerequisites

- An Azure subscription with **GPU quota** for `Standard_NV36ads_A10_v5` in `indonesiacentral`.
- **Azure CLI** + `kubectl`; **Azure CNI Overlay** networking (required for KAITO auto-provisioning).
- The [Kaito-Deployment repo](https://github.com/ibranibeny/Kaito-Deployment).

<div class="notice--info" markdown="1">
Learn more on Microsoft Learn:
[Deploy an AI model on AKS with the AI toolchain operator](https://learn.microsoft.com/azure/aks/ai-toolchain-operator).
</div>
