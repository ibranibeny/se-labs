---
title: "Wire it into Microsoft Foundry (BYOM)"
module: self-hosted-inference
excerpt: "Connect your self-hosted Qwen3.6-35B endpoint to a Microsoft Foundry agent, field by field."
level: 400
duration: "30 min"
doc_type: "Build lab"
persona: "AI engineer / architect"
learning_path: "Foundry BYOM"
nav_order: 6
featured: true
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 400 | AI engineer / architect | 30 min | Register your self-hosted endpoint in Foundry as a Bring Your Own Model connection and use it in an agent. |

## Why this matters

The model is running and secured. Now you connect it to **Microsoft Foundry** so agents can
use it — following the official *Bring Your Own Model* flow with the real parameters from
your SGLang deployment.

<div class="notice--info" markdown="1">
**Prerequisite:** deploy and secure the endpoint first in the
[SGLang Endpoint on Azure H100]({{ '/modules/sglang-endpoint/' | relative_url }}) module.
</div>

## Parameters (ready to copy)

| Field | Value |
|-------|-------|
| **Connection name** | `Qwen_36_on_H100_VM` |
| **Base URL** | `https://<your-domain>/v1` — *no* `/chat/completions` (Foundry appends it) |
| **API key** | The value from `deploy/.secrets/api_key` (sent in the `api-key` header) |
| **API key header name** | *Leave blank* (defaults to `api-key`) |
| **Name (model id)** | `Qwen3.6-35B-A3B-FP8` — no slash, no `Qwen/` prefix |

<div class="notice--warning" markdown="1">
**Model id must have no slash.** Foundry ModelGateway only allows letters, digits, `-`, `_`,
and `.` in `model_id`. Use `Qwen3.6-35B-A3B-FP8`, **not** `Qwen/Qwen3.6-35B-A3B-FP8`.
</div>

## Steps in the Foundry portal

### A · Open the wizard

1. Sign in to [Microsoft Foundry](https://ai.azure.com/).
2. Go to **Operate → Admin console**.
3. Open the **All projects** tab and click your project link in the *Parent resource* column.
4. Select the **Admin-connected models** tab, then click **Add**.

### 1 · Connection type

| Field | Value |
|-------|-------|
| Connection type | **Other source** (self-hosted / OpenAI-compatible) |
| Connection name | `Qwen_36_on_H100_VM` |
| Base URL | `https://<your-domain>/v1` |

Click **Next**.

### 2 · Authentication

Paste your **API key**. Leave **API key header name** blank so Foundry uses the default
`api-key` header.

### 3 · Model configuration

Set **Name** to `Qwen3.6-35B-A3B-FP8` (no slash). Register the model.

### 4 · Advanced

Accept defaults unless your environment requires otherwise, then **Add** the connection.

## Use it in an agent

The deployment model name for the agent is `<connection-name>/<deployment-name>`:

```
Qwen_36_on_H100_VM/Qwen3.6-35B-A3B-FP8
```

Example environment variables for the Agent SDK (Python):

```bash
FOUNDRY_PROJECT_ENDPOINT="https://<account>.services.ai.azure.com/api/projects/<project>"
FOUNDRY_MODEL_DEPLOYMENT_NAME="Qwen_36_on_H100_VM/Qwen3.6-35B-A3B-FP8"
```

<div class="notice--info" markdown="1">
If you get **`model not found`**, make sure `FOUNDRY_MODEL_DEPLOYMENT_NAME` uses the
`<connection>/<deployment>` format — not just the model name.
</div>

## Verify

- **Connection status** — under *Connected resources*, the connection should be **Active**.
  If it's *Inactive*, re-check the Base URL and credentials.
- **Test prompt** — send a request through the agent; a reply means routing through the
  gateway works.
- **Gateway log** — check the Caddy log on the VM; you should see the request arrive from
  Agent Service.

<div class="notice--info" markdown="1">
**Permissions:** the **Foundry User** role (or higher) on the project, and **Contributor**
on the resource group to deploy the connection. Your endpoint already serves HTTPS with a
valid public Let's Encrypt certificate — fully supported by Foundry.
</div>

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| *Invalid model_id … can only contain alphanumeric…* | The **Name** contains a slash. Edit the model and change `Qwen/Qwen3.6-35B-A3B-FP8` → `Qwen3.6-35B-A3B-FP8`. |
| **Connection Inactive / 401 Unauthorized** | Wrong/rotated API key or Base URL. Re-paste the key; confirm the URL ends in `/v1`. |
| **400 · LoRA adapter '…' was requested** | Don't request a LoRA the server didn't load; call the base model id. |
| *Failed to add secrets… could not access your Key Vault* | Check your permissions on the project's Key Vault, then retry **Add**. |

## Test your understanding

1. What must the **Base URL** end with — and what must it *not* include?
2. What is the correct **deployment name format** used by the agent?
3. Why must the model **Name** avoid a `/`?

<details markdown="block">
  <summary>Answers</summary>

1. It must end with **`/v1`** and must **not** include `/chat/completions` (Foundry appends it).
2. **`<connection>/<deployment>`**, e.g., `Qwen_36_on_H100_VM/Qwen3.6-35B-A3B-FP8`.
3. Foundry **ModelGateway** only allows letters, digits, `-`, `_`, `.` in `model_id`.

</details>

## Summary of learnings

- Foundry connects to your endpoint via **Other source (OpenAI-compatible)** BYOM.
- Base URL ends in **`/v1`**; the model id has **no slash**.
- Agents reference the model as **`<connection>/<deployment>`**.
- You verified routing end-to-end: agent → gateway → SGLang on the H100.
