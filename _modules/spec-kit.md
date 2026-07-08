---
title: "Spec-Driven Development (Spec Kit)"
slug: spec-kit
excerpt: "Turn natural-language feature ideas into production-ready code with GitHub Copilot Spec Kit — a structured specify → plan → tasks → implement pipeline."
level_range: "L100–L300"
duration_total: "~2.5 hours"
order: 7
icon: "fas fa-wand-magic-sparkles"
color: "#24292F"
source_site: "https://ibranibeny.github.io/Overview-Github-Spec-kit/"
source_repo: "https://github.com/ibranibeny/Overview-Github-Spec-kit"
---

# Spec-Driven Development with GitHub Spec Kit

Accelerate software delivery with AI-powered specification and implementation using
**GitHub Copilot Spec Kit** — a structured workflow that transforms natural-language
feature descriptions into **production-ready code**.

![GitHub Copilot plan created in the IDE](https://learn.microsoft.com/en-us/visualstudio/ide/media/visualstudio/copilot-plan-agent/copilot-plan-created.png)
*GitHub Copilot produces a reviewable plan before generating code — the heart of spec-driven development. Source: Microsoft Learn.*

## The Spec Kit pipeline

```mermaid
%% Colored per the mermaid-diagrams skill (classDef + subgraph style)
flowchart LR
    A[Feature idea] --> B[/speckit.constitution/]
    B --> C[/speckit.specify/]
    C --> D[/speckit.clarify/]
    D --> E[/speckit.plan/]
    E --> F[/speckit.tasks/]
    F --> G[/speckit.implement/]
    G --> H[/speckit.analyze/]
    H --> Z[Done]

    classDef gov fill:#8661C5,stroke:#4B1C77,color:#ffffff;
    classDef spec fill:#0078D4,stroke:#004578,color:#ffffff;
    classDef build fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef check fill:#D83B01,stroke:#A32D01,color:#ffffff;
    class A,Z gov
    class B gov
    class C,D spec
    class E,F spec
    class G build
    class H check
```

Each step produces a traceable artifact: `constitution.md` → `spec.md` → refined spec →
`plan.md` + `data-model.md` + `contracts/` → `tasks.md` → source code → validation report.

## What you'll build

A complete **Azure Cost Monitoring Tool** using the Spec Kit workflow — demonstrating a
project constitution, a feature specification, automated planning, task decomposition,
**AI-powered implementation of all 88 tasks**, and quality analysis.

| Layer | Tech | Azure host |
|-------|------|------------|
| Frontend | React + Vite + TypeScript | Static Web Apps |
| Backend | Python + FastAPI | App Service Linux |
| Database | PostgreSQL 16 | Flexible Server (VNet) |
| Scheduler | Azure Functions (Timer) | Consumption |
| Secrets | Key Vault | Standard |
| Networking | Hub-Spoke VNet | Azure Firewall |
| Monitoring | Application Insights | Log Analytics |

## What you will learn

- **L100** — The Spec Kit pipeline, artifacts, and why spec-driven development matters.
- **L200** — Author a **constitution** and turn an idea into a clarified **specification**.
- **L300** — Generate the **plan** and **tasks**, then **implement** and **analyze** with Copilot.

## Prerequisites

- **VS Code** with **GitHub Copilot** (agent mode) enabled.
- The Spec Kit prompts/agents installed in your repo (`.github/prompts`, `.specify/`).
- Basic familiarity with Git and the Azure CLI.

<div class="notice--info" markdown="1">
The Spec Kit workflow is **technology-agnostic** — the Azure Cost Monitoring Tool is just a
demonstration project. Read more on Microsoft Learn:
[spec-driven database design with plan mode](https://learn.microsoft.com/sql/tools/visual-studio-code-extensions/github-copilot/plan-mode).
</div>
