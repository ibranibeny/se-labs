---
title: "AI in a Day — Knowledge Base Agent"
slug: ai-in-a-day-knowledge-base-agent
excerpt: "A one-day, hands-on hackathon that builds a SharePoint-grounded knowledge-base ingestion pipeline powering a Copilot Studio / Foundry agent with cited answers."
level_range: "L200–L300"
duration_total: "1 day"
order: 11
icon: "fas fa-book"
color: "#0EA5E9"
draft: true
conversations: [ubiquitous-innovation, amplify-intelligence]
solution_areas: [CAIP]
asset_type: "Workshop"
products: [Azure AI Foundry, Azure AI Search, Azure OpenAI, Copilot Studio, Content Understanding, Azure Functions]
---

# AI in a Day — Knowledge Base Agent

> **Draft asset.** Overview extracted from the *Cloud & AI — SE Accelerators* deck
> (May 2026). Full hands-on content, repo, and pricing pack are being developed.

A one-day, hands-on workshop that teaches developers **why and how** to build a
SharePoint-grounded knowledge-base ingestion pipeline that powers a Copilot Studio /
Foundry agent on Azure — grounding answers in customer data with citations.

## The problem

Enterprise knowledge lives in SharePoint — policies, SOPs, contracts, technical specs —
but generic Copilot answers are shallow because the documents are large, unstructured,
and updated continuously. Customers need an agent that stays in sync with SharePoint,
extracts structured content from heterogeneous file types, chunks documents semantically,
surfaces real-time ingestion status, and authenticates with Entra ID / managed identity.

## What you'll do

- **Set the scene** — articulate the business case for SharePoint-grounded agents vs. naive RAG.
- **Design the architecture** — SharePoint → Logic App → Durable Functions → Azure Content Understanding → Cosmos DB / AI Search → Copilot Studio agent.
- **Run it locally** — clone the repo, configure the environment, and execute an end-to-end extraction + chunking run against your own Azure resources.
- **Deploy to Azure** — publish the Function App, configure managed identity, and connect a React monitoring dashboard on Azure Static Web Apps.
- **Ground a Foundry agent** on the resulting AI Search index and demonstrate a working query.
- **Plan the engagement** — leave with a grab-and-go pack (timeline, pricing estimate, GitHub repo).

## Audience & prerequisites

- Software engineers / solution architects building enterprise RAG / knowledge-base agents on Azure.
- Comfortable with Python, TypeScript/React, and the Azure CLI.
- Azure subscription (Contributor + User Access Administrator on a sandbox RG), Azure OpenAI access (chat + embeddings), and Azure Content Understanding preview enrolment.

## Outcome

Customers go from idea to a working agent in **1 day vs. 6–8 weeks** unaided — typical
outcomes include 60–75% reduction in information-retrieval time and 30–40% lift in
self-service deflection, with a clear path to scale.
