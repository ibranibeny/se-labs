---
title: "Spec Kit Overview"
module: spec-kit
excerpt: "The Spec Kit pipeline, its artifacts, and why spec-driven development changes how you build."
level: 100
duration: "20 min"
doc_type: "Concept"
persona: "Developer / architect"
learning_path: "Spec-Driven Development"
nav_order: 24
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 100 | Developer / architect | 20 min | After this lab you can explain the Spec Kit pipeline, its artifacts, and the value of spec-driven development. |

## Why this matters

Traditional coding is trial-and-error: write, test, fix, repeat — with every developer
interpreting best practices differently. **Spec-driven development** flips this: you write
a **machine-readable specification**, and AI generates compliant code from it. Your role
shifts from *code writer* to *solution architect*.

## The paradigm shift

> Rather than developers manually translating requirements into code while remembering
> countless best practices, this approach leverages **comprehensive, machine-readable
> specifications** that define exactly how the solution should be built. — *Microsoft, Specification-Driven Development*

![GitHub Copilot agent mode chat](https://learn.microsoft.com/en-us/sql/tools/visual-studio-code-extensions/github-copilot/media/agent-mode/agent-tool-chat.png)
*GitHub Copilot agent mode drives multi-file generation from your specification. Source: Microsoft Learn.*

## The Spec Kit pipeline

```mermaid
%% Colored per the mermaid-diagrams skill (classDef + subgraph style)
flowchart TB
    A[Feature idea] --> B[/speckit.constitution/<br/>constitution.md]
    B --> C[/speckit.specify/<br/>spec.md]
    C --> D[/speckit.clarify/<br/>refined spec.md]
    D --> E[/speckit.plan/<br/>plan.md + data-model + contracts]
    E --> F[/speckit.tasks/<br/>tasks.md]
    F --> G[/speckit.implement/<br/>source code]
    G --> H[/speckit.analyze/<br/>validation report]

    classDef gov fill:#8661C5,stroke:#4B1C77,color:#ffffff;
    classDef spec fill:#0078D4,stroke:#004578,color:#ffffff;
    classDef build fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef check fill:#D83B01,stroke:#A32D01,color:#ffffff;
    class A,B gov
    class C,D,E,F spec
    class G build
    class H check
```

## The seven commands

| Command | Produces |
|---------|----------|
| `/speckit.constitution` | `constitution.md` — project governance principles |
| `/speckit.specify` | `spec.md` — a structured feature spec from natural language |
| `/speckit.clarify` | a refined `spec.md` with ambiguities resolved |
| `/speckit.plan` | `plan.md` + `data-model.md` + `contracts/` |
| `/speckit.tasks` | `tasks.md` — dependency-ordered, executable tasks |
| `/speckit.implement` | source code (all files), executed by Copilot |
| `/speckit.analyze` | a validation report across all artifacts |

## Key design decisions

- **Structured over ad-hoc** — a repeatable *specify → plan → tasks → implement* pipeline.
- **GitHub Copilot agent mode** — multi-file code generation in VS Code.
- **Artifact traceability** — every implementation decision traces back to a spec requirement.
- **Constitution governance** — project-wide principles enforced across all artifacts.
- **PaaS-first architecture** — the demo uses Azure managed services exclusively.

## Test your understanding

1. Which command defines project-wide governance principles?
2. What artifact does `/speckit.tasks` produce?
3. In spec-driven development, what does the developer's role shift to?

<details markdown="block">
  <summary>Answers</summary>

1. `/speckit.constitution` (produces `constitution.md`).
2. `tasks.md` — dependency-ordered, executable tasks.
3. From **code writer** to **solution architect**.

</details>

## Summary of learnings

- Spec Kit is a **specify → plan → tasks → implement** pipeline with seven commands.
- Every step yields a **traceable artifact**, governed by a **constitution**.
- AI generates **compliant code**, freeing you to design at a higher level.
