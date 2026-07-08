---
title: "Run the Failover Demo"
module: azure-resiliency
excerpt: "Stop the primary region and watch traffic and data fail over to the secondary — then recover."
level: 400
duration: "30 min"
doc_type: "Build lab"
persona: "Cloud engineer / architect"
learning_path: "Azure Resiliency"
nav_order: 12
featured: true
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 400 | Cloud engineer / architect | 30 min | Trigger a real failover: stop the primary, observe automatic re-routing, then recover — with no data loss. |

## Why this matters

This is the payoff. You'll break the primary region on purpose and watch Azure Front Door
and SQL Failover Groups keep the app alive — then bring it back and confirm every post is
still there.

## Demo flow

```mermaid
%% Colored per the mermaid-diagrams skill (classDef + subgraph style)
flowchart LR
    A[App running in SEA] --> B[Create a post] --> C[Verify sync to IDC]
    C --> D[Stop SEA app] --> E[Health probe fails 30–60s] --> F[Front Door routes to IDC]
    F --> G[Create post during failover] --> H[Restart SEA app] --> I[Traffic returns to SEA]
    I --> J[All posts visible · synced]

    classDef normal fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef fail fill:#D83B01,stroke:#A32D01,color:#ffffff;
    classDef recover fill:#0078D4,stroke:#004578,color:#ffffff;
    class A,B,C normal
    class D,E,F,G fail
    class H,I,J recover
```

## Step-by-step

### 1 · Verify normal operation
- Open the app via the **Front Door URL**.
- Confirm the region banner shows **"Southeast Asia"** (green).
- Create a post: `Hello from SEA!`

### 2 · Verify data sync
- Open the **Indonesia Central** endpoint directly.
- Confirm the SEA post appears (Failover Group sync **< 5s**).

### 3 · Simulate failure

```bash
# SSH to the SEA VM and stop the app
sudo systemctl stop nginx
# or
pm2 stop all
```

### 4 · Observe failover
- Wait **30–60 seconds** for the Front Door health probe to fail.
- Refresh the Front Door URL.
- The region banner changes to **"Indonesia Central"** (blue).

### 5 · Test during failover
- Create a new post: `Hello from IDC during failover!`
- Confirm it saves — IDC now handles writes via the Failover Group.

### 6 · Recovery

```bash
# Restart the SEA app
sudo systemctl start nginx
# or
pm2 start all
```

- Front Door detects SEA is healthy again and returns traffic to the primary.
- **All posts created during failover are visible** — synced back.

<div class="notice--info" markdown="1">
**Optional — force the SQL primary manually** (e.g., to demo a planned failover):

```bash
az sql failover-group set-primary \
  --name "fg-resiliency-workshop" \
  --resource-group "resiliency-rg-global" \
  --server "resiliency-sql-idc"
```
</div>

## Success criteria

| Check | Expected |
|-------|----------|
| Both regions serve the same app | ✅ |
| SQL sync < 5 seconds | ✅ |
| Front Door detects SEA failure | ✅ |
| Auto-failover to IDC | ✅ |
| Posts during failover preserved | ✅ |
| Traffic returns to SEA on recovery | ✅ |

## Test your understanding

1. How long does Front Door take to detect the failure and re-route?
2. During failover, which database handles writes?
3. After recovery, what happens to posts created while SEA was down?

<details markdown="block">
  <summary>Answers</summary>

1. **~30–60 seconds** (health-probe interval + failure threshold).
2. The **Indonesia Central** database — promoted to primary by the Failover Group.
3. They **remain and sync back** to SEA — no data loss.

</details>

## Summary of learnings

- You triggered a **real regional failover** with no app code changes.
- **Front Door** re-routes traffic; **Failover Groups** move the data primary.
- Recovery is automatic and **data is preserved** across the whole cycle.

<div class="notice--warning" markdown="1">
**Don't forget cleanup:** `cd scripts && ./04-cleanup.sh` to delete all resource groups.
</div>
