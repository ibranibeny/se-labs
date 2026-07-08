---
title: "Plan, Tasks & Implement"
module: spec-kit
excerpt: "Generate the implementation plan and task list, then let Copilot build and validate the solution."
level: 300
duration: "40 min"
doc_type: "Build lab"
persona: "Developer / architect"
learning_path: "Spec-Driven Development"
nav_order: 26
featured: true
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 300 | Developer / architect | 40 min | Turn a clarified spec into a plan and tasks, then implement and analyze the solution with Copilot. |

## Why this matters

This is where the specification becomes software. Copilot reads your clarified `spec.md`,
produces an architecture and plan, decomposes it into ordered tasks, and then writes the
code — all traceable back to requirements.

![GitHub Copilot plan created in the IDE](https://learn.microsoft.com/en-us/visualstudio/ide/media/visualstudio/copilot-plan-agent/copilot-plan-created.png)
*Copilot generates a reviewable plan from the specification before writing code. Source: Microsoft Learn.*

## Step 4 · Plan

```markdown
/speckit.plan
```

Generates `plan.md` plus helper artifacts — commonly `data-model.md`, `research.md`,
`quickstart.md`, and a `contracts/` folder (e.g., `parameters.md`, `outputs.md`). Review the
architecture and data model, then commit.

## Step 5 · Tasks

```markdown
/speckit.tasks
```

Analyzes the plan and produces `tasks.md` — a **dependency-ordered, executable** task list
(the demo project decomposes into **88 tasks**). Iterate by editing `tasks.md` or re-running
the prompt.

## Step 6 · Implement

```markdown
/speckit.implement
```

Copilot works through `tasks.md`, checking off each task (`[X]`) as it goes, validating
readiness checklists, and generating all solution files. Review each change with **Keep** or
tweak as needed.

<div class="notice--warning" markdown="1">
Results vary with your inputs, the chosen LLM, and the current Spec Kit version. Always
**review and approve** generated changes — spec-driven development keeps you in control.
</div>

## Step 7 · Analyze (optional)

```markdown
/speckit.analyze
```

Produces a validation report that checks **consistency across the spec, plan, and tasks** —
catching drift before you ship. Commit the report.

## The full artifact chain

```mermaid
%% Colored per the mermaid-diagrams skill
flowchart LR
    S[refined spec.md] --> P[plan.md + data-model + contracts]
    P --> T[tasks.md · 88 tasks]
    T --> C[source code]
    C --> A[validation report]

    classDef spec fill:#0078D4,stroke:#004578,color:#ffffff;
    classDef build fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef check fill:#D83B01,stroke:#A32D01,color:#ffffff;
    class S,P,T spec
    class C build
    class A check
```

## From artifacts to Azure

Once the code is generated (e.g., Bicep for the infra), deploy it:

```bash
az deployment group what-if --resource-group <rg> --template-file main.bicep --parameters main.bicepparam
az deployment group create  --resource-group <rg> --template-file main.bicep --parameters main.bicepparam
```

Then integrate the generated templates into your CI/CD (GitHub Actions / Azure DevOps).

## Test your understanding

1. Which command produces the dependency-ordered task list?
2. What does `/speckit.implement` mark on each completed task in `tasks.md`?
3. What does `/speckit.analyze` validate?

<details markdown="block">
  <summary>Answers</summary>

1. `/speckit.tasks` (produces `tasks.md`).
2. A checkbox `[X]` next to each completed task.
3. **Consistency across the spec, plan, and tasks** (catches drift).

</details>

## Summary of learnings

- `/speckit.plan` → `/speckit.tasks` → `/speckit.implement` turns a spec into working code.
- The demo decomposes into **88 traceable tasks**, executed by Copilot with your review.
- `/speckit.analyze` validates consistency before you ship — then deploy to Azure.
