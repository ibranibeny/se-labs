---
title: "Fabric NL2GQL"
slug: fabric-nl2gql
excerpt: "Build a natural-language-to-GQL workflow over ecommerce data with Microsoft Foundry, Azure Container Apps, and Microsoft Fabric Graph, with explicit authorization and offline versus live validation gates."
level_range: "L400"
order: 25
icon: "fas fa-project-diagram"
color: "#117865"
draft: true
external_url: "https://ibranibeny.github.io/fabric-nl2gql-demo/"
source_site: "https://ibranibeny.github.io/fabric-nl2gql-demo/"
source_repo: "https://github.com/ibranibeny/fabric-nl2gql-demo"
conversations: [unified-data-ai-estate, ubiquitous-innovation]
solution_areas: [CAIP]
asset_type: "Workshop"
products: [Microsoft Fabric, Fabric Graph, Microsoft Foundry, Azure Container Apps, Fabric Data Agent, Microsoft Entra ID]
---

# Fabric NL2GQL

> **Draft asset.** The full workshop lives on the source site. Its deployment
> package has been validated locally, but not deployed to participant resources;
> successful live integration requires fresh execution evidence.

## Background

Business questions often span relationships between customers, orders, and
products rather than a single table. A graph makes these connections explicit,
but querying it still requires knowledge of the data model and query language.
Natural-language-to-GQL (NL2GQL) explores how an AI-assisted interface can help
users ask those questions while keeping query execution and authorization under
application control. Here, **GQL means Graph Query Language, not GraphQL**.

## Workshop overview

This English-language, L400 hands-on workshop uses fictional ContosoDemo
ecommerce data across 11 sequential labs. Participants progress from seven-table
data preparation and a separate semantic model to Fabric ontology/Graph,
Foundry integration, authorization, and deployment.

The browser sends a question to one Azure Container App. Microsoft Foundry
requests a graph query, and the app acts as a function executor—not a second AI
agent—running a bounded, read-only GQL statement against the configured Fabric
graph with the signed-in user's delegated token. Direct Graph execution is the
primary path; Fabric Data Agent through MCP is an optional comparison.

## Learning objectives

- Prepare the ecommerce data and distinguish the roles of the semantic model,
  ontology, and graph when answering relationship-based questions.
- Connect Foundry tool calls to a single Azure Container Apps executor and return
  graph results to the natural-language conversation.
- Apply bounded, read-only query execution and understand why prompts alone are
  not security controls.
- Explain managed identity access to Foundry versus delegated user access to
  Fabric, including application consent and cross-tenant approval requirements.
- Compare direct GQL execution with the optional Fabric Data Agent MCP path.
- Use offline validation before approved deployment, then check live
  authorization, routing, capacity, and query results rather than treating a
  passing local test or health response as proof of integration.

## Audience and prerequisites

For data engineers, AI application developers, and solution architects working
with Fabric and Azure. Bring approved Azure and Fabric resources, active Fabric
capacity, application consent, source access, and PowerShell 7.2+ for the setup
helpers. Start with Lab 0 and follow the guide's resource and authorization
checks; use the offline path when consent or capacity is not ready.

## Open the workshop

👉 **[Open the Fabric NL2GQL workshop ↗](https://ibranibeny.github.io/fabric-nl2gql-demo/)**
