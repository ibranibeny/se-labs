---
title: "Observability with App Insights"
slug: app-insights
excerpt: "Instrument a .NET 8 API, deploy it to Azure, and watch every Application Insights experience light up with real telemetry."
level_range: "L100–L400"
duration_total: "~1.5 hours"
order: 4
icon: "fas fa-chart-line"
color: "#8661C5"
source_site: "https://ibranibeny.github.io/ApplicationInsights-AzureDemo/"
source_repo: "https://github.com/ibranibeny/ApplicationInsights-AzureDemo"
---

# Observability with Azure Monitor & Application Insights

**Deploy a fully instrumented .NET 8 API to Azure and watch every Application Insights
experience light up with real telemetry** — requests, failures, slow operations,
dependencies, and a live Application Map.

![Azure Monitor overview](https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/media/overview/overview.png)
*Azure Monitor collects metrics, logs, traces, and events into one platform. Source: Microsoft Learn.*

## What you'll build

A small **.NET 8 web API** on **Azure Container Instances**, instrumented with the
Application Insights SDK. Its endpoints each generate a distinct kind of telemetry so you
can demonstrate the full observability story: **Live Metrics**, **Application Map**,
**Failures**, **Performance**, **Logs (KQL)**, custom metrics/events, and an
auto-provisioned **Failure Anomalies** alert.

## Architecture at a glance

| Layer | Resource | Role |
|-------|----------|------|
| Compute | Azure Container Instance (`appi-demo-web`) | Runs the .NET 8 API on port 8080 |
| Registry | Azure Container Registry (Basic) | Stores `webdemo:latest` |
| Monitoring | Application Insights (workspace-based) | APM, Map, Failures, Performance |
| Data | Log Analytics workspace | Stores all ingested telemetry (`App*` tables) |
| Alerting | Failure Anomalies rule | Smart detection on the App Insights resource |

## What you will learn

- **L100** — What Azure Monitor and Application Insights are, and the telemetry types.
- **L200** — How to enable App Insights: autoinstrumentation vs. code-based SDK.
- **L300** — Deploy the instrumented demo and verify telemetry ingestion.
- **L400** — Explore the portal and render a 5-service distributed Application Map.

## Prerequisites

- **Azure CLI** + the `application-insights` extension, **PowerShell 5.1+**, an Azure subscription.
- No local Docker — the image is built in the cloud with `az acr build`.
- The [ApplicationInsights-AzureDemo repo](https://github.com/ibranibeny/ApplicationInsights-AzureDemo).
