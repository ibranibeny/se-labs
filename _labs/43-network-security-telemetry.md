---
title: "Read the Telemetry in Log Analytics"
module: network-security
excerpt: "Prove every control produced evidence — query the firewall, IDPS, and WAF logs with KQL."
level: 300
duration: "20 min"
doc_type: "How-to"
persona: "Security engineer / analyst"
learning_path: "Network Security"
nav_order: 20
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 300 | Security engineer / analyst | 20 min | Query the centralized logs to prove each control from the scenarios fired. |

## Why this matters

Each service streams logs through its **diagnostic setting** into the `NS-LA-demo` workspace.
This lab turns "it worked" into "here's the data that proves it."

## Confirm data is arriving

```powershell
$wsId = az monitor log-analytics workspace show -g rg-netsec-demo -n NS-LA-demo --query customerId -o tsv
az monitor log-analytics query --workspace $wsId `
  --analytics-query "union withsource=T * | where TimeGenerated > ago(1h) | summarize Count=count() by T | order by Count desc" -o table
```

## Useful tables

| Table | What it shows |
|-------|---------------|
| `AZFWApplicationRule` | Outbound FQDN allow/deny decisions (S2/S3/S4) |
| `AZFWNetworkRule` | Network-level allow/deny decisions |
| `AZFWDnsQuery` | DNS proxy lookups from the VMs |
| `AZFWIdpsSignature` | IDPS signature alerts (S5/S6) |
| `AzureDiagnostics` (`FrontDoorWebApplicationFirewallLog`) | Front Door WAF blocks (S1) |
| `AzureDiagnostics` (`ApplicationGatewayFirewallLog`) | App Gateway WAF blocks (S7/S8) |

## Query examples

```kusto
// Allowed vs blocked websites (firewall application rules)
AZFWApplicationRule
| where TimeGenerated > ago(1h)
| project TimeGenerated, SourceIp, Fqdn, Action, Rule, ActionReason
| order by TimeGenerated desc
```

```kusto
// IDPS signature alerts
AZFWIdpsSignature
| where TimeGenerated > ago(1h)
| project TimeGenerated, SourceIp, DestinationIp, Description, Action
| order by TimeGenerated desc
```

```kusto
// Front Door WAF blocks (S1)
AzureDiagnostics
| where Category == "FrontDoorWebApplicationFirewallLog"
| where TimeGenerated > ago(1h)
| project TimeGenerated, action_s, ruleName_s, clientIP_s, requestUri_s
| order by TimeGenerated desc
```

## Viewing logs in the portal (no commands)

- **Log Analytics workspace** `NS-LA-demo` → **Logs** → paste a query → **Run**. Filter by `Action == "Deny"`.
- **Firewall** `NS-FW-demo` → **Monitoring → Logs** (pre-scoped) or **Metrics** (no-KQL charts like "Application rules hit count", split by Allow/Deny).
- **Front Door** `NS-FD-demo` / **App Gateway** `NS-AG-WAFv2-demo` → **Monitoring → Logs** for WAF blocks.
- Both Firewall and WAF ship built-in **Workbooks** (dashboards) with ready-made charts.

<div class="notice--warning" markdown="1">
**Ingestion lag is normal.** The first write to a brand-new resource-specific (Dedicated)
table can take **10–20 minutes**; afterwards logs land in ~1–5 minutes. If a query is empty,
wait and re-run.
</div>

<div class="notice--info" markdown="1">
**Column names matter.** In the Dedicated `AZFWApplicationRule` table the fields are
`Action`, `Fqdn`, `Rule`, `RuleCollection`, `ActionReason`, `SourceIp` — **not** `RuleName`.
If a query fails with `SEM0100 … Failed to resolve … 'RuleName'`, inspect the schema first
with `AZFWApplicationRule | take 1`.
</div>

## Test your understanding

1. Which table holds IDPS signature alerts?
2. Which category in `AzureDiagnostics` holds Front Door WAF blocks?
3. Why might a fresh query return no rows even though the control fired?

<details markdown="block">
  <summary>Answers</summary>

1. **`AZFWIdpsSignature`.**
2. **`FrontDoorWebApplicationFirewallLog`.**
3. **Ingestion lag** — the first write to a new Dedicated table can take 10–20 minutes.

</details>

## Summary of learnings

- All controls log to **one workspace** (`NS-LA-demo`) via **diagnostic settings**.
- Firewall/IDPS use `AZFW*` tables; WAFs use `AzureDiagnostics` categories.
- Expect **ingestion lag**; mind exact **column names** in Dedicated tables.
