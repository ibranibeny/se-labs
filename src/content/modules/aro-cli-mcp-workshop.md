---
title: "Deploy ARO. Connect OpenShift. Operate it through MCP."
slug: aro-cli-mcp-workshop
excerpt: "Create a managed-identity Azure Red Hat OpenShift cluster with Azure CLI, deploy the Kubernetes MCP server, and query the live cluster from GitHub Copilot in VS Code."
level_range: "L300"
duration_total: "90–120 minutes"
order: 19
icon: "fas fa-dharmachakra"
color: "#EE0000"
external_url: "https://ibranibeny.github.io/aro-cli-mcp-workshop/"
source_site: "https://ibranibeny.github.io/aro-cli-mcp-workshop/"
source_repo: "https://github.com/ibranibeny/aro-cli-mcp-workshop"
conversations: [modernize-confidence, ubiquitous-innovation]
solution_areas: [CAIP]
asset_type: "Workshop"
products: [Azure Red Hat OpenShift, OpenShift CLI, Kubernetes MCP Server, GitHub Copilot, Visual Studio Code, Azure CLI, Helm]
---

# Deploy ARO. Connect OpenShift. Operate it through MCP.

Provision an **Azure Red Hat OpenShift (ARO)** cluster with user-assigned managed
identities using Azure CLI, install the OpenShift CLI in Azure Cloud Shell, deploy the
**Kubernetes MCP server** into the cluster, and operate the live platform from
**GitHub Copilot Agent mode** in Visual Studio Code.

## What you will do

- Validate Azure permissions, regions, resource providers, and the 44-core ARO quota gate.
- Deploy the network, nine managed identities and their role assignments, and the cluster.
- Install `oc` in Cloud Shell, retrieve credentials, and confirm nodes report `Ready`.
- Deploy the read-only Kubernetes MCP server with Helm and bind `cluster-reader`.
- Register the MCP endpoint in VS Code and run prompt labs against the live cluster.
- Work through the troubleshooting map, then clean up the endpoint and the cluster.

## Prerequisites

- An Azure subscription with Contributor + User Access Administrator (or Owner) rights.
- Azure CLI 2.84.0 or later, Bash, and at least 44 available regional vCPUs.
- VS Code with GitHub Copilot Chat.

> **Cost and security notice:** ARO provisions billable compute, networking, storage, and
> OpenShift licenses. The MCP Route used in the workshop has no client authentication by
> default — keep the MCP ServiceAccount read-only, prefer `oc port-forward`, and add
> OAuth/OIDC before any production use.

## Open the workshop

👉 **[Open the ARO CLI + MCP Workshop ↗](https://ibranibeny.github.io/aro-cli-mcp-workshop/)**
