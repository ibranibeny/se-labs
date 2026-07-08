---
title: "Azure Monitor & Application Insights Overview"
module: app-insights
excerpt: "What Azure Monitor and Application Insights are, and the telemetry types they collect."
level: 100
duration: "15 min"
doc_type: "Concept"
persona: "Developer / SRE"
learning_path: "Observability"
nav_order: 13
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 100 | Developer / SRE | 15 min | After this lab you can explain Azure Monitor, Application Insights, and the telemetry model. |

## Why this matters

You can't operate what you can't see. **Azure Monitor** and **Application Insights** give
you one place to understand health, performance, and reliability — then alert and act.

## Azure Monitor

Azure Monitor is Microsoft's **unified observability service**. It collects **metrics,
logs, traces, and events** from cloud and hybrid resources into a single platform.

![Azure Monitor overview](https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/media/overview/overview.png)
*Data sources sending data to Azure Monitor features. Source: Microsoft Learn.*

## Application Insights

Application Insights is the **APM (Application Performance Monitoring)** feature of Azure
Monitor. You instrument your app with an SDK (or the OpenTelemetry distro); the SDK ships
telemetry to an ingestion endpoint, where it lands in a **Log Analytics workspace** and
becomes explorable through **Application Map, Failures, Performance, Live Metrics, and
Logs (KQL)**.

![Application Insights Application Map](https://learn.microsoft.com/en-us/azure/azure-monitor/app/media/app-insights-overview/app-insights-overview.png)
*Application Insights showing an Application Map. Source: Microsoft Learn.*

## How telemetry flows

```mermaid
%% Colored per the mermaid-diagrams skill (classDef + subgraph style)
flowchart LR
    APP[Your app] --> SDK[App Insights SDK] --> ING[Ingestion endpoint]
    ING --> LA[(Log Analytics workspace)]
    LA --> EXP[Portal experiences<br/>Map · Failures · Performance · Logs]

    classDef app fill:#107C10,stroke:#0B5A0B,color:#ffffff;
    classDef apm fill:#8661C5,stroke:#4B1C77,color:#ffffff;
    classDef data fill:#CC2927,stroke:#8B1A19,color:#ffffff;
    classDef portal fill:#0078D4,stroke:#004578,color:#ffffff;
    class APP app
    class SDK,ING apm
    class LA data
    class EXP portal
```

## Telemetry types

| Type | What it captures | Log Analytics table |
|------|------------------|---------------------|
| **Request** | Each incoming HTTP call, duration, result code | `AppRequests` |
| **Dependency** | Outbound calls (HTTP, SQL, queues, in-memory) | `AppDependencies` |
| **Exception** | Handled/unhandled exceptions with stack traces | `AppExceptions` |
| **Trace** | Log lines (`ILogger`) with severity | `AppTraces` |
| **Custom event / metric** | Business events and KPIs you emit | `AppEvents` / `AppMetrics` |

## Test your understanding

1. Application Insights is a feature of which larger service?
2. Where does telemetry land so you can query it with KQL?
3. Which telemetry type records outbound SQL or HTTP calls?

<details markdown="block">
  <summary>Answers</summary>

1. **Azure Monitor** (App Insights is its APM feature).
2. A **Log Analytics workspace** (`App*` tables).
3. **Dependency** telemetry (`AppDependencies`).

</details>

## Summary of learnings

- **Azure Monitor** = unified metrics/logs/traces/events platform.
- **Application Insights** = APM: instrument → ingest → Log Analytics → portal experiences.
- Telemetry types map to the `App*` tables you'll query later.
