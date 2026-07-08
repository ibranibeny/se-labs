---
title: "Deploy AKS with KAITO & a Model"
module: kaito-aks
excerpt: "Create an AKS cluster with the AI toolchain operator, then serve a model with a workspace manifest."
level: 300
duration: "35 min"
doc_type: "Build lab"
persona: "Platform / AI engineer"
learning_path: "KAITO on AKS"
nav_order: 28
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 300 | Platform / AI engineer | 35 min | Create an AKS cluster with KAITO enabled and deploy Phi-4-mini-instruct with a single manifest. |

## Why this matters

This is the payoff: one `az aks create` and one small YAML file give you a
GPU-accelerated inference endpoint — KAITO does the rest.

![Add a GPU node pool for AI model deployment](https://learn.microsoft.com/en-us/azure/aks/aksarc/media/deploy-ai-model/add-gpu-node-pool.png)
*KAITO auto-provisions a GPU node pool for the workload. Source: Microsoft Learn.*

## Prerequisites

- **GPU quota** for `Standard_NV36ads_A10_v5` in `indonesiacentral`.
- Azure CLI logged in (`az login`) and `kubectl` installed.

```bash
az extension add --name aks-preview
az provider register --namespace Microsoft.ContainerService
```

## Step 1 · Create an AKS cluster with KAITO

Enable the **AI toolchain operator** add-on (and OIDC issuer) on a new cluster:

```bash
az group create --name rg-kaito-demo --location indonesiacentral

az aks create \
  --resource-group rg-kaito-demo \
  --name aks-kaito \
  --enable-ai-toolchain-operator \
  --enable-oidc-issuer \
  --network-plugin azure --network-plugin-mode overlay \
  --node-count 2 \
  --generate-ssh-keys

az aks get-credentials --resource-group rg-kaito-demo --name aks-kaito
kubectl get pods -n kube-system | grep kaito
```

<div class="notice--info" markdown="1">
**Azure CNI Overlay** (`--network-plugin-mode overlay`) is required so KAITO can
auto-provision GPU nodes. For the exact commands used by the workshop, see the
[Kaito-Deployment repo](https://github.com/ibranibeny/Kaito-Deployment).
</div>

## Step 2 · Deploy a model with a Workspace manifest

Save as `workspace-phi.yaml`:

```yaml
apiVersion: kaito.sh/v1beta1
kind: Workspace
metadata:
  name: workspace-phi-4-mini
resource:
  instanceType: "Standard_NV36ads_A10_v5"
  labelSelector:
    matchLabels:
      apps: phi-4-mini
inference:
  preset:
    name: phi-4-mini-instruct
```

Apply it and watch KAITO provision the GPU node, download the model, and start vLLM:

```bash
kubectl apply -f workspace-phi.yaml

# Watch the workspace become Ready (GPU node provisioning takes several minutes)
kubectl get workspace workspace-phi-4-mini -w
```

## Step 3 · Verify

```bash
# Workspace conditions should show ResourceReady and InferenceReady = True
kubectl describe workspace workspace-phi-4-mini

# The auto-created inference Service
kubectl get svc workspace-phi-4-mini
```

<div class="notice--warning" markdown="1">
GPU node provisioning + model download can take **10–20 minutes** on first run. The
`Workspace` status moves to **Ready** when the endpoint is serving.
</div>

## Summary of learnings

- `--enable-ai-toolchain-operator` turns on KAITO on an AKS cluster.
- A ~15-line **Workspace** manifest deploys a model end-to-end.
- KAITO auto-provisions the **A10 GPU node**, downloads the model, and serves it with **vLLM**.
