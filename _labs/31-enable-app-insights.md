---
title: "Enable Application Insights"
module: app-insights
excerpt: "Two ways to get telemetry flowing: codeless autoinstrumentation vs. the code-based SDK."
level: 200
duration: "15 min"
doc_type: "How-to"
persona: "Developer"
learning_path: "Observability"
nav_order: 14
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 200 | Developer | 15 min | Choose and apply the right way to enable Application Insights for your app. |

## Why this matters

There are two ways to get telemetry into Application Insights. Knowing when to use each
saves time and gives you the right level of control.

## Option A — Autoinstrumentation (codeless)

On supported hosts (**Azure App Service, Azure Functions, AKS**) you flip a toggle in the
portal — **no code change**. The platform injects the agent for you.

<div class="notice--info" markdown="1">
**Note (Microsoft Learn):** for App Service on Linux published as a container,
autoinstrumentation supports **single-container apps only**. For full control, use
code-based instrumentation with the **Azure Monitor OpenTelemetry Distro**.
</div>

## Option B — Code-based SDK (what this demo uses)

This demo runs on **Azure Container Instances**, so it enables Application Insights **in
code** via the SDK — three steps:

**1 · Create an Application Insights resource** and copy its connection string.

**2 · Add the SDK and register it** (`Program.cs`):

```csharp
var builder = WebApplication.CreateBuilder(args);

// Reads APPLICATIONINSIGHTS_CONNECTION_STRING from configuration/env automatically.
builder.Services.AddApplicationInsightsTelemetry();
```

**3 · Provide the connection string at runtime** as an environment variable:

```text
APPLICATIONINSIGHTS_CONNECTION_STRING = InstrumentationKey=...;IngestionEndpoint=...
```

That's exactly what `scripts/deploy-aci.ps1` injects as a **secure environment variable**
into the container.

## Which should I choose?

| Use autoinstrumentation when… | Use the code-based SDK when… |
|-------------------------------|------------------------------|
| Host is App Service / Functions / AKS | Host is ACI, VMs, or elsewhere |
| You want zero code changes | You want full control / custom telemetry |
| Quick enablement | You emit custom events/metrics |

## Test your understanding

1. Which hosts support codeless autoinstrumentation?
2. Which single line registers the SDK in a .NET minimal API?
3. How does the app receive its connection string in this demo?

<details markdown="block">
  <summary>Answers</summary>

1. **Azure App Service, Azure Functions, and AKS.**
2. `builder.Services.AddApplicationInsightsTelemetry();`
3. As the **`APPLICATIONINSIGHTS_CONNECTION_STRING`** environment variable (injected securely by the deploy script).

</details>

## Summary of learnings

- **Autoinstrumentation** = codeless, on supported PaaS hosts.
- **Code-based SDK** = one line + a connection string; full control (used here on ACI).
- The connection string flows in as a secure **env var** at runtime.
