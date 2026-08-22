---
title: "Azure LocalBox Deployment Guide"
slug: azure-localbox-deployment-guide
excerpt: "Deploy and operate Azure Local VM management and AKS Arc with a practical runbook covering control-plane health, networking, image creation, troubleshooting, and PowerShell automation."
level_range: "L300–L400"
duration_total: "~4–6 hours"
order: 22
icon: "fas fa-server"
color: "#0078D4"
external_url: "https://ibranibeny.github.io/azure-localbox-deployment-guide/"
source_site: "https://ibranibeny.github.io/azure-localbox-deployment-guide/"
source_repo: "https://github.com/ibranibeny/azure-localbox-deployment-guide"
conversations: [modernize-confidence]
solution_areas: [CAIP]
asset_type: "Workshop"
products: [Azure Local, Azure Arc, AKS Arc, Hyper-V, PowerShell]
---

# Azure LocalBox Deployment Guide

Take an existing Azure Local deployment from control-plane verification through
managed virtual machines and AKS Arc. This field-focused runbook explains how the
Arc resource bridge, custom locations, logical networks, storage paths, and images
work together, then maps common failures to the layer that owns them.

## What you will do

- Verify Azure prerequisites, role assignments, deployment stages, and Arc
  infrastructure health.
- Build workload logical networks and static IP pools for Azure Local VMs and AKS
  Arc.
- Create and troubleshoot Windows and Linux VM images.
- Provision managed VMs and an AKS Arc cluster.
- Diagnose empty VM blades, image download failures, cross-VLAN connectivity, and
  stopped nested hosts.
- Automate the end-to-end setup with an idempotent PowerShell script.

## Prerequisites

- An existing Azure Local deployment with its nodes registered in Azure.
- Azure CLI and PowerShell 7.
- Azure permissions for provider registration, role assignments, and Azure Local
  resource management.
- Network and DNS details for the management and workload VLANs.

## Open the workshop

👉 **[Open the Azure LocalBox Deployment Guide ↗](https://ibranibeny.github.io/azure-localbox-deployment-guide/)**
