---
title: "Operate, Test & Monitor"
module: kaito-aks
excerpt: "Manage the workspace in Headlamp, query the model, and watch vLLM/GPU metrics in Grafana."
level: 300
duration: "30 min"
doc_type: "How-to"
persona: "Platform / AI engineer / SRE"
learning_path: "KAITO on AKS"
nav_order: 29
featured: true
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 300 | Platform / AI engineer / SRE | 30 min | Manage the KAITO workspace visually, run inference, and monitor performance — then clean up. |

## Why this matters

A running endpoint isn't enough — you need to **use** it and **see** how it performs.
Headlamp gives a visual view, and Prometheus + Grafana show vLLM throughput and GPU
utilization.

## Manage with Headlamp + the KAITO plugin

Install [Headlamp](https://headlamp.dev/) and enable the **KAITO plugin** to manage
workspaces visually — view status, logs, and the served model without `kubectl`.

```bash
# Point Headlamp at your cluster
az aks get-credentials --resource-group rg-kaito-demo --name aks-kaito
```

In Headlamp: open **Workspaces**, select `workspace-phi-4-mini`, and confirm it is
**Ready** with the inference pod running.

## Test inference

The KAITO inference Service exposes an OpenAI-compatible API. Port-forward and query it:

```bash
# Forward the inference service locally
kubectl port-forward svc/workspace-phi-4-mini 8080:80

# Chat completion against the served Phi-4-mini model
curl -s http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
        "model": "phi-4-mini-instruct",
        "messages": [{"role":"user","content":"Say hello in one sentence."}]
      }'
```

A JSON completion confirms the model is serving via vLLM.

## Monitor with Prometheus + Grafana

vLLM exposes Prometheus metrics (request rate, latency, tokens/s, GPU utilization). With
Prometheus scraping the inference pod and Grafana dashboards attached, watch:

- **Throughput** — tokens/s and requests/s under load.
- **Latency** — time-to-first-token and end-to-end.
- **GPU utilization** — how busy the A10 is.

<div class="notice--success" markdown="1">
**Tip:** drive a little load (a loop of chat requests) while watching Grafana to see vLLM's
**continuous batching** raise throughput without a matching latency spike.
</div>

## Clean up

Delete everything to stop GPU billing:

```bash
kubectl delete -f workspace-phi.yaml      # remove the workspace (deprovisions the GPU node)
az group delete --name rg-kaito-demo --yes --no-wait
```

<div class="notice--warning" markdown="1">
GPU nodes are the expensive part. Deleting the **Workspace** deprovisions the GPU node;
deleting the resource group removes the cluster and everything else.
</div>

## Test your understanding

1. Which tool gives a visual, no-`kubectl` view of KAITO workspaces?
2. What API surface does the KAITO inference Service expose?
3. What does deleting the `Workspace` deprovision?

<details markdown="block">
  <summary>Answers</summary>

1. **Headlamp** (with the KAITO plugin).
2. An **OpenAI-compatible** API (`/v1/chat/completions`) served by vLLM.
3. The **GPU node** that KAITO auto-provisioned for the workspace.

</details>

## Summary of learnings

- **Headlamp** manages KAITO workspaces visually.
- The endpoint is **OpenAI-compatible** — query it like any chat model.
- **Prometheus + Grafana** reveal vLLM throughput and GPU utilization; always **clean up** GPU nodes.
