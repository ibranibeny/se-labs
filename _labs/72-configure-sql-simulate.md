---
title: "Configure SQL & Simulate Errors"
module: analyze-sql-logs
excerpt: "Install SQL Server on the VM and generate realistic error events to fill the Event table."
level: 500
duration: "25 min"
doc_type: "How-to"
persona: "Cloud / SQL engineer"
learning_path: "Analyze SQL Logs with Arc & AI"
nav_order: 32
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 500 | Cloud / SQL engineer | 25 min | Ensure SQL Server is running and generate **Application-log error events** so the AI app has real data to analyse. |

## Step 1 — Install / verify SQL Server on the VM

If you're **continuing from the Azure Arc module**, the Arc VM already has **SQL Server 2022**.
Otherwise, the workshop installs **SQL Server Express** unattended via `az vm run-command`:

```bash
source .env
bash scripts/deploy-sql-express.sh
```

This runs remotely on the VM and:

1. Downloads SQL Server 2022 Express silently.
2. Configures TCP/IP on port **1433** and opens the Windows Firewall.
3. Enables the SQL Server Browser service.
4. Verifies the installation.

Health-check the VM and SQL service:

```bash
bash scripts/check-vm-sql.sh
```

| Check | Expected |
|-------|----------|
| VM power state | running |
| Guest agent | ready |
| SQL Server service | `MSSQL$SQLEXPRESS` running |
| TCP port 1433 | listening |
| AMA extension | provisioned |

## Step 2 — Simulate SQL error events

Generate a mix of **Warning / Error / Critical** Application events so the `Event` table has
signal to query:

```bash
source .env
bash scripts/simulate-errors.sh
```

Typical simulated events (all land in the Windows **Application** log → **`Event`** table):

- **Login failures** (e.g. `Login failed for user` / error 18456).
- **Deadlocks** and long-running query warnings.
- **Backup / IO** warnings and severity-level errors.

<div class="notice--success" markdown="1">
**No script?** You can trigger events manually: connect to the instance and run a failing query,
force a `RAISERROR(..., 16, 1)`, or stop/start the SQL service. Application-log Warning/Error
events flow to the `Event` table within a couple of minutes.
</div>

## Step 3 — Confirm ingestion

```bash
LAW_ID="$(az monitor log-analytics workspace show -g "$RESOURCE_GROUP" -n "$LAW_NAME" --query customerId -o tsv)"

az monitor log-analytics query --workspace "$LAW_ID" \
  --analytics-query "Event | where EventLevelName in ('Error','Warning','Critical') | summarize count() by Source, EventLevelName | order by count_ desc" \
  --timespan PT1H -o table
```

You should see rows with `Source` = `MSSQLSERVER` / `MSSQL$SQLEXPRESS`.

## Troubleshooting

| Symptom | Check | Fix |
|---------|-------|-----|
| `Event` table empty after 30 min | AMA extension status | must show `ProvisioningState: Succeeded` |
| Events not flowing | DCR association | `az monitor data-collection rule association list --resource $VM_ID -o table` |
| Only system events, no SQL | SQL not running | re-run `check-vm-sql.sh` then `deploy-sql-express.sh` |

## Summary of learnings

- The **`Event`** table is the single source of truth for SQL/Windows errors.
- **Severity XPath** filtering keeps ingestion focused (and costs down).
- With real error events in place, the AI app has data to reason over.

Next: **[Deploy the AI app](../73-deploy-ai-app/)**.
