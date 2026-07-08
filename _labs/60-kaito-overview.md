---
title: "KAITO Overview & Architecture"
module: kaito-aks
excerpt: "What KAITO is, how it works, and why one manifest replaces hundreds of lines of YAML."
level: 100
duration: "20 min"
doc_type: "Concept"
persona: "Platform / AI engineer"
learning_path: "KAITO on AKS"
nav_order: 27
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 100 | Platform / AI engineer | 20 min | After this lab you can explain what KAITO automates and how a workspace becomes a running inference endpoint. |

## Why this matters

Serving an LLM on Kubernetes normally means provisioning GPU nodes, installing drivers,
downloading weights, deploying vLLM, wiring Services, and adding probes — hundreds of lines
of YAML. **KAITO** collapses all of that into a single **Workspace** custom resource.

## What KAITO does

KAITO (the **Kubernetes AI Toolchain Operator**) watches for a `Workspace` resource and
automatically:

1. **Provisions a GPU node pool** matching the requested instance type.
2. **Configures NVIDIA drivers** on the nodes.
3. **Downloads the model** weights.
4. **Deploys an optimized vLLM preset** inference server.
5. **Creates the Service / networking** and **health checks**.

![Select a model with the AI toolchain operator (KAITO)](https://learn.microsoft.com/en-us/azure/aks/media/aks-extension/kaito/kaito-select-model.png)
*Choosing a model preset; KAITO handles GPU provisioning and serving. Source: Microsoft Learn.*

## Architecture

```mermaid
%% Colored per the mermaid-diagrams skill (classDef + subgraph style)
flowchart TB
    U[Client] -->|HTTP| SVC[Service]
    subgraph AKS["AKS cluster · Azure CNI Overlay"]
        KAITO[KAITO operator]
        subgraph GPU["Auto-provisioned GPU node · NV36ads_A10_v5"]
            VLLM[vLLM inference server]
            MODEL[(Model · Phi-4-mini-instruct)]
        end
        SVC --> VLLM
        VLLM --> MODEL
        KAITO -.creates.-> GPU
        KAITO -.creates.-> SVC
    end
    HL[Headlamp GUI + KAITO plugin] -.manages.-> KAITO
    MON[Prometheus + Grafana] -.scrapes.-> VLLM

    classDef ext fill:#E6B400,stroke:#8a6d00,color:#3a2f00;
    classDef op fill:#0EA5E9,stroke:#0369a1,color:#ffffff;
    classDef gpu fill:#F59E0B,stroke:#b45309,color:#3a2f00;
    classDef srv fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef tool fill:#8661C5,stroke:#4B1C77,color:#ffffff;
    class U ext
    class KAITO,SVC op
    class VLLM,MODEL srv
    class HL,MON tool
```

## Key design decisions

- **KAITO over manual vLLM** — a single CRD replaces 300+ lines of YAML.
- **Headlamp over kubectl** — visual workspace management for demos.
- **Azure CNI Overlay** — required for KAITO node auto-provisioning.
- **`Standard_NV36ads_A10_v5`** — a KAITO-supported GPU SKU with 24 GB VRAM.
- **Phi-4-mini-instruct** — a lightweight model ideal for a single A10.

## Test your understanding

1. What single resource type triggers KAITO to deploy a model?
2. Name three things KAITO automates.
3. Which networking mode is required for KAITO node auto-provisioning?

<details markdown="block">
  <summary>Answers</summary>

1. A **`Workspace`** custom resource.
2. Any three of: GPU node pool, NVIDIA drivers, model download, vLLM inference server, Service/networking, health checks.
3. **Azure CNI Overlay.**

</details>

## Summary of learnings

- KAITO turns a **Workspace** CRD into a fully provisioned GPU inference endpoint.
- It automates GPU nodes, drivers, model download, vLLM, networking, and probes.
- The demo serves **Phi-4-mini-instruct** on a single **A10** GPU.
