---
title: "Fabric inbound & outbound private networking"
slug: fabric-inbound-outbound-private-networking
excerpt: "Trace two independent private paths: a customer-network client into OneLake through workspace Private Link, and Fabric Spark out to Azure SQL through a managed private endpoint. Verify both the intended access and the public paths that should be blocked."
level_range: "L400"
duration_total: "~4 hours"
order: 27
color: "#0078d4"
source_site: "https://ibranibeny.github.io/workshops/fabric-private-networking-l400/"
conversations: [ubiquitous-innovation, amplify-intelligence, modernize-confidence, unified-data-ai-estate]
solution_areas: [CAIP]
asset_type: "Demo"
products: [Fabric, Private Endpoint, VM, SQL Server, Workspace]
---

# Fabric Private Networking L400

Trace and validate two separate private-network flows for Microsoft Fabric: a client in a customer network accessing OneLake through workspace Private Link, and a Fabric Spark workload connecting outbound to an Azure SQL Database through a managed private endpoint. Follow the DNS resolution, endpoint, identity, and network boundaries for each path instead of treating a successful connection as proof that the design is secure.

## Architecture

```mermaid
flowchart LR
  subgraph Customer["Customer network"]
    VM["Developer VM"]
    DNS["Private DNS"]
    WorkspacePE["Workspace private endpoint"]
    VM -->|resolves workspace name| DNS
    DNS -.->|private address| WorkspacePE
  end

  subgraph Fabric["Microsoft Fabric"]
    Workspace["Fabric workspace"]
    OneLake["OneLake"]
    Spark["Fabric Spark runtime"]
    ManagedPE["Managed private endpoint"]
    Workspace --> OneLake
  end

  subgraph Azure["Customer Azure network"]
    SQL["Azure SQL Database"]
  end

  VM -->|workspace Private Link| WorkspacePE
  WorkspacePE --> Workspace
  Spark -->|outbound private connection| ManagedPE
  ManagedPE --> SQL

  Public["Public network"] -.->|blocked when public access is disabled| Workspace
  Public -.->|blocked when public access is disabled| SQL
```

## What you'll verify

- Resolve the workspace endpoint from the customer network and access OneLake over workspace Private Link.
- Inspect the workspace's managed private endpoint and test an Azure SQL connection from Fabric Spark.
- Compare each private-path test with a public-origin attempt; when public access is disabled, confirm that the public path fails.
- Distinguish network reachability and DNS issues from endpoint approval, identity, and database authorization.

Source/reference: [Fabric Private Networking L400 workshop](https://ibranibeny.github.io/workshops/fabric-private-networking-l400/)
