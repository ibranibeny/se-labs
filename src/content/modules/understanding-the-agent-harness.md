---
title: "Workshop: Understanding the Agent Harness"
slug: understanding-the-agent-harness
excerpt: "Build and inspect a local travel-planning agent with real Microsoft Foundry inference. Explore how an agent harness coordinates tools, conversation state, execution limits, and exact human approval before writes."
level_range: "L400"
duration_total: "150 minutes + optional 60-minute L400 extension"
order: 26
icon: "fas fa-robot"
color: "#0078D4"
external_url: "https://ibranibeny.github.io/agent-harness-workshop/"
source_site: "https://ibranibeny.github.io/agent-harness-workshop/"
source_repo: "https://github.com/ibranibeny/agent-harness-workshop"
conversations: [ubiquitous-innovation, trusted-secure-platform]
solution_areas: [CAIP]
asset_type: "Workshop"
products: [Microsoft Foundry, Microsoft Entra ID, Node.js, MCP, WebIQ]
---

# Workshop: Understanding the Agent Harness

A model can propose a tool call, but that proposal is not permission to act. This
workshop helps developers and solution architects understand the **agent harness**:
the application code that supplies context, validates tool arguments, executes
permitted actions, returns observations to the model, and stops the loop at
configured limits.

You explore those responsibilities through a local travel-planning agent powered by
real Microsoft Foundry inference. Starting with destination and weather research
through WebIQ MCP, you inspect the execution trace and continue the conversation
toward an itinerary PDF. Before a write can happen, the harness presents the exact
proposal for a human to approve or deny. This makes the distinction between model
reasoning, tool execution, and authorization concrete.

The exercises also separate conversation history from reusable preference memory
and show why continuing a conversation must not replay earlier actions. An optional
L400 engineering extension examines the contracts, failure modes, and enterprise
landing-zone considerations beyond the local lab.

## What you will explore

- The model/tool loop, argument validation, execution limits, and cancellation.
- Actual MCP observations and their corresponding calls in the trace.
- Conversation continuity and explicitly approved preference memory.
- Exact approval previews for PDF, memory, and report writes.
- The boundary between a single-user teaching application and a production design.

## Prerequisites and scope

Use Windows with Node.js 24+, Git, Azure Developer CLI (`azd`), and access to an
existing compatible Microsoft Foundry model deployment. Travel research requires
separately authorized WebIQ MCP access; it is not a general public entitlement.
Live inference incurs charges.

The workshop runs a local Node.js backend; the published site hosts the teaching
material, not the application. It does not deploy Azure infrastructure or a hosted
Foundry Agent Service agent, and it does not implement production email or calendar
writes. Use nonsensitive workshop data.

## Open the workshop

👉 **[Open Understanding the Agent Harness ↗](https://ibranibeny.github.io/agent-harness-workshop/)**
