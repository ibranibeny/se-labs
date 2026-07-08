---
title: "SGLang Endpoint Architecture"
module: sglang-endpoint
excerpt: "How an OpenAI-compatible endpoint is served from a single H100 — SGLang, Caddy, DNS, and the request flow."
level: 200
duration: "20 min"
doc_type: "Concept"
persona: "AI engineer / architect"
learning_path: "SGLang Endpoint"
nav_order: 21
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 200 | AI engineer / architect | 20 min | After this lab you can explain how a self-hosted OpenAI-compatible endpoint is served from one H100 and how a request flows through it. |

## Why this matters

Before deploying, understand the moving parts: a **GPU VM** runs the model, **SGLang**
serves an OpenAI-compatible API on loopback, and **Caddy** adds HTTPS + an API key so it's
safe to expose. No weights ever leave your VM.

## Architecture

```mermaid
%% Colored per the mermaid-diagrams skill (classDef + subgraph style)
flowchart TB
    Client[Client app / curl] -->|HTTPS| DNS[DNS<br/>your-domain]
    DNS -->|A record| PIP[Public IP]
    subgraph Azure["Azure · indonesiacentral · RG sglang-rg"]
        subgraph VM["VM sglang-h100 · Standard_NC40ads_H100_v5"]
            Caddy[Caddy v2<br/>HTTPS :443 · TLS · API-key auth]
            SGLang[SGLang server<br/>127.0.0.1:30000]
            GPU[NVIDIA H100 NVL · 94 GB]
            HF[HF cache · /opt/hf-cache]
        end
    end
    PIP --> Caddy
    Caddy -->|proxy + auth| SGLang
    SGLang --> GPU
    SGLang --> HF

    classDef ext fill:#E6B400,stroke:#8a6d00,color:#3a2f00;
    classDef gw fill:#22C55E,stroke:#15803d,color:#ffffff;
    classDef srv fill:#3B82F6,stroke:#1e40af,color:#ffffff;
    classDef gpu fill:#F59E0B,stroke:#b45309,color:#3a2f00;
    classDef data fill:#8661C5,stroke:#4B1C77,color:#ffffff;
    class Client,DNS,PIP ext
    class Caddy gw
    class SGLang srv
    class GPU gpu
    class HF data
```

## Request flow

```mermaid
%% Colored per the mermaid-diagrams skill
sequenceDiagram
    participant C as Client
    participant CA as Caddy (HTTPS)
    participant SG as SGLang
    participant GPU as H100 GPU
    C->>CA: POST /v1/chat/completions<br/>Authorization: Bearer <API_KEY>
    alt Missing / invalid key
        CA-->>C: 401 Unauthorized
    else Valid key
        CA->>SG: Forward to 127.0.0.1:30000
        SG->>GPU: Run inference
        GPU-->>SG: Generated tokens
        SG-->>CA: JSON response
        CA-->>C: 200 OK + completion
    end
```

## Deployment scripts at a glance

```mermaid
%% Colored per the mermaid-diagrams skill
flowchart LR
    A[00-genkey.sh<br/>API key] --> B[01-deploy.sh<br/>VM + GPU driver]
    B --> C[03-open-nsg.sh<br/>open 22/80/443]
    C --> D[05-run-sglang.sh<br/>launch SGLang + Caddy]
    E[99-destroy.sh<br/>delete everything]

    classDef key fill:#10B981,stroke:#0B5A0B,color:#ffffff;
    classDef vm fill:#3B82F6,stroke:#1e40af,color:#ffffff;
    classDef net fill:#0078D4,stroke:#004578,color:#ffffff;
    classDef app fill:#8B5CF6,stroke:#4B1C77,color:#ffffff;
    classDef del fill:#EF4444,stroke:#991b1b,color:#ffffff;
    class A key
    class B vm
    class C net
    class D app
    class E del
```

## Key ideas

- **OpenAI-compatible:** SGLang exposes `/v1/chat/completions`, tool calling, and SSE
  streaming, so existing OpenAI clients work unchanged.
- **Loopback + gateway:** SGLang binds to `127.0.0.1` only; Caddy is the sole public
  surface, adding TLS and API-key auth.
- **Your data stays put:** the model weights and inference never leave your VM.

## Test your understanding

1. Which component adds HTTPS and API-key authentication?
2. What port does SGLang bind to, and is it public?
3. What happens to a request with a missing or invalid key?

<details markdown="block">
  <summary>Answers</summary>

1. **Caddy** (reverse proxy / TLS terminator).
2. `127.0.0.1:30000` — **loopback only**, not public.
3. Caddy returns **401 Unauthorized** before reaching SGLang.

</details>

## Summary of learnings

- One **H100 VM** runs SGLang; **Caddy** fronts it with HTTPS + API key.
- The endpoint is **OpenAI-compatible** under `/v1`.
- Four scripts take you from key → VM → firewall → serving.
