---
title: "Talk to Your Logs — Elasticsearch"
slug: talk-to-your-logs-elasticsearch
excerpt: "A hybrid demo that lets ops and business teams ask natural-language questions against Elasticsearch operational and transaction logs, answered by Foundry GPT-4o + AI Search."
level_range: "L300"
duration_total: "0.5 day"
order: 13
icon: "fas fa-magnifying-glass-chart"
color: "#0E7490"
draft: true
conversations: [amplify-intelligence, modernize-confidence]
solution_areas: [CAIP]
asset_type: "Demo"
products: [Azure AI Foundry, GPT-4o, Azure AI Search, Elasticsearch, Kibana, Streamlit, MCP]
---

# Talk to Your Logs — Elasticsearch

> **Draft asset.** Overview extracted from the *Cloud & AI — SE Accelerators* deck
> (May 2026). Full demo assets and repo are being developed.

A proof-of-concept demonstrating a **hybrid cloud architecture** where operational and
transaction logs are queried in plain English. On-premises systems are simulated in Azure,
while Azure AI services provide the natural-language layer.

## Demo scenario

An operations and business-analytics team oversees an e-commerce platform where
application logs, system metrics, and transaction events are continuously generated.
Instead of navigating multiple dashboards and writing complex queries, users ask questions
like *"Show current system health issues"*, *"Which services have the most errors today?"*,
or *"Who are the top buyers by transaction volume?"* and get clear, explainable answers.

## Architecture

- **On-prem simulation (4 VMs in Azure):** an e-commerce app (Nginx + Flask) generating transaction logs, Zabbix infrastructure monitoring, an **Elasticsearch** store with **Kibana** + **Logstash**, and a **Streamlit** AI chatbot frontend + MCP server backend.
- **Azure cloud services:** **Azure AI Foundry** (GPT-4o + embeddings) and **Azure AI Search** enable natural-language querying of all operational logs.

## Flow

A customer browses the shop, adds to cart, and checks out → events are logged to
Elasticsearch → viewable in Kibana → synced to Azure AI Search with vector embeddings →
queryable via natural language (e.g. *"Show me failed payment orders today"*). Log and
event data is semantically indexed, correlated, and analyzed by AI to return explainable
answers, giving engineering, operations, and business teams a single interface.

> **Related:** the SQL Server variant of this accelerator is already in the catalog as
> **Analyze SQL Logs with Arc & AI**.
